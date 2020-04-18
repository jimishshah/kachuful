const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");
const getPlayerWithMessage = require("../common/get-player-with-message");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const {
      messageBody: { cardThrown },
      player,
    } = await getPlayerWithMessage(event);

    const newCardsInHand = player.cardsInHand.filter(
      ({ type, number }) =>
        type !== cardThrown.type || number !== cardThrown.number
    );

    const data = {
      ...player,
      cardThrown,
      cardsInHand: newCardsInHand,
    };
    await Dynamo.write(data, tableName);
    await updatePlayers();
    console.log(`${cardThrown} card Thrown added`);
    return Responses._200({ message: "got a message" });
  } catch (error) {
    console.log(error);
    return Responses._400({ message: "message could not be received" });
  }
};
