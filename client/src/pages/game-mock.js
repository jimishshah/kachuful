import React from "react";
import { userMock } from "../json/userMock";
import GameTemplate from "../templates/game-template";

function GameMock() {
  const users = userMock;
  const [currentUser] = users.filter((user) => user.ID === 1);
  const gameTemplateProps = {
    currentUser,
    users,
    leaveTheTable: () => {},
    sendMessage: () => {},
    distributeCards: () => {},
    bidWins: () => {},
    throwCard: () => {},
    finishRound: () => {
      console.log("finish round clicked");
    },
    isGameStarted: true,
    scores: [{ playerName: "jimish", scoreCard: [10, 15, 17, 18, 19, 20, 21] }],
  };

  return (
    <>
      <GameTemplate {...gameTemplateProps} />
    </>
  );
}

export default GameMock;
