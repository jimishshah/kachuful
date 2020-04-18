import React, { useEffect, useState } from "react";
import GameTemplate from "../templates/game-template";
import socket from "../socket";
import { useHistory } from "react-router-dom";

function Game({ connectionId: currentUserId }) {
  const onEveryonePlayed = () => {};
  const [users, setUsers] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [roundWinner, setRoundWinner] = useState("");
  const [scores, setScores] = useState([]);
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
        const { players, action } = JSON.parse(event.data);
        setUsers(players);
        setScores(getScores(players));
        if (action === "sendStartGame") {
          setIsGameStarted(true);
        }
        if (action === "sendFinishRound") {
          const [{ playerName: thisRoundWinner }] = players.filter(
            ({ lastRoundWinner }) => lastRoundWinner === true
          );
          setRoundWinner(thisRoundWinner);
        }
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

  const bidWins = async (myBid) => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        action: "bidWins",
        message: { myBid },
      })
    );
  };
  const throwCard = async (cardThrown) => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        action: "throwCard",
        message: { cardThrown },
      })
    );
  };
  const startGame = async () => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        action: "startGame",
        message: "",
      })
    );
  };
  const finishRound = async () => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        action: "finishRound",
        message: "",
      })
    );
  };
  const finishLevel = async () => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        action: "finishLevel",
        message: "",
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
    bidWins,
    throwCard,
    isGameStarted,
    startGame,
    roundWinner,
    finishRound,
    finishLevel,
    scores,
  };
  return <GameTemplate {...props} />;
}

export default Game;

function getScores(players) {
  return players.map(({ playerName, scoreCard }) => ({
    playerName,
    scoreCard,
  }));
}
