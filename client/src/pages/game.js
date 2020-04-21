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
  const [currentUser] = users.filter((user) => user.ID === currentUserId);

  const canIThrowThisCard = (cardThrown) => {
    // if i have already thrown the card
    if (currentUser.cardThrown) return false;
    // if I am initiator
    if (currentUser.sequenceNumber === 1) return true;
    const [{ cardThrown: inititorCardThrown }] = users.filter(
      (user) => user.sequenceNumber === 1
    );
    // if I am not the initiator
    if (!inititorCardThrown) return false;
    const { type: intiatorType } = inititorCardThrown;
    // if i am throwing same card type
    if (intiatorType === cardThrown.type) return true;

    const myCardsWithSameType = currentUser.cardsInHand.filter(
      ({ type }) => type === intiatorType
    );
    // if i have no other option
    if (intiatorType !== cardThrown.type && myCardsWithSameType.length === 0)
      return true;
    return false;
  };
  const leaveTheTable = async () => {
    const ws = await socket.getInstance();
    ws.close();
    history.push("/");
  };

  const clearRoundWinner = () => {
    setRoundWinner("");
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
    // am i in sequence 1
    // what is the colour of sequence 1
    // do i have that colour
    //
    if (canIThrowThisCard(cardThrown)) {
      const ws = await socket.getInstance();
      ws.send(
        JSON.stringify({
          action: "throwCard",
          message: { cardThrown },
        })
      );
    } else {
      console.log("you cant throw this card");
    }
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

  const playersThatHaveThrownCard = users.filter(
    ({ cardThrown }) => cardThrown !== null
  );
  const hasEveryoneThrownCard =
    users.length === playersThatHaveThrownCard.length;

  const props = {
    currentUser,
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
    hasEveryoneThrownCard,
    clearRoundWinner,
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
