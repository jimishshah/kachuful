const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const { connectionId: connectionID } = event.requestContext;
    const body = JSON.parse(event.body);
    const record = await Dynamo.get(connectionID, tableName);
    const { myBid } = body.message;

    const data = {
      ...record,
      wins: {
        expectedWins: myBid,
        currentWins: 0,
      },
    };
    const { tableId } = record;
    await Dynamo.write(data, tableName);
    await updatePlayers({ tableId });
    console.log(`${myBid} Bid added`);
    return Responses._200({ message: "got a message" });
  } catch (error) {
    console.log(error);
    return Responses._400({ message: "message could not be received" });
  }
};

// same player should not be able to place the bid again
