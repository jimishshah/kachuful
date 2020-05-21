const Dynamo = require("./dynamo");
const WebSocket = require("./web-socket-message");
const logger = require("../common/logger");

const tableName = process.env.tableName;
async function updatePlayers({
  action = "sendPlayers",
  tableId,
  players: intialPlayers,
}) {
  let players = intialPlayers;
  if (!players) {
    ({ Items: players } = await Dynamo.scan(tableName, "tableId", tableId));
  }
  logger({
    message: "update-players.js: 15",
    debug_type: "STALE_CARD",
    players,
  });
  //send connected users list to all the users
  const messages = players
    .filter(({ isDisconnected }) => !Boolean(isDisconnected))
    .map(({ ID: connectionID, domainName, stage }) =>
      WebSocket.send({
        domainName,
        stage,
        connectionID,
        message: JSON.stringify({ players, action }),
      })
    );
  await Promise.all(messages);
}
module.exports = updatePlayers;
