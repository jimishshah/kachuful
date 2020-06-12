import React from "react";
import { useGame } from "@kachuful/common";
import GameTemplate from "../organisms/game-template";

function Game({ connectionId: currentUserId, setConnectionId }) {
  const props = useGame({ currentUserId, setConnectionId });
  return <GameTemplate {...props} />;
}

export default Game;
