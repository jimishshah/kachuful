const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");
const getNewSequenceNumber = require("../../helpers/get-new-sequence-number");
const Responses = require("../common/api-responses");

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
  K: 12,
};

exports.handler = async (event) => {
  const {
    message: { tableId },
  } = JSON.parse(event.body);
  const { Items: players } = await Dynamo.scan(tableName, "tableId", tableId);
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
  const [
    { ID: winningPlayerID, sequenceNumber: winningPlayerSequenceNumber },
  ] = getWinningPlayer(data);
  const totalPlayers = players.length;
  const writeToDB = players.map((player) => {
    let updatedPlayer = {
      ...player,
      cardThrown: null,
      lastRoundWinner: false,
      sequenceNumber: getNewSequenceNumber(
        totalPlayers,
        winningPlayerSequenceNumber,
        Number(player.sequenceNumber)
      ),
      shouldShowFinishLevel: player.cardsInHand.length > 0 ? false : true,
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

  await updatePlayers({ action: "sendFinishRound", tableId });

  return Responses._200({ message: "got a message" });
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
