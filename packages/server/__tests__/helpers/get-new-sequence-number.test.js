const getNewSequenceNumber = require("../../helpers/get-new-sequence-number");

test("test function works as expected", () => {
  // 1 2 3 4
  // 4 1 2 3
  // 3 4 1 2
  // 2 3 4 1
  expect(getNewSequenceNumber(4, 1, 1)).toEqual(1);
  expect(getNewSequenceNumber(4, 1, 2)).toEqual(2);
  expect(getNewSequenceNumber(4, 1, 3)).toEqual(3);
  expect(getNewSequenceNumber(4, 1, 4)).toEqual(4);

  expect(getNewSequenceNumber(4, 2, 1)).toEqual(4);
  expect(getNewSequenceNumber(4, 2, 2)).toEqual(1);
  expect(getNewSequenceNumber(4, 2, 3)).toEqual(2);
  expect(getNewSequenceNumber(4, 2, 4)).toEqual(3);
});
