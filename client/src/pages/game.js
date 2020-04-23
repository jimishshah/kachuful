import React, { useEffect } from "react";
import GameTemplate from "../templates/game-template";
import socket from "../socket";
import { useHistory } from "react-router-dom";

function Game({
  connectionId: currentUserId,
  users,
  setUsers,
  isGameStarted,
  setIsGameStarted,
  roundWinner,
  setRoundWinner,
  scores,
  setScores,
}) {
  const onEveryonePlayed = () => {};
  const history = useHistory();
  const [currentUser = {}] = users.filter((user) => user.ID === currentUserId);
  const [hostPlayer = { playerName: "" }] = users.filter(
    (user) => user.isHost === true
  );
  const playersThatHaveThrownCard = users.filter(
    ({ cardThrown }) => cardThrown !== null
  );
  const hasEveryoneThrownCard =
    users.length === playersThatHaveThrownCard.length;

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
    history.push("/judgement");
  };

  const clearRoundWinner = () => {
    setRoundWinner("");
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

  useEffect(() => {
    if (!socket.hasInstance()) {
      history.push("/judgement");
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

    if (hasEveryoneThrownCard && Number(currentUser.sequenceNumber) === 1) {
      finishRound(currentUser);
    }

    if (
      currentUser.shouldShowFinishLevel &&
      Number(currentUser.sequenceNumber) === 1
    ) {
      finishLevel(currentUser);
    }

    if (
      !currentUser.hasLevelStarted &&
      Number(currentUser.sequenceNumber) === 1
    ) {
      distributeCards(currentUser);
    }

    window.addEventListener("popstate", (e) => {
      // Nope, go back to your page
      history.go(1);
    });
  }, [
    history,
    currentUser,
    hasEveryoneThrownCard,
    setIsGameStarted,
    setRoundWinner,
    setScores,
    setUsers,
  ]);

  const props = {
    currentUser,
    users,
    onEveryonePlayed,
    leaveTheTable,
    sendMessage,
    bidWins,
    throwCard,
    isGameStarted,
    startGame,
    roundWinner,
    scores,
    clearRoundWinner,
    hostPlayer,
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

async function finishLevel(currentUser) {
  const ws = await socket.getInstance();
  ws.send(
    JSON.stringify({
      action: "finishLevel",
      message: { tableId: currentUser.tableId },
    })
  );
}
async function finishRound(currentUser) {
  const ws = await socket.getInstance();
  ws.send(
    JSON.stringify({
      action: "finishRound",
      message: { tableId: currentUser.tableId },
    })
  );
}

async function startGame(currentUser) {
  const ws = await socket.getInstance();
  ws.send(
    JSON.stringify({
      action: "startGame",
      message: { tableId: currentUser.tableId },
    })
  );
}

async function distributeCards(currentUser) {
  const ws = await socket.getInstance();
  ws.send(
    JSON.stringify({
      action: "distributeCards",
      message: { tableId: currentUser.tableId },
    })
  );
}

async function sendMessage() {
  const ws = await socket.getInstance();
  ws.send(
    JSON.stringify({
      message: "my first message",
      action: "message",
    })
  );
}

async function bidWins(myBid) {
  const ws = await socket.getInstance();
  ws.send(
    JSON.stringify({
      action: "bidWins",
      message: { myBid },
    })
  );
}
