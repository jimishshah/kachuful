const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const WebSocket = require("../common/web-socket-message");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  const { connectionId: connectionID } = event.requestContext;

  const body = JSON.parse(event.body);

  try {
    const record = await Dynamo.get(connectionID, tableName);
    const { domainName, stage } = record;

    const { playerName } = body.message;

    const data = {
      ...record,
      playerName,
    };
    await Dynamo.write(data, tableName);

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
    console.log(`${playerName} added`);
    return Responses._200({ message: "got a message" });
  } catch (error) {
    console.log(error);
    return Responses._400({ message: "message could not be received" });
  }
};
