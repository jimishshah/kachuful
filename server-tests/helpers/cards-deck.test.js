const { getCardsDeck } = require("../../server/helpers/cards-deck");
test("returns correct cards", () => {
  const expected = [
    { number: "A", type: "spade" },
    { number: "A", type: "diamond" },
    { number: "A", type: "club" },
    { number: "A", type: "heart" },
    { number: "2", type: "spade" },
    { number: "2", type: "diamond" },
    { number: "2", type: "club" },
    { number: "2", type: "heart" },
    { number: "3", type: "spade" },
    { number: "3", type: "diamond" },
    { number: "3", type: "club" },
    { number: "3", type: "heart" },
    { number: "4", type: "spade" },
    { number: "4", type: "diamond" },
    { number: "4", type: "club" },
    { number: "4", type: "heart" },
    { number: "5", type: "spade" },
    { number: "5", type: "diamond" },
    { number: "5", type: "club" },
    { number: "5", type: "heart" },
    { number: "6", type: "spade" },
    { number: "6", type: "diamond" },
    { number: "6", type: "club" },
    { number: "6", type: "heart" },
    { number: "7", type: "spade" },
    { number: "7", type: "diamond" },
    { number: "7", type: "club" },
    { number: "7", type: "heart" },
    { number: "8", type: "spade" },
    { number: "8", type: "diamond" },
    { number: "8", type: "club" },
    { number: "8", type: "heart" },
    { number: "9", type: "spade" },
    { number: "9", type: "diamond" },
    { number: "9", type: "club" },
    { number: "9", type: "heart" },
    { number: "10", type: "spade" },
    { number: "10", type: "diamond" },
    { number: "10", type: "club" },
    { number: "10", type: "heart" },
    { number: "J", type: "spade" },
    { number: "J", type: "diamond" },
    { number: "J", type: "club" },
    { number: "J", type: "heart" },
    { number: "Q", type: "spade" },
    { number: "Q", type: "diamond" },
    { number: "Q", type: "club" },
    { number: "Q", type: "heart" },
    { number: "K", type: "spade" },
    { number: "K", type: "diamond" },
    { number: "K", type: "club" },
    { number: "K", type: "heart" },
  ];
  expect(getCardsDeck()).toEqual(expected);
  expect(getCardsDeck().length).toEqual(52);

  const expected2 = [...expected, ...expected];
  expect(getCardsDeck(7)).toEqual(expected2);
  expect(getCardsDeck(7).length).toEqual(104);

  // const expected2 = [...expected, ...expected];
  expect(getCardsDeck(12)).toEqual(expected2);
  expect(getCardsDeck(12).length).toEqual(104);

  const expected3 = [...expected, ...expected, ...expected];
  expect(getCardsDeck(13)).toEqual(expected3);
  expect(getCardsDeck(13).length).toEqual(156);
});
