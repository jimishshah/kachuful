const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  try {
    const {
      message: { connectionID: initialConnectionID },
    } = JSON.parse(event.body);
    const { connectionId: thisConnectionID } = event.requestContext;
    const connectionID =
      initialConnectionID === "thisConnection"
        ? thisConnectionID
        : initialConnectionID;
    const { tableId } = await Dynamo.get(connectionID, tableName);
    const { Items: players } = await Dynamo.scan(tableName, "tableId", tableId);
    await Dynamo.delete(connectionID, tableName);
    const newPlayers = players.filter((player) => player.ID !== connectionID);
    const updatedPlayers = await updateSequence(newPlayers);
    await updatePlayers({ players: updatedPlayers });
    return Responses._200({ message: "sendPlayers" });
  } catch (e) {
    console.log(e);
  }
};

async function updateSequence(players) {
  const updatedPlayers = players
    .sort((a, b) =>
      Number(a.sequenceNumber) > Number(b.sequenceNumber) ? 1 : -1
    )
    .map((player, index) => ({ ...player, sequenceNumber: index + 1 }));
  await Dynamo.batchWrite(updatedPlayers, tableName);
  return updatedPlayers;
}
