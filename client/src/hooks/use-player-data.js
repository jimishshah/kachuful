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
    setState({
      currentUser,
      hostPlayer,
      playersThatHaveThrownCard,
      usersWhoThrewCards,
      intiatorCardType,
      usersWhoHaveNotPlayedTheBid,
      myCardsWithSameType,
    });
  }, [users, currentUserId]);
  return state;
}
