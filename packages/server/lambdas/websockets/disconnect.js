const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const { connectionId: connectionID } = event.requestContext;
    const data = await Dynamo.get(connectionID, tableName);
    if (!data.playerName) await Dynamo.delete(connectionID, tableName);
    else
      await Dynamo.update(
        [{ oldPlayerDetails: { ...data }, isDisconnected: true }],
        tableName
      );
    return Responses._200({ message: "sendPlayers" });
  } catch (e) {
    console.log(e);
  }
};
