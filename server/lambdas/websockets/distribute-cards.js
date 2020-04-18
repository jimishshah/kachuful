const Dynamo = require("../common/dynamo");
const WebSocket = require("../common/web-socket-message");
const { getCardsDeck } = require("../../helpers/cards-deck");

const tableName = process.env.tableName;

exports.handler = async () => {
  const records = await Dynamo.scan(tableName, "tableId", "1234567890");

  const { players } = getPlayers(records);
  //send connected users list to all the users
  const messages = records.Items.map(
    ({ ID: connectionID, domainName, stage }) =>
      WebSocket.send({
        domainName,
        stage,
        connectionID,
        message: JSON.stringify({ players, action: "sendPlayers" }),
      })
  );
  await Promise.all(messages);
  const writeToDB = players.map((player) => Dynamo.write(player, tableName));
  await Promise.all(writeToDB);
};

function getPlayers(records) {
  try {
    const cardDeck = getCardsDeck();
    return records.Items.reduce(
      (acc, currRecord) => {
        const {
          playerName,
          ID: connectionID,
          lastLevel,
          lastTrumpColour,
        } = currRecord;
        const { remainingCardDeck } = acc;
        const numberOfCardsToDistribute = getNumberOfCardsToDistribute(
          lastLevel
        );
        const currentTrumpColour = getTrumpColour(lastTrumpColour);
        const { cardsInHand, newRemainingCardDeck } = getCards(
          numberOfCardsToDistribute,
          remainingCardDeck
        );
        const player = {
          ...currRecord,
          playerName,
          ID: connectionID,
          lastLevel: numberOfCardsToDistribute,
          lastTrumpColour: currentTrumpColour,
          cardsInHand,
        };
        return {
          players: [...acc.players, player],
          remainingCardDeck: newRemainingCardDeck,
        };
      },
      {
        players: [],
        remainingCardDeck: cardDeck,
      }
    );
  } catch (e) {
    console.log(e);
  }
}

function getNumberOfCardsToDistribute(lastLevel) {
  if (lastLevel) {
    const numericLastLevel = Number(lastLevel);
    return numericLastLevel < 8 ? numericLastLevel + 1 : 1;
  }
  return 1;
}

function getTrumpColour(lastTrumpColour) {
  const colourSequence = ["spade", "diamond", "club", "heart"];
  if (lastTrumpColour) {
    const colourIndex = colourSequence.indexOf(lastTrumpColour);
    return colourIndex < colourSequence.length - 1
      ? colourSequence[colourIndex + 1]
      : colourSequence[0];
  }
  return colourSequence[0];
}

function getCards(numberOfCardsToDistribute, remainingCardDeck) {
  return Array.from(Array(numberOfCardsToDistribute).keys()).reduce(
    (acc) => {
      const {
        newRemainingCardDeck: currentCardDeck,
        cardsInHand: currentCardsInHand,
      } = acc;
      const randomNumber = Math.floor(Math.random() * currentCardDeck.length);
      const selectedCard = currentCardDeck[randomNumber];
      const newRemainingCardDeck = currentCardDeck.filter(
        ({ number, type }) =>
          number !== selectedCard.number || type !== selectedCard.type
      );
      return {
        cardsInHand: [...currentCardsInHand, selectedCard],
        newRemainingCardDeck,
      };
    },
    {
      cardsInHand: [],
      newRemainingCardDeck: remainingCardDeck,
    }
  );
}
