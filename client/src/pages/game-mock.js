import React, { useState } from "react";
import { userMock } from "../json/userMock";
import GameTemplate from "../templates/game-template";

function GameMock() {
  const users = userMock;
  const [currentUser] = users.filter((user) => user.ID === 1);
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
    currentUser,
    users,
    leaveTheTable: () => {
      console.log("leave table called");
    },
    sendMessage: () => {},
    distributeCards: () => {},
    bidWins: () => {},
    throwCard: () => {},
    finishRound: () => {
      console.log("finish round clicked");
    },
    scores: [{ playerName: "jimish", scoreCard: [10, 15, 17, 18, 19, 20, 21] }],
    showAlert: {},
    drawer,
    toggleDrawer,
  };

  return (
    <>
      <GameTemplate {...gameTemplateProps} />
    </>
  );
}

export default GameMock;
