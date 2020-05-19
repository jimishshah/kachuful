const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");
const distributeCards = require("./distribute-cards");
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
      hasGameStarted: true,
    }));
    const response = await distributeCards(editedPlayers);
    return response;
  } catch (error) {
    console.log(error);
    return Responses._400({ message: "message could not be received" });
  }
};
