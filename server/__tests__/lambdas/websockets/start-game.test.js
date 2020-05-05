process.env = { tableName: "sample-table" };
const Dynamo = require("../../../lambdas/common/dynamo");
const startGameHandler = require("../../../lambdas/websockets/start-game")
  .handler;
const updatePlayers = require("../../../lambdas/common/update-players");

jest.mock("../../../lambdas/common/update-players", () => jest.fn());
jest.mock("../../../lambdas/common/dynamo", () => ({
  scan: jest.fn().mockReturnValue({
    Items: [
      {
        ID: "1"
      },
      {
        ID: "2"
      }
    ]
  }),
  get: jest.fn().mockReturnValue({}),
  write: jest.fn()
}));

const event = {
  body: JSON.stringify({
    message: { tableId: "test-tableId" }
  })
};

test("should give sequence to everyone, start the game and update the database", async () => {
  await startGameHandler(event);
  expect(Dynamo.write).toHaveBeenCalledWith(
    { ID: "1", hasGameStarted: true, sequenceNumber: 1 },
    "sample-table"
  );
  expect(Dynamo.write).toHaveBeenCalledWith(
    { ID: "2", hasGameStarted: true, sequenceNumber: 2 },
    "sample-table"
  );
});
test("should update all the players", async () => {
  await startGameHandler(event);
  expect(updatePlayers).toHaveBeenCalledWith({
    action: "sendStartGame",
    tableId: "test-tableId"
  });
});
