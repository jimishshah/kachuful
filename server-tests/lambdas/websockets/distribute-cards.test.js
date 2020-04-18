process.env = { tableName: "sample-table" };
const Dynamo = require("../../../server/lambdas/common/dynamo");
const WebSocket = require("../../../server/lambdas/common/web-socket-message");
const distributeCardsHandler = require("../../../server/lambdas/websockets/distribute-cards")
  .handler;
jest.mock("../../../server/lambdas/common/dynamo", () => ({
  get: jest.fn(),
  write: jest.fn(),
  scan: jest.fn().mockReturnValue({
    Items: [
      {
        ID: "111",
        domainName: "test-domainName1",
        stage: "int-test",
        playerName: "rapunzel",
        lastLevel: "7",
        lastTrumpColour: "heart",
      },
      {
        ID: "222",
        domainName: "test-domainName2",
        stage: "int-test",
        playerName: "elsa",
        lastLevel: "7",
        lastTrumpColour: "heart",
      },
      {
        ID: "333",
        domainName: "test-domainName3",
        stage: "int-test",
        playerName: "anna",
        lastLevel: "7",
        lastTrumpColour: "heart",
      },
    ],
  }),
}));
jest.mock("../../../server/lambdas/common/web-socket-message", () => ({
  send: jest.fn().mockReturnValue(Promise.resolve("something")),
}));

test("should distribute non duplicate cards, correct number of cards and set correct trump colour to the players", async () => {
  await distributeCardsHandler();

  const player1 = Dynamo.write.mock.calls[0][0];
  const player2 = Dynamo.write.mock.calls[1][0];
  const player3 = Dynamo.write.mock.calls[2][0];

  // test it distributes correct number of cards
  expect(player1.lastLevel).toEqual(8);
  expect(player2.lastLevel).toEqual(8);
  expect(player3.lastLevel).toEqual(8);
  expect(player1.cardsInHand.length).toEqual(8);
  expect(player2.cardsInHand.length).toEqual(8);
  expect(player3.cardsInHand.length).toEqual(8);

  // test it selects correct trump color
  expect(player1.lastTrumpColour).toEqual("spade");
  expect(player2.lastTrumpColour).toEqual("spade");
  expect(player3.lastTrumpColour).toEqual("spade");

  // test all the distributed cards are unique
  expect(
    player1.cardsInHand.filter((value) => player2.cardsInHand.includes(value))
      .length
  ).toEqual(0);
  expect(
    player2.cardsInHand.filter((value) => player3.cardsInHand.includes(value))
      .length
  ).toEqual(0);
  expect(
    player1.cardsInHand.filter((value) => player3.cardsInHand.includes(value))
      .length
  ).toEqual(0);

  // test it stores correct data in the database
  expect(Dynamo.write).toHaveBeenCalledWith(player1, process.env.tableName);
  expect(Dynamo.write).toHaveBeenCalledWith(player2, process.env.tableName);
  expect(Dynamo.write).toHaveBeenCalledWith(player3, process.env.tableName);
});
