process.env = { tableName: "sample-table" };
const Dynamo = require("../../../server/lambdas/common/dynamo");

const finishRound = require("../../server/lambdas/websockets/distribute-cards");

test("predicts correct winner", () => {
  const players = [
    {
      ID: 1,
      cardThrown: { type: "club", number: "2" },
      lastTrumpColour: "spade",
      expectedWinner: { type: "club", number: "J" },
    },
  ];

  cases.forEach((thisCase) => {
    expect(getWinnerCard(thisCase.cardsThrown)).toEqual(
      thisCase.expectedWinner
    );
  });
});
