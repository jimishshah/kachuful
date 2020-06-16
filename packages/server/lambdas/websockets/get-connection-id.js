const Responses = require("../common/api-responses");
const WebSocket = require("../common/web-socket-message");

exports.handler = async (event) => {
  try {
    const {
      connectionId: connectionID,
      domainName,
      stage,
    } = event.requestContext;

    await WebSocket.send({
      domainName,
      stage,
      connectionID,
      message: JSON.stringify({ connectionID }),
    });
    return Responses._200({ message: "connected" });
  } catch (e) {
    console.log(e);
  }
};
