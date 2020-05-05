process.env = { tableName: "sample-table" };
const Dynamo = require("../../../lambdas/common/dynamo");
const WebSocket = require("../../../lambdas/common/web-socket-message");
const disconnectHandler = require("../../../lambdas/websockets/disconnect")
  .handler;

jest.mock("../../../lambdas/common/dynamo", () => {
  function createPlayers(count) {
    return Array.from(Array(count).keys()).map(index => ({
      ID: `ID${index + 1}`,
      domainName: "test-domainName" + index,
      stage: "int-test",
      playerName: "anna" + index,
      lastLevel: "7",
      lastTrumpColour: "heart",
      sequenceNumber: index + 1
    }));
  }
  return {
    get: jest.fn().mockReturnValue({
      ID: "ID1",
      domainName: "test-domainName1",
      stage: "int-test",
      playerName: "anna1",
      lastLevel: "7",
      lastTrumpColour: "heart",
      sequenceNumber: 1
    }),
    write: jest.fn(),
    delete: jest.fn(),
    scan: jest.fn().mockReturnValue({
      Items: [
        {
          ID: `ID2`,
          domainName: "test-domainName",
          stage: "int-test",
          playerName: "anna",
          lastLevel: "7",
          lastTrumpColour: "heart",
          sequenceNumber: 2
        },
        {
          ID: `ID3`,
          domainName: "test-domainName",
          stage: "int-test",
          playerName: "anna",
          lastLevel: "7",
          lastTrumpColour: "heart",
          sequenceNumber: 3
        }
      ]
    })
  };
});
jest.mock("../../../lambdas/common/web-socket-message", () => ({
  send: jest.fn().mockReturnValue(Promise.resolve("something"))
}));

test("when a player gets disconnected, that player is deleted and new sequence is given to everyone", async () => {
  const event = {
    body: JSON.stringify({
      message: ""
    }),
    requestContext: {
      connectionId: 0
    }
  };
  await disconnectHandler(event);

  expect(Dynamo.delete).toHaveBeenCalledWith(0, "sample-table");

  const player1 = Dynamo.write.mock.calls[0][0];
  const player2 = Dynamo.write.mock.calls[1][0];

  expect(player1.sequenceNumber).toEqual(1);
  expect(player1.ID).toEqual(`ID2`);
  expect(player2.sequenceNumber).toEqual(2);
  expect(player2.ID).toEqual(`ID3`);
});
