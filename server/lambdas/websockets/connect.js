const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const WebSocket = require("../common/web-socket-message");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  const {
    connectionId: connectionID,
    domainName,
    stage,
  } = event.requestContext;

  const data = {
    ID: connectionID,
    date: Date.now(),
    domainName,
    stage,
    tableId: "1234567890",
  };
  await Dynamo.write(data, tableName);

  return Responses._200({ message: "connected" });
};
