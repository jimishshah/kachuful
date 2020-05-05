process.env = { tableName: "sample-table" };
const Dynamo = require("../../../lambdas/common/dynamo");
const WebSocket = require("../../../lambdas/common/web-socket-message");
const updatePlayers = require("../../../lambdas/common/update-players");

const finishRound = require("../../../lambdas/websockets/finish-round").handler;

jest.mock("../../../lambdas/common/web-socket-message", () => ({
  send: jest.fn().mockReturnValue(Promise.resolve("something"))
}));
jest.mock("../../../lambdas/common/update-players");
jest.mock("../../../lambdas/common/dynamo", () => ({
  get: jest.fn(),
  write: jest.fn(),
  scan: jest
    .fn()
    .mockReturnValueOnce({
      // 3rd player wins because started and other 2 were phish
      Items: [
        {
          ID: "111",
          cardThrown: { number: "3", type: "club" },
          sequenceNumber: "3",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "2",
            currentWins: "0"
          },
          cardsInHand: []
        },
        {
          ID: "222",
          cardThrown: { number: "4", type: "diamond" },
          sequenceNumber: "2",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "1",
            currentWins: "0"
          },
          cardsInHand: []
        },
        {
          ID: "333",
          cardThrown: { number: "3", type: "spade" },
          sequenceNumber: "1",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "1",
            currentWins: "0"
          },
          cardsInHand: []
        }
      ]
    })
    .mockReturnValueOnce({
      // 1st player, highest value number wins
      Items: [
        {
          ID: "111",
          cardThrown: { number: "A", type: "club" },
          sequenceNumber: "3",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "2",
            currentWins: "0"
          },
          cardsInHand: []
        },
        {
          ID: "222",
          cardThrown: { number: "K", type: "club" },
          sequenceNumber: "2",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "1",
            currentWins: "0"
          },
          cardsInHand: []
        },
        {
          ID: "333",
          cardThrown: { number: "Q", type: "club" },
          sequenceNumber: "1",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "1",
            currentWins: "0"
          },
          cardsInHand: []
        }
      ]
    })
    .mockReturnValueOnce({
      // 2nd player, trump colour wins
      Items: [
        {
          ID: "111",
          cardThrown: { number: "A", type: "club" },
          sequenceNumber: "3",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "2",
            currentWins: "0"
          },
          cardsInHand: []
        },
        {
          ID: "222",
          cardThrown: { number: "4", type: "heart" },
          sequenceNumber: "2",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "1",
            currentWins: "0"
          },
          cardsInHand: []
        },
        {
          ID: "333",
          cardThrown: { number: "K", type: "club" },
          sequenceNumber: "1",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "1",
            currentWins: "0"
          },
          cardsInHand: []
        }
      ]
    })
    .mockReturnValueOnce({
      // 3rd player, because of her sequence was first
      Items: [
        {
          ID: "111",
          cardThrown: { number: "Q", type: "club" },
          sequenceNumber: "3",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "2",
            currentWins: "0"
          },
          cardsInHand: []
        },
        {
          ID: "222",
          cardThrown: { number: "K", type: "club" },
          sequenceNumber: "2",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "1",
            currentWins: "0"
          },
          cardsInHand: []
        },
        {
          ID: "333",
          cardThrown: { number: "K", type: "club" },
          sequenceNumber: "1",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "1",
            currentWins: "0"
          },
          cardsInHand: []
        }
      ]
    })
    .mockReturnValueOnce({
      // 3rd player, 2 players used same trump card but lower sequence wins
      Items: [
        {
          ID: "111",
          cardThrown: { number: "Q", type: "club" },
          sequenceNumber: "3",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "2",
            currentWins: "0"
          },
          cardsInHand: []
        },
        {
          ID: "222",
          cardThrown: { number: "K", type: "heart" },
          sequenceNumber: "2",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "1",
            currentWins: "0"
          },
          cardsInHand: []
        },
        {
          ID: "333",
          cardThrown: { number: "K", type: "heart" },
          sequenceNumber: "1",
          lastTrumpColour: "heart",
          lastRoundWinner: "false",
          wins: {
            expectedWins: "1",
            currentWins: "0"
          },
          cardsInHand: []
        }
      ]
    })
}));

test("predicts correct winner", async () => {
  const event = {
    body: JSON.stringify({
      message: {
        tableId: "1234567890"
      }
    })
  };
  await finishRound(event);
  const player3 = Dynamo.write.mock.calls[2][0];
  expect(player3.lastRoundWinner).toEqual(true);
  expect(player3.cardThrown).toEqual(null);
  expect(player3.wins.currentWins).toEqual(1);
  expect(player3.sequenceNumber).toEqual(1);
  Dynamo.write.mockClear();

  await finishRound(event);
  const player1 = Dynamo.write.mock.calls[0][0];
  expect(player1.lastRoundWinner).toEqual(true);
  expect(player1.cardThrown).toEqual(null);
  expect(player1.wins.currentWins).toEqual(1);
  expect(player3.sequenceNumber).toEqual(1);
  Dynamo.write.mockClear();

  await finishRound(event);
  const player2 = Dynamo.write.mock.calls[1][0];
  expect(player2.lastRoundWinner).toEqual(true);
  expect(player2.cardThrown).toEqual(null);
  expect(player2.wins.currentWins).toEqual(1);
  expect(player3.sequenceNumber).toEqual(1);
  Dynamo.write.mockClear();

  await finishRound(event);
  {
    const player3 = Dynamo.write.mock.calls[2][0];
    expect(player3.lastRoundWinner).toEqual(true);
    expect(player3.cardThrown).toEqual(null);
    expect(player3.wins.currentWins).toEqual(1);
    expect(player3.sequenceNumber).toEqual(1);
  }
  Dynamo.write.mockClear();

  await finishRound(event);
  {
    const player3 = Dynamo.write.mock.calls[2][0];
    expect(player3.lastRoundWinner).toEqual(true);
    expect(player3.cardThrown).toEqual(null);
    expect(player3.wins.currentWins).toEqual(1);
    expect(player3.sequenceNumber).toEqual(1);
  }
  Dynamo.write.mockClear();
});

test("check if the finish round is really needed, if not ignore", () => {});
