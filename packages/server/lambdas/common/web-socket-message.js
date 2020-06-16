const AWS = require("aws-sdk");
const isLocal = require("./is-local");

const create = (domainName, stage) => {
  const endpoint = isLocal()
    ? `http://${domainName}:3001`
    : `${domainName}/${stage}`;
  return new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint,
  });
};

const send = ({ domainName, stage, connectionID, message }) => {
  const ws = create(domainName, stage);

  const postParams = {
    Data: message,
    ConnectionId: connectionID,
  };

  return ws.postToConnection(postParams).promise();
};

module.exports = {
  send,
};
