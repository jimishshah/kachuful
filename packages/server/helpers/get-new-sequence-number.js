// 1 2 3 4
// 4 1 2 3
// 3 4 1 2
// 2 3 4 1

function getNewSequence(
  totalPlayers,
  winningPlayerSequenceNumber,
  currentSequence
) {
  const array1 = Array.from(Array(totalPlayers).keys());
  const array2 = Array.from(Array(totalPlayers).keys());
  const mergedArray = [...array1, ...array2].map((value) => value + 1);
  mergedArray.splice(0, mergedArray.indexOf(winningPlayerSequenceNumber));
  mergedArray.splice(totalPlayers);
  return mergedArray.indexOf(currentSequence) + 1;
}

module.exports = getNewSequence;
