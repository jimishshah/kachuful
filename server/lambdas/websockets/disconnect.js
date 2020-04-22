const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const { connectionId: connectionID } = event.requestContext;
    const { tableId } = await Dynamo.get(connectionID, tableName);
    await Dynamo.delete(connectionID, tableName);
    await updatePlayers({ tableId });
    return Responses._200({ message: "sendPlayers" });
  } catch (e) {
    console.log(e);
  }
};
