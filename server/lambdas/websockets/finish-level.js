const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");

const tableName = process.env.tableName;

exports.handler = async () => {
  const { Items: players } = await Dynamo.scan(
    tableName,
    "tableId",
    "1234567890"
  );

  const writeToDB = players.map((player) => {
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
    };
    return Dynamo.write(updatedPlayer, tableName);
  });
  await Promise.all(writeToDB);
  await updatePlayers();
};
