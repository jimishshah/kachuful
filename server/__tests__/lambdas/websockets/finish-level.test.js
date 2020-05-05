process.env = { tableName: "sample-table" };
const Dynamo = require("../../../lambdas/common/dynamo");
const finishLevelHandler = require("../../../lambdas/websockets/finish-level")
  .handler;
const updatePlayers = require("../../../lambdas/common/update-players");

jest.mock("../../../lambdas/common/update-players", () => jest.fn());
jest.mock("../../../lambdas/common/dynamo", () => ({
  scan: jest.fn().mockReturnValue({
    Items: [
      {
        wins: { expectedWins: 1, currentWins: 1 },
        ID: "1",
        scoreCard: []
      },
      {
        wins: { expectedWins: 0, currentWins: 1 },
        ID: "2",
        scoreCard: []
      }
    ]
  }),
  get: jest.fn().mockReturnValue({}),
  write: jest.fn()
}));

const event = {
  body: JSON.stringify({
    message: { tableId: "test-tableId" }
  }),
  requestContext: {
    connectionId: 111
  }
};

test("should give +10 points to correct bidder", async () => {
  await finishLevelHandler(event);
  const winingPlayer = Dynamo.write.mock.calls[0][0];
  expect(winingPlayer.scoreCard).toEqual([11]);
});
test("should give 0 points to incorrect bidder", async () => {
  await finishLevelHandler(event);
  const lostPlayer = Dynamo.write.mock.calls[1][0];
  expect(lostPlayer.scoreCard).toEqual([0]);
});
test("should update all the players", () => {
  expect(updatePlayers).toHaveBeenCalledWith({ tableId: "test-tableId" });
});
test("should start new round", async () => {
  await finishLevelHandler(event);
  expect(Dynamo.write).toHaveBeenCalledWith(
    {
      ID: "1",
      hasLevelStarted: false,
      scoreCard: [11],
      shouldShowFinishLevel: false,
      wins: { currentWins: 99, expectedWins: 99 }
    },
    "sample-table"
  );
});
