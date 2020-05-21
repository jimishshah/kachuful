const Dynamo = require("../common/dynamo");
const { getCardsDeck } = require("../../helpers/cards-deck");
const updatePlayers = require("../common/update-players");
const Responses = require("../common/api-responses");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const {
      message: { tableId },
    } = JSON.parse(event.body);
    const { Items: intialPlayers } = await Dynamo.scan(
      tableName,
      "tableId",
      tableId
    );

    const response = await distributeCards(intialPlayers);
    return response;
  } catch (e) {
    console.log(e);
  }
};

module.exports = distributeCards;

async function distributeCards(intialPlayers) {
  const { players } = getPlayers(intialPlayers);

  await Dynamo.update(players, tableName);
  const { lastLevel, tableId } = players[0].oldPlayerDetails;
  const action = Boolean(lastLevel) ? "sendFinishRound" : null;
  await updatePlayers({ action, tableId });
  return Responses._200({ message: "got a message" });
}

function getPlayers(intialPlayers) {
  try {
    const cardDeck = getCardsDeck(intialPlayers.length);
    return intialPlayers.reduce(
      (acc, currRecord) => {
        const { lastLevel, lastTrumpColour } = currRecord.oldPlayerDetails;
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
          lastLevel: numberOfCardsToDistribute,
          lastTrumpColour: currentTrumpColour,
          cardsInHand,
          hasLevelStarted: true,
          oldPlayerDetails: { ...currRecord.oldPlayerDetails },
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

      const { cardDeck: newRemainingCardDeck } = currentCardDeck.reduce(
        (acc, curr) => {
          if (
            curr.number == selectedCard.number &&
            curr.type == selectedCard.type &&
            acc.foundFirstSelectedCard === false
          ) {
            return { ...acc, foundFirstSelectedCard: true };
          }
          return { ...acc, cardDeck: [...acc.cardDeck, curr] };
        },
        {
          cardDeck: [],
          foundFirstSelectedCard: false,
        }
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
