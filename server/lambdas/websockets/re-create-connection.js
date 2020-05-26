const Responses = require("../common/api-responses");
const WebSocket = require("../common/web-socket-message");
const Dynamo = require("../common/dynamo");
const getPlayerWithMessage = require("../common/get-player-with-message");
const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const {
      connectionId: newConnectionId,
      domainName,
      stage,
    } = event.requestContext;
    let {
      messageBody: { oldConnectionId },
    } = await getPlayerWithMessage(event);

    const oldPlayerRow = await Dynamo.get(oldConnectionId, tableName);
    const updatedPlayerRow = {
      ...oldPlayerRow,
      ID: newConnectionId,
      oldConnectionId,
      isDisconnected: false,
    };

    await Promise.all([
      Dynamo.delete(oldConnectionId, tableName),
      Dynamo.write(updatedPlayerRow, tableName),
    ]);

    const { tableId } = oldPlayerRow;

    const records = await Dynamo.scan(tableName, "tableId", tableId);
    const players = records.Items.map((player) => player);
    await WebSocket.send({
      domainName,
      stage,
      connectionID: newConnectionId,
      message: JSON.stringify({ players, action: "sendRecreateConnection" }),
    });

    if (!oldPlayerRow.isDisconnected) {
      await WebSocket.send({
        domainName,
        stage,
        connectionID: oldConnectionId,
        message: JSON.stringify({ players, action: "sendCloseSession" }),
      });
    }
    return Responses._200({ message: "connected" });
  } catch (e) {
    console.log(e);
  }
};
