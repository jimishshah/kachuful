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
  async batchWrite(data, TableName) {
    if (data.length > 0) {
      const itemsArray = data.map((Item) => ({
        PutRequest: {
          Item,
        },
      }));
      const params = {
        RequestItems: {
          [TableName]: itemsArray,
        },
      };

      const res = await documentClient.batchWrite(params).promise();

      if (!res) {
        throw Error(`There was an error udpating data in table ${TableName}`);
      }

      return data;
    }
  },
  async update(data, TableName) {
    if (data.length > 0) {
      const updates = data.map((Item) => {
        const { oldPlayerDetails, ...otherItemData } = Item;
        const { ID } = oldPlayerDetails;
        const UpdateExpressionArray = Object.keys(otherItemData).map(
          (attributeName, index) => `${attributeName} = :x${index}`
        );
        const ExpressionAttributeValues = Object.values(otherItemData).reduce(
          (acc, attributeValue, index) => {
            const value = {
              [`:x${index}`]: attributeValue,
            };
            return { ...acc, ...value };
          },
          {}
        );
        const params = {
          TableName,
          Key: {
            ID,
          },
          UpdateExpression: `set ${UpdateExpressionArray.join(", ")}`,
          ExpressionAttributeValues,
        };
        return documentClient.update(params).promise();
      });
      return Promise.all(updates);

      // if (!res) {
      //   throw Error(`There was an error udpating data in table ${TableName}`);
      // }

      // return data;
    }
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

  async query(TableName, IndexName, columnId, columnValue) {
    const params = {
      TableName,
      IndexName,
      KeyConditionExpression: `${columnId} = :columnId`,
      ExpressionAttributeValues: {
        ":columnId": columnValue,
      },
    };
    console.log({ params });

    return documentClient.query(params).promise();
  },
};
module.exports = Dynamo;
