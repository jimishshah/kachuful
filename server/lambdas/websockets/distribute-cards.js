// loop all the connections
// check number of users
// decide trump colour
// distribute cards to all the connections

const Responses = require("../common/api-responses");
const Dynamo = require("../common/dynamo");
const WebSocket = require("../common/web-socket-message");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  // get connecition ids from all the table
  const connectionIds = getConnectionIds();
  const numberOfCardsToDistribute = getNumberOfCardsToDistribute();
  const trumpColour = getTrumpColour();
  const cards = getCards(connectionIds, numberOfCardsToDistribute);

  const messages = connectionIds.map((connectionId) => {
    WebSocket.sent({});
  });
  await Promise.all(messages);
  // decide how much cards to distribute
  // decide the trump color
  // get the array of cards
  // get random cards x cards for one connection and remove from the list
  // get random other ards and remove form the list
  // so on
  // send individual cards to the connections
  console.log("hellox");
};

function getConnectionIds() {}

function getNumberOfCardsToDistribute() {}

function getTrumpColour() {}
