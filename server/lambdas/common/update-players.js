const Dynamo = require("./dynamo");
const WebSocket = require("./web-socket-message");

const tableName = process.env.tableName;
async function updatePlayers() {
  const records = await Dynamo.scan(tableName, "tableId", "1234567890");
  const players = records.Items.map((player) => player);

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
}
module.exports = updatePlayers;
