const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");
const getPlayerWithMessage = require("../common/get-player-with-message");
const finishRound = require("./finish-round");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const {
      messageBody: { cardThrown },
      player,
    } = await getPlayerWithMessage(event);

    const { cardsInHand: newCardsInHand } = player.cardsInHand.reduce(
      (acc, curr) => {
        if (
          curr.number == cardThrown.number &&
          curr.type == cardThrown.type &&
          acc.foundFirstSelectedCard === false
        ) {
          return { ...acc, foundFirstSelectedCard: true };
        }
        return { ...acc, cardsInHand: [...acc.cardsInHand, curr] };
      },
      {
        cardsInHand: [],
        foundFirstSelectedCard: false,
      }
    );

    const data = {
      ...player,
      cardThrown,
      cardsInHand: newCardsInHand,
    };
    await Dynamo.write(data, tableName);
    const { tableId } = data;

    const { Items: players } = await Dynamo.scan(tableName, "tableId", tableId);
    const playersThatHaveThrownCard = players.filter(
      ({ cardThrown }) => cardThrown !== null
    );

    const hasEveryoneThrownCard =
      players.length === playersThatHaveThrownCard.length;

    await updatePlayers({ players });
    if (hasEveryoneThrownCard) {
      await finishRound(players);
    }
    console.log(`${cardThrown} card Thrown added`);
    return Responses._200({ message: "got a message" });
  } catch (error) {
    console.log(error);
    return Responses._400({ message: "message could not be received" });
  }
};
