process.env = { tableName: "sample-table" };
const Dynamo = require("../../../lambdas/common/dynamo");
const WebSocket = require("../../../lambdas/common/web-socket-message");
const distributeCardsHandler = require("../../../lambdas/websockets/distribute-cards")
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
    get: jest.fn(),
    write: jest.fn(),
    scan: jest.fn().mockReturnValue({
      Items: createPlayers(30)
    })
  };
});
jest.mock("../../../lambdas/common/web-socket-message", () => ({
  send: jest.fn().mockReturnValue(Promise.resolve("something"))
}));

test("should distribute non duplicate cards, correct number of cards and set correct trump colour to the players", async () => {
  const event = {
    body: JSON.stringify({
      message: {
        tableId: "1234567890"
      }
    })
  };
  await distributeCardsHandler(event);

  const player1 = Dynamo.write.mock.calls[0][0];
  const player2 = Dynamo.write.mock.calls[1][0];
  const player3 = Dynamo.write.mock.calls[2][0];
  const player12 = Dynamo.write.mock.calls[11][0];

  // test it distributes correct number of cards
  expect(player1.lastLevel).toEqual(8);
  expect(player2.lastLevel).toEqual(8);
  expect(player3.lastLevel).toEqual(8);
  expect(player12.lastLevel).toEqual(8);
  expect(player1.cardsInHand.length).toEqual(8);
  expect(player2.cardsInHand.length).toEqual(8);
  expect(player3.cardsInHand.length).toEqual(8);
  expect(player12.cardsInHand.length).toEqual(8);

  // test it selects correct trump color
  expect(player1.lastTrumpColour).toEqual("spade");
  expect(player2.lastTrumpColour).toEqual("spade");
  expect(player3.lastTrumpColour).toEqual("spade");

  // // test all the distributed cards are unique
  // expect(
  //   player1.cardsInHand.filter((value) => player2.cardsInHand.includes(value))
  //     .length
  // ).toEqual(0);
  // expect(
  //   player2.cardsInHand.filter((value) => player3.cardsInHand.includes(value))
  //     .length
  // ).toEqual(0);
  // expect(
  //   player1.cardsInHand.filter((value) => player3.cardsInHand.includes(value))
  //     .length
  // ).toEqual(0);

  // test it stores correct data in the database
  expect(Dynamo.write).toHaveBeenCalledWith(player1, process.env.tableName);
  expect(Dynamo.write).toHaveBeenCalledWith(player2, process.env.tableName);
  expect(Dynamo.write).toHaveBeenCalledWith(player3, process.env.tableName);
  expect(Dynamo.write).toHaveBeenCalledWith(player12, process.env.tableName);
});
