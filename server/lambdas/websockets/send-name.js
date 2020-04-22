const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");
const getPlayerWithMessage = require("../common/get-player-with-message");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    let {
      messageBody: { playerName, tableId },
      player,
    } = await getPlayerWithMessage(event);

    const isHost = !Boolean(tableId);
    tableId =
      tableId || (Date.now() + Math.random()).toString().replace(".", "-");

    const data = {
      ...player,
      isHost,
      tableId,
      playerName,
    };
    await Dynamo.write(data, tableName);

    await updatePlayers({ tableId });
    console.log(`${playerName} added`);
    return Responses._200({ message: "got a message" });
  } catch (error) {
    console.log(error);
    return Responses._400({ message: "message could not be received" });
  }
};
