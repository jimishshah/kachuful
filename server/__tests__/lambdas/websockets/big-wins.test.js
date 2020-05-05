process.env = { tableName: "sample-table" };
const Dynamo = require("../../../lambdas/common/dynamo");
const bidWinsHandler = require("../../../lambdas/websockets/bid-wins").handler;
const updatePlayers = require("../../../lambdas/common/update-players");

jest.mock("../../../lambdas/common/dynamo", () => ({
  get: jest.fn().mockReturnValue({
    tableId: "1212-test"
  }),
  write: jest.fn()
}));

jest.mock("../../../lambdas/common/update-players", () => jest.fn());

test("should save the bids to db and brodcast to all the users", async () => {
  const event = {
    body: JSON.stringify({
      message: { myBid: "1" }
    }),
    requestContext: {
      connectionId: 111
    }
  };
  await bidWinsHandler(event);
  expect(Dynamo.write).toHaveBeenCalledWith(
    { wins: { currentWins: 0, expectedWins: "1" }, tableId: "1212-test" },
    "sample-table"
  );
  expect(updatePlayers).toHaveBeenCalledWith({ tableId: "1212-test" });
});
