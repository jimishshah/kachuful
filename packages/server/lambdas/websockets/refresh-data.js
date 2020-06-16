const Responses = require("../common/api-responses");
const WebSocket = require("../common/web-socket-message");
const getPlayerWithMessage = require("../common/get-player-with-message");
const Dynamo = require("../common/dynamo");

const tableName = process.env.tableName;
const indexName = process.env.indexName;

exports.handler = async (event) => {
  try {
    const {
      player: { tableId, domainName, stage, ID: connectionID },
    } = await getPlayerWithMessage(event);
    const records = await Dynamo.query(
      tableName,
      indexName,
      "tableId",
      tableId
    );
    const players = records.Items.map((player) => player);

    await WebSocket.send({
      domainName,
      stage,
      connectionID,
      message: JSON.stringify({ players }),
    });
    return Responses._200({ message: "connected" });
  } catch (e) {
    console.log(e);
  }
};
