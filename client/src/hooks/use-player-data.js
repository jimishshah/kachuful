import { useEffect, useState } from "react";
import { DEFAULT_WINS } from "../constants";

export default function (users, currentUserId) {
  const [state, setState] = useState({
    currentUser: { cardsInHand: [] },
    hostPlayer: { playerName: "" },
    playersThatHaveThrownCard: [],
    usersWhoThrewCards: [],
    intiatorCardType: null,
    usersWhoHaveNotPlayedTheBid: [],
    myCardsWithSameType: [],
    scores: [],
    cardsThrown: [],
    cardsInHand: [],
  });
  useEffect(() => {
    const [currentUser = { cardsInHand: [] }] = users.filter(
      (user) => user.ID === currentUserId
    );
    const [hostPlayer = { playerName: "" }] = users.filter(
      (user) => user.isHost === true
    );
    const playersThatHaveThrownCard = users.filter(
      ({ cardThrown }) => cardThrown !== null
    );
    const usersWhoThrewCards = users.filter((user) => Boolean(user.cardThrown));
    const usersWhoHaveNotPlayedTheBid = users.filter(
      (user) => user.wins.expectedWins === DEFAULT_WINS
    );
    const [initiator] = users.filter((user) => user.sequenceNumber === 1);
    let intiatorCardType = null;
    let myCardsWithSameType = [];
    if (initiator && initiator.cardThrown && initiator.cardThrown.type) {
      ({ type: intiatorCardType } = initiator.cardThrown);
      myCardsWithSameType = currentUser.cardsInHand.filter(
        ({ type }) => type === intiatorCardType
      );
    }
    const cardsThrown = users
      .sort((a, b) => (a.sequenceNumber > b.sequenceNumber ? 1 : -1))
      .map(({ cardThrown, playerName, sequenceNumber }) =>
        cardThrown
          ? { ...cardThrown, badge: playerName }
          : {
              number: `${sequenceNumber}. Waiting for ${playerName}`,
            }
      );

    const scores = getScores(users)
      .map(({ playerName, scoreCard: initialScoreCard }) => {
        const totalScore = initialScoreCard.reduce(
          (acc, curr) => acc + curr,
          0
        );
        const scoreCard = [...initialScoreCard].reverse();
        return {
          playerName,
          scoreCard,
          totalScore,
        };
      })
      .sort((a, b) => (a.totalScore < b.totalScore ? 1 : -1));

    setState({
      currentUser,
      hostPlayer,
      playersThatHaveThrownCard,
      usersWhoThrewCards,
      intiatorCardType,
      usersWhoHaveNotPlayedTheBid,
      myCardsWithSameType,
      scores,
      cardsThrown,
      cardsInHand: currentUser.cardsInHand,
    });
  }, [users, currentUserId]);
  return state;
}

function getScores(players) {
  return players.map(({ playerName, scoreCard }) => ({
    playerName,
    scoreCard,
  }));
}
