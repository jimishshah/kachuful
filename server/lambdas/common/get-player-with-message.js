const Dynamo = require("./dynamo");

const tableName = process.env.tableName;
async function getPlayerWithMessage(event) {
  const { connectionId: connectionID } = event.requestContext;
  const body = JSON.parse(event.body);
  const player = await Dynamo.get(connectionID, tableName);
  return { player, messageBody: body.message };
}

module.exports = getPlayerWithMessage;
