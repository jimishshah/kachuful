const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");
const getPlayerWithMessage = require("../common/get-player-with-message");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const {
      messageBody: { playerName },
      player,
    } = await getPlayerWithMessage(event);

    const data = {
      ...player,
      playerName,
    };
    await Dynamo.write(data, tableName);

    await updatePlayers();
    console.log(`${playerName} added`);
    return Responses._200({ message: "got a message" });
  } catch (error) {
    console.log(error);
    return Responses._400({ message: "message could not be received" });
  }
};
