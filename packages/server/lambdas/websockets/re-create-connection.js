const Responses = require("../common/api-responses");
const WebSocket = require("../common/web-socket-message");
const Dynamo = require("../common/dynamo");
const getPlayerWithMessage = require("../common/get-player-with-message");
const tableName = process.env.tableName;
const indexName = process.env.indexName;
const logger = require("../common/logger");

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

    let oldPlayerRow;
    oldPlayerRow = await Dynamo.get(oldConnectionId, tableName);
    // there is some kind of bug which i dont understand
    // sometimes old id is not available but new id is available
    // so if no results available for old id try new id
    // this probably happens if second recreate connection is called with new id as old id
    if (!oldPlayerRow.tableId) {
      oldPlayerRow = await Dynamo.get(newConnectionId, tableName);
    }

    if (oldPlayerRow.tableId) {
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

      logger({
        message: "re- create-conneciton.js: 51",
        debug_type: "RECREATE_CONNECTION_LOADDING",
        newConnectionId,
        event,
        oldConnectionId,
        oldPlayerRow,
        updatedPlayerRow,
        tableId,
      });
      const records = await Dynamo.query(
        tableName,
        indexName,
        "tableId",
        tableId
      );
      const players = records.Items.map((player) => player);
      await WebSocket.send({
        domainName,
        stage,
        connectionID: newConnectionId,
        message: JSON.stringify({ players, action: "sendRecreateConnection" }),
      });
    }
    return Responses._200({ message: "connected" });
  } catch (e) {
    console.log(e);
  }
};
