const Dynamo = require("../common/dynamo");
const { getCardsDeck } = require("../../helpers/cards-deck");
const updatePlayers = require("../common/update-players");
const Responses = require("../common/api-responses");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  const {
    message: { tableId },
  } = JSON.parse(event.body);
  const records = await Dynamo.scan(tableName, "tableId", tableId);

  const { players } = getPlayers(records);
  const writeToDB = players.map((player) => Dynamo.write(player, tableName));
  await Promise.all(writeToDB);

  await updatePlayers({ tableId });
  return Responses._200({ message: "got a message" });
};

function getPlayers(records) {
  try {
    const cardDeck = getCardsDeck(records.Items.length);
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
          hasLevelStarted: true,
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
            (curr.number !== selectedCard.number ||
              curr.type !== selectedCard.number) &&
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
