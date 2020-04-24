function getCardsDeck(totalPlayers = 6) {
  const types = ["spade", "diamond", "club", "heart"];
  const numbers = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  const cardDeck = numbers.reduce((acc, curr) => {
    const typeSet = types.map((type) => ({ type, number: curr }));
    return [...acc, ...typeSet];
  }, []);

  const setsToUse = Math.ceil(totalPlayers / 6);

  const resultCardDeck = Array.from(Array(setsToUse).keys()).reduce(
    (acc) => [...acc, ...cardDeck],
    []
  );

  return resultCardDeck;
}

module.exports = {
  getCardsDeck,
};
