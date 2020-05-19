const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");
const Responses = require("../common/api-responses");
const distributeCards = require("./distribute-cards");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  const {
    message: { tableId },
  } = JSON.parse(event.body);
  const { Items: players } = await Dynamo.scan(tableName, "tableId", tableId);
  const response = await finishLevel(players);
  return response;
};

module.exports = finishLevel;

async function finishLevel(players) {
  const updatedPlayers = players.map((player) => {
    const {
      wins: { expectedWins, currentWins },
    } = player;
    const thisLevelScore =
      Number(expectedWins) === Number(currentWins)
        ? Number(expectedWins) + 10
        : 0;
    const updatedPlayer = {
      ...player,
      scoreCard: [...player.scoreCard, thisLevelScore],
      wins: { expectedWins: 99, currentWins: 99 },
      hasLevelStarted: false,
      shouldShowFinishLevel: false,
    };
    return updatedPlayer;
  });

  await distributeCards(updatedPlayers);
  return Responses._200({ message: "got a message" });
}
