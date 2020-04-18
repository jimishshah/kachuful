import React from "react";
import { userMock } from "../json/userMock";
import GameTemplate from "../templates/game-template";

const currentUserIdMock = 1;
function GameMock() {
  const gameTemplateProps = {
    currentUserId: currentUserIdMock,
    users: userMock,
    leaveTheTable: () => {},
    sendMessage: () => {},
    distributeCards: () => {},
    bidWins: () => {},
    throwCard: () => {},
    finishRound: () => {
      console.log("finish round clicked");
    },
    isGameStarted: true,
  };

  return (
    <>
      <GameTemplate {...gameTemplateProps} />
    </>
  );
}

export default GameMock;
