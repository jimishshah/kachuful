const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const updatePlayers = require("../common/update-players");
const getPlayerWithMessage = require("../common/get-player-with-message");

const tableName = process.env.tableName;
const indexName = process.env.indexName;

exports.handler = async (event) => {
  try {
    let {
      messageBody: { playerName, tableId },
      player,
    } = await getPlayerWithMessage(event);
    const isValidTableId = await checkIsValidTableId(tableId);
    if (!isValidTableId) {
      tableId = null;
    }

    const isHost = !tableId;
    tableId =
      tableId || (Date.now() + Math.random()).toString().replace(".", "-");

    const data = {
      ...player,
      isHost,
      tableId,
      playerName,
    };
    await Dynamo.write(data, tableName);

    await updatePlayers({ tableId });
    console.log(`${playerName} added`);
    return Responses._200({ message: "got a message" });
  } catch (error) {
    console.log(error);
    return Responses._400({ message: "message could not be received" });
  }
};

async function checkIsValidTableId(tableId) {
  if (!tableId) return false;
  const records = await Dynamo.query(tableName, indexName, "tableId", tableId);
  const usersWithGameStarted = records.Items.filter(({ hasGameStarted }) =>
    Boolean(hasGameStarted)
  );
  return records.Items.length > 0 && usersWithGameStarted.length === 0;
}
