const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");
const getNewSequenceNumber = require("../../helpers/get-new-sequence-number");
const Responses = require("../common/api-responses");
const finishLevel = require("./finish-level");
const logger = require("../common/logger");

const tableName = process.env.tableName;
const indexName = process.env.indexName;

const cardPriorities = {
  A: 13,
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
  "7": 6,
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
  const { Items: players } = await Dynamo.query(
    tableName,
    indexName,
    "tableId",
    tableId
  );
  const response = await finishRound(players);
  return response;
};

module.exports = finishRound;

async function finishRound(players) {
  logger({
    message: "finish-round.js: 39",
    debug_type: "STALE_CARD",
    players,
  });
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
  const updatedPlayers = players.map((player) => {
    let updatedPlayer = {
      oldPlayerDetails: { ...player },
      cardThrown: false,
      lastRoundWinner: false,
      sequenceNumber: getNewSequenceNumber(
        totalPlayers,
        winningPlayerSequenceNumber,
        Number(player.sequenceNumber)
      ),
      shouldShowFinishLevel: player.cardsInHand.length > 0 ? false : true,
      wins: { ...player.wins },
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
    return updatedPlayer;
  });
  logger({
    message: "finish-round.js: 86",
    debug_type: "STALE_CARD",
    updatedPlayers,
  });
  const shouldShowFinishLevel = Boolean(
    updatedPlayers.filter(({ shouldShowFinishLevel }) =>
      Boolean(shouldShowFinishLevel)
    ).length
  );
  if (shouldShowFinishLevel) {
    await finishLevel(updatedPlayers, players);
  } else {
    await Dynamo.update(updatedPlayers, tableName);
    const playersToUpdate = updatedPlayers.map((player) => ({
      ...player.oldPlayerDetails,
      ...player,
    }));
    await updatePlayers({
      action: "sendFinishRound",
      players: playersToUpdate,
      playerStateBeforeRoundFinished: players,
    });
  }

  return Responses._200({ message: "got a message" });
}

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
  const result = players
    .filter(({ priority }) => priority === maxPriority)
    .sort((a, b) =>
      Number(a.sequenceNumber) > Number(b.sequenceNumber) ? 1 : -1
    );
  return [result[0]];
}
