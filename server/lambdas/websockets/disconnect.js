const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const WebSocket = require("../common/web-socket-message");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const { connectionId: connectionID } = event.requestContext;

    await Dynamo.delete(connectionID, tableName);

    const records = await Dynamo.scan(tableName, "tableId", "1234567890");
    const players = records.Items.map(({ playerName, ID: connectionID }) => ({
      playerName,
      connectionID,
    }));
    //send connected users list to all the users
    const messages = records.Items.map(
      ({ ID: connectionID, domainName, stage }) =>
        WebSocket.send({
          domainName,
          stage,
          connectionID,
          message: JSON.stringify({ players, action: "sendPlayers" }),
        })
    );
    await Promise.all(messages);

    return Responses._200({ message: "disconnected" });
  } catch (e) {
    console.log(e);
  }
};
