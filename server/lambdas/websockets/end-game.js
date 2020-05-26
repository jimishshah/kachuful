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
    await updateSequence(newPlayers);
    await updatePlayers({ tableId });
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
    .map((player, index) => ({
      sequenceNumber: index + 1,
      oldPlayerDetails: { ...player },
    }));
  await Dynamo.update(updatedPlayers, tableName);
  return updatedPlayers;
}
