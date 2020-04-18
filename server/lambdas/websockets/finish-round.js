// check who won
// add wins to that user and transmit round score to everyone with who last won

const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");

const tableName = process.env.tableName;

exports.handler = async () => {
  //   const { items: players } = await Dynamo.scan(
  //     tableName,
  //     "tableId",
  //     "1234567890"
  //   );
  return getRoundWinner(players);
};

function getRoundWinner(players) {}
