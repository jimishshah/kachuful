const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const WebSocket = require("../common/web-socket-message");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  const { connectionId: connectionID } = event.requestContext;

  try {
    const record = await Dynamo.get(connectionID, tableName);
    const { domainName, stage } = record;

    try {
      await WebSocket.send({
        domainName,
        stage,
        connectionID,
        message: JSON.stringify({
          message: "pong",
          action: "sendPong",
        }),
      });
      console.log("sent message");
    } catch (e) {
      console.log(e);
    }

    return Responses._200({ message: "got a message" });
  } catch (error) {
    return Responses._400({ message: "message could not be received" });
  }
};
