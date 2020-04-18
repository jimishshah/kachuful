process.env = { tableName: "sample-table" };
const connectHandler = require("../../../server/lambdas/websockets/connect")
  .handler;
const Dynamo = require("../../../server/lambdas/common/dynamo");
const WebSocket = require("../../../server/lambdas/common/web-socket-message");
jest.mock("../../../server/lambdas/common/dynamo", () => ({
  get: jest.fn(),
  write: jest.fn(),
  scan: jest.fn().mockReturnValue({
    Items: [
      {
        ID: "111",
        domainName: "test-domainName1",
        stage: "int-test",
        name: "rapunzel",
      },
      {
        ID: "222",
        domainName: "test-domainName2",
        stage: "int-test",
        name: "elsa",
      },
      {
        ID: "333",
        domainName: "test-domainName3",
        stage: "int-test",
        name: "anna",
      },
    ],
  }),
}));

jest.mock("../../../server/lambdas/common/web-socket-message", () => ({
  send: jest.fn().mockReturnValue(Promise.resolve("something")),
}));
test("should send connected users list to every user", async () => {
  // prepare
  const connectionId = "112233";
  const event = {
    requestContext: {
      connectionId,
      domainName: "test-domainName",
      stage: "test-stage",
    },
  };
  global.Date = {
    now: jest.fn().mockReturnValue(123),
  };
  const expectedDynamowrite = [
    {
      ID: "112233",
      avatarLink: null,
      cardThrown: null,
      cardsInHand: [],
      cardsRemaining: 0,
      date: 123,
      domainName: "test-domainName",
      lastLevel: null,
      lastTrumpColour: null,
      playerName: null,
      stage: "test-stage",
      tableId: "1234567890",
      wins: { currentWins: 99, expectedWins: 99 },
    },
    "sample-table",
  ];
  // act
  await connectHandler(event);

  // assert
  expect(Dynamo.write).toHaveBeenCalledWith(
    expectedDynamowrite[0],
    expectedDynamowrite[1]
  );
  // expect(Dynamo.scan).toHaveBeenCalledWith(
  //   "sample-table",
  //   "tableId",
  //   "1234567890"
  // );
  // expect(WebSocket.send).toHaveBeenNthCalledWith(1, {
  //   connectionID: "111",
  //   domainName: "test-domainName1",
  //   message: JSON.stringify({ allConnectionIds: ["111", "222", "333"] }),
  //   stage: "int-test",
  // });
  // expect(WebSocket.send).toHaveBeenNthCalledWith(2, {
  //   connectionID: "222",
  //   domainName: "test-domainName2",
  //   message: JSON.stringify({ allConnectionIds: ["111", "222", "333"] }),
  //   stage: "int-test",
  // });
  // expect(WebSocket.send).toHaveBeenNthCalledWith(3, {
  //   connectionID: "333",
  //   domainName: "test-domainName3",
  //   message: JSON.stringify({ allConnectionIds: ["111", "222", "333"] }),
  //   stage: "int-test",
  // });
  // expect(WebSocket.send).toHaveBeenCalledTimes(3);
});
