const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const { connectionId: connectionID } = event.requestContext;
    const body = JSON.parse(event.body);
    const record = await Dynamo.get(connectionID, tableName);

    const { playerName } = body.message;

    const data = {
      ...record,
      playerName,
    };
    await Dynamo.write(data, tableName);

    updatePlayers();
    console.log(`${playerName} added`);
    return Responses._200({ message: "got a message" });
  } catch (error) {
    console.log(error);
    return Responses._400({ message: "message could not be received" });
  }
};
