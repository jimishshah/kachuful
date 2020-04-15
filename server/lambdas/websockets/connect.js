const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  console.log("event", event);

  const {
    connectionId: connectionID,
    domainName,
    stage,
  } = event.requestContext;

  const data = {
    ID: connectionID,
    date: Date.now(),
    messages: [],
    domainName,
    stage,
  };

  await Dynamo.write(data, tableName);

  return Responses._200({ message: "connected" });
};
