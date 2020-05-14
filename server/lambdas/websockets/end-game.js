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
    await Dynamo.delete(connectionID, tableName);
    await updateSequence(tableId);
    await updatePlayers({ tableId });
    return Responses._200({ message: "sendPlayers" });
  } catch (e) {
    console.log(e);
  }
};

async function updateSequence(tableId) {
  const records = await Dynamo.scan(tableName, "tableId", tableId);
  const writeToDB = records.Items.sort((a, b) =>
    Number(a.sequenceNumber) > Number(b.sequenceNumber) ? 1 : -1
  ).map((player, index) =>
    Dynamo.write({ ...player, sequenceNumber: index + 1 }, tableName)
  );
  await Promise.all(writeToDB);
}
