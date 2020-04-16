function getCardsDeck() {
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

  return numbers.reduce((acc, curr) => {
    const typeSet = types.map((type) => ({ type, number: curr }));
    return [...acc, ...typeSet];
  }, []);
}

module.exports = {
  getCardsDeck,
};
