import React from "react";
import { userMock } from "../json/userMock";
import GameTemplate from "../templates/game-template";

const currentUserIdMock = 1;
function GameMock() {
  const props = {
    currentUserId: currentUserIdMock,
    users: userMock,
    leaveTheTable: () => {},
    sendMessage: () => {},
    distributeCards: () => {},
    bidWins: () => {},
    throwCard: () => {},
  };
  return <GameTemplate {...props} />;
}

export default GameMock;
