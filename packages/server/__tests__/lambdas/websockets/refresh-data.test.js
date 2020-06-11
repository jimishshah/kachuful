process.env = { tableName: "sample-table" };
const WebSocket = require("../../../lambdas/common/web-socket-message");
const refreshDataHandler = require("../../../lambdas/websockets/refresh-data")
  .handler;
const Dynamo = require("../../../lambdas/common/dynamo");

jest.mock("../../../lambdas/common/web-socket-message", () => ({
  send: jest.fn()
}));

jest.mock("../../../lambdas/common/dynamo", () => ({
  scan: jest.fn().mockReturnValue({
    Items: [
      {
        ID: "1"
      },
      {
        ID: "2"
      },
      {
        ID: "123123"
      }
    ]
  }),
  get: jest.fn().mockReturnValue({
    tableId: "test-tableId",
    domainName: "test-domainName",
    stage: "test-stage",
    ID: "123123"
  }),
  write: jest.fn()
}));

test("should send all the players data of that tableId to the player who asked for it", async () => {
  const event = {
    body: JSON.stringify({
      message: { tableId: "test-tableId" }
    }),
    requestContext: {
      connectionId: 111
    }
  };
  await refreshDataHandler(event);
  expect(Dynamo.scan).toHaveBeenCalledWith(
    "sample-table",
    "tableId",
    "test-tableId"
  );
  expect(WebSocket.send).toHaveBeenCalledWith({
    connectionID: "123123",
    domainName: "test-domainName",
    message: '{"players":[{"ID":"1"},{"ID":"2"},{"ID":"123123"}]}',
    stage: "test-stage"
  });
});
