import React, { useState } from "react";
import { userMock } from "../json/userMock";
import GameTemplate from "../organisms/game-template";
import { DEFAULT_WINS, usePlayerData } from "@kachuful/common";

function GameMock() {
  const users = userMock;
  const {
    currentUser,
    hostPlayer,
    usersWhoThrewCards,
    intiatorCardType,
    usersWhoHaveNotPlayedTheBid,
    myCardsWithSameType,
    scores,
    cardsThrown,
    cardsInHand,
  } = usePlayerData(users, 1, DEFAULT_WINS);
  const [drawer, setDrawer] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    console.log("ca");
    setDrawer({ ...drawer, left: open });
  };
  const gameTemplateProps = {
    users,
    leaveTheTable: () => {
      console.log("leave table called");
    },
    bidWins: () => {},
    throwCard: () => {},
    showAlert: {},
    drawer,
    toggleDrawer,
    currentUser,
    hostPlayer,
    usersWhoThrewCards,
    intiatorCardType,
    usersWhoHaveNotPlayedTheBid,
    myCardsWithSameType,
    scores,
    cardsThrown,
    cardsInHand,
  };

  return (
    <>
      <GameTemplate {...gameTemplateProps} />
    </>
  );
}

export default GameMock;
