const WebSocket = require("../../../lambdas/common/web-socket-message");
const getConnectionIdHandler = require("../../../lambdas/websockets/get-connection-id")
  .handler;

jest.mock("../../../lambdas/common/web-socket-message", () => ({
  send: jest.fn()
}));

test("returns correct connecction id", async () => {
  const event = {
    body: JSON.stringify({
      message: { tableId: "test-tableId" }
    }),
    requestContext: {
      connectionId: 111,
      domainName: "test-domain",
      stage: "test-stage"
    }
  };
  await getConnectionIdHandler(event);
  expect(WebSocket.send).toHaveBeenCalledWith({
    connectionID: 111,
    domainName: "test-domain",
    message: '{"connectionID":111}',
    stage: "test-stage"
  });
});
