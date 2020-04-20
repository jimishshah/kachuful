const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const {
      connectionId: connectionID,
      domainName,
      stage,
    } = event.requestContext;

    const data = {
      ID: connectionID,
      date: Date.now(),
      domainName,
      stage,
      tableId: "1234567890",
      playerName: null,
      avatarLink: null,
      cardThrown: null,
      cardsInHand: [],
      wins: { expectedWins: 99, currentWins: 99 },
      lastLevel: null,
      cardsRemaining: 0,
      lastTrumpColour: null,
      sequenceNumber: null,
      lastRoundWinner: false,
      scoreCard: [],
      hasLevelStarted: false,
      shouldShowFinishLevel: false,
    };
    await Dynamo.write(data, tableName);
    return Responses._200({ message: "connected" });
  } catch (e) {
    console.log(e);
  }
};
