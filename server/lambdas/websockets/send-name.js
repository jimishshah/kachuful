const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const WebSocket = require("../common/web-socket-message");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  console.log("event", event);

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

    try {
      await WebSocket.send({
        domainName,
        stage,
        connectionID,
        message: "This is a reply to your message",
      });
      console.log("sent message");
    } catch (e) {
      console.log(e);
    }

    // const records = await Dynamo.scan(tableName, "tableId", "1234567890");
    // const allConnectionIds = records.Items.map(
    //   ({ ID: connectionID }) => connectionID
    // );

    // //send connected users list to all the users
    // const messages = records.Items.map(
    //   ({ ID: connectionID, domainName, stage }) =>
    //     WebSocket.send({
    //       domainName,
    //       stage,
    //       connectionID,
    //       message: JSON.stringify({ allConnectionIds }),
    //     })
    // );
    // await Promise.all(messages);

    return Responses._200({ message: "got a message" });
  } catch (error) {
    return Responses._400({ message: "message could not be received" });
  }
};
