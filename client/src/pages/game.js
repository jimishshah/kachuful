import React, { useEffect, useState } from "react";
import GameTemplate from "../templates/game-template";
import socket from "../socket";
import { useHistory } from "react-router-dom";

function Game({ connectionId: currentUserId }) {
  const onEveryonePlayed = () => {};
  const [users, setUsers] = useState([]);
  const history = useHistory();
  const leaveTheTable = async () => {
    const ws = await socket.getInstance();
    ws.close();
    history.push("/");
  };

  useEffect(() => {
    if (!socket.hasInstance()) {
      history.push("/");
    }
    socket.getInstance().then((ws) => {
      ws.onmessage = function (event) {
        const { players } = JSON.parse(event.data);
        setUsers(players);
      };
    });
  }, [history]);

  const sendMessage = async () => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        message: "my first message",
        action: "message",
      })
    );
  };

  const distributeCards = async () => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        action: "distributeCards",
      })
    );
  };

  const props = {
    currentUserId,
    users,
    onEveryonePlayed,
    leaveTheTable,
    sendMessage,
    distributeCards,
  };
  return <GameTemplate {...props} />;
}

export default Game;
