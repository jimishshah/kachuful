process.env = { tableName: "sample-table" };
const Dynamo = require("../../../server/lambdas/common/dynamo");
const sendNameHandler = require("../../../server/lambdas/websockets/send-name")
  .handler;
const updatePlayers = require("../../../server/lambdas/common/update-players");

jest.mock("../../../server/lambdas/common/dynamo", () => ({
  scan: jest.fn().mockImplementation((tableName, columnId, columnValue) => {
    switch (columnValue) {
      case "invalid-tableId":
        return { Items: [] };
      case "valid-tableId":
        return {
          Items: [
            {
              playerName: "p1-player",
            },
          ],
        };
      default:
        return { Items: [] };
    }
  }),
  get: jest.fn().mockReturnValue({}),
  write: jest.fn(),
}));

jest.mock("../../../server/lambdas/common/web-socket-message", () => ({
  send: jest.fn().mockReturnValue(Promise.resolve("something")),
}));
jest.mock("../../../server/lambdas/common/update-players", () => jest.fn());

global.Date = {
  now: jest.fn().mockReturnValue(123),
};
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;
test("should create new tableId and set the user to host if invalid table id is given and update all the users", async () => {
  const event = {
    body: JSON.stringify({
      message: { playerName: "test-pn", tableId: "invalid-tableId" },
    }),
    requestContext: {
      connectionId: 111,
    },
  };
  await sendNameHandler(event);
  expect(Dynamo.write).toHaveBeenCalledWith(
    { isHost: true, playerName: "test-pn", tableId: "123-5" },
    "sample-table"
  );
  expect(updatePlayers).toHaveBeenCalledWith({ tableId: "123-5" });
});

test("should create new tableId and set the user to host if no tableId is given and update all the users", async () => {
  const event = {
    body: JSON.stringify({
      message: { playerName: "test-pn1" },
    }),
    requestContext: {
      connectionId: 111,
    },
  };
  await sendNameHandler(event);
  expect(Dynamo.write).toHaveBeenCalledWith(
    { isHost: true, playerName: "test-pn1", tableId: "123-5" },
    "sample-table"
  );
  expect(updatePlayers).toHaveBeenCalledWith({ tableId: "123-5" });
});

test("should not set the user to host if valid table id is given  and update all the users", async () => {
  const event = {
    body: JSON.stringify({
      message: { playerName: "test-pn2", tableId: "valid-tableId" },
    }),
    requestContext: {
      connectionId: 111,
    },
  };
  await sendNameHandler(event);
  expect(Dynamo.write).toHaveBeenCalledWith(
    { isHost: false, playerName: "test-pn2", tableId: "valid-tableId" },
    "sample-table"
  );
  expect(updatePlayers).toHaveBeenCalledWith({ tableId: "valid-tableId" });
});
