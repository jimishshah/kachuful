process.env = { tableName: "sample-table" };
const Dynamo = require("../../../lambdas/common/dynamo");
const WebSocket = require("../../../lambdas/common/web-socket-message");
const throwCardsHandler = require("../../../lambdas/websockets/throw-card")
  .handler;

jest.mock("../../../lambdas/common/dynamo", () => {
  function createPlayers(count) {
    return Array.from(Array(count).keys()).map(index => ({
      ID: index,
      domainName: "test-domainName" + index,
      stage: "int-test",
      playerName: "anna" + index,
      lastLevel: "7",
      lastTrumpColour: "heart"
    }));
  }
  return {
    get: jest.fn().mockReturnValue({
      cardThrown: null,
      cardsInHand: [
        { type: "spade", number: "K" },
        { type: "spade", number: "K" },
        { type: "spade", number: "Q" }
      ]
    }),
    write: jest.fn(),
    scan: jest.fn().mockReturnValue({
      Items: createPlayers(30)
    })
  };
});
jest.mock("../../../lambdas/common/web-socket-message", () => ({
  send: jest.fn().mockReturnValue(Promise.resolve("something"))
}));

test("if I have 2 spade Ks for example and if I throw one, than only one should be removed from mycards section", async () => {
  const event = {
    body: JSON.stringify({
      message: {
        cardThrown: { type: "spade", number: "K" }
      }
    }),
    requestContext: {
      connectionId: "abcd"
    }
  };
  await throwCardsHandler(event);

  const expectedArg1 = {
    cardThrown: { number: "K", type: "spade" },
    cardsInHand: [
      { number: "K", type: "spade" },
      { number: "Q", type: "spade" }
    ]
  };
  expect(Dynamo.write).toHaveBeenCalledWith(
    expectedArg1,
    process.env.tableName
  );
});

test("player should not be able to throw same card again", () => {});
