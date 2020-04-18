const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");

const tableName = process.env.tableName;

const cardPriorities = {
  A: 13,
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
  "7": 5,
  "8": 7,
  "9": 8,
  "10": 9,
  J: 10,
  Q: 11,
  K: 13,
};

exports.handler = async () => {
  const { Items: players } = await Dynamo.scan(
    tableName,
    "tableId",
    "1234567890"
  );
  const data = players.map(
    ({
      ID,
      cardThrown: { type, number },
      sequenceNumber,
      lastTrumpColour,
    }) => ({
      ID,
      type,
      number,
      sequenceNumber,
      lastTrumpColour,
      priority: cardPriorities[number],
    })
  );
  const [{ ID: winningPlayerID }] = getWinningPlayer(data);
  const writeToDB = players.map((player) => {
    let updatedPlayer = {
      ...player,
      cardThrown: {},
      lastRoundWinner: false,
    };
    if (player.ID === winningPlayerID) {
      updatedPlayer = {
        ...updatedPlayer,
        lastRoundWinner: true,
        wins: {
          ...player.wins,
          currentWins: Number(player.wins.currentWins) + 1,
        },
      };
    }
    return Dynamo.write(updatedPlayer, tableName);
  });
  await Promise.all(writeToDB);

  await updatePlayers("sendFinishRound");
};

function getWinningPlayer(data) {
  const winningTrumpThrower = getWinningPlayerByColour(
    data,
    data[0].lastTrumpColour
  );
  if (winningTrumpThrower.length === 1) return winningTrumpThrower;

  const [firstPlayer] = data.filter(
    ({ sequenceNumber }) => Number(sequenceNumber) === 1
  );
  return getWinningPlayerByColour(data, firstPlayer.type);
}

function getWinningPlayerByColour(data, trumpType) {
  const players = data.filter(({ type }) => type === trumpType);
  if (players.length === 0) return [];
  const priorities = players.map(({ priority }) => priority);
  const maxPriority = Math.max(...priorities);
  return players.filter(({ priority }) => priority === maxPriority);
}
