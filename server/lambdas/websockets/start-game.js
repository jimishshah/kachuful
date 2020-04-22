const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");
const getPlayerWithMessage = require("../common/get-player-with-message");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const {
      message: { tableId },
    } = JSON.parse(event.body);
    const { Items: players } = await Dynamo.scan(tableName, "tableId", tableId);

    const editedPlayers = players.map((player, index) => ({
      ...player,
      sequenceNumber: index + 1,
    }));

    const writeToDB = editedPlayers.map((player) =>
      Dynamo.write(player, tableName)
    );
    await Promise.all(writeToDB);

    await updatePlayers({ action: "sendStartGame", tableId });
    return Responses._200({ message: "got a message" });
  } catch (error) {
    console.log(error);
    return Responses._400({ message: "message could not be received" });
  }
};
