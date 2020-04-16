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

  // get all the users
  const records = await Dynamo.scan(tableName, "tableId", "1234567890");
  const allConnectionIds = records.Items.map(
    ({ ID: connectionID }) => connectionID
  );

  //send connected users list to all the users
  const messages = records.Items.map(
    ({ ID: connectionID, domainName, stage }) =>
      WebSocket.send({
        domainName,
        stage,
        connectionID,
        message: JSON.stringify({ allConnectionIds }),
      })
  );
  await Promise.all(messages);

  return Responses._200({ message: "connected" });
};
