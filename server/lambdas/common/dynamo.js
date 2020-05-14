const AWS = require("aws-sdk");
const isLocal = require("./is-local");
let options = {};
if (isLocal()) {
  options = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  };
}
const documentClient = new AWS.DynamoDB.DocumentClient(options);

const Dynamo = {
  async get(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };

    const data = await documentClient.get(params).promise();

    if (!data || !data.Item) {
      return {};
    }

    return data.Item;
  },

  async write(data, TableName) {
    if (!data.ID) {
      throw Error("no ID on the data");
    }

    const params = {
      TableName,
      Item: data,
    };

    const res = await documentClient.put(params).promise();

    if (!res) {
      throw Error(
        `There was an error inserting ID of ${data.ID} in table ${TableName}`
      );
    }

    return data;
  },

  async delete(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };

    return documentClient.delete(params).promise();
  },

  async scan(TableName, columnId, columnValue) {
    const params = {
      TableName,
      FilterExpression: `${columnId} = :columnValue and playerName <> :null`,
      ExpressionAttributeValues: { ":columnValue": columnValue, ":null": null },
    };

    return documentClient.scan(params).promise();
  },
};
module.exports = Dynamo;
