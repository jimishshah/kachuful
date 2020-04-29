import React, { useEffect, useState } from "react";
import GameTemplate from "../templates/game-template";
import socket from "../socket";
import { useHistory } from "react-router-dom";
import { DEFAULT_WINS } from "../constants";

function Game({
  connectionId: currentUserId,
  users,
  setUsers,
  isGameStarted,
  setIsGameStarted,
  showAlert,
  setShowAlert,
  scores,
  setScores,
}) {
  const [openDialog, setOpenDialog] = useState(false);
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
    // if everyone have not placed the bid
    const usersWhoHaveNotPlayedTheBid = users.filter(
      (user) => user.wins.expectedWins === DEFAULT_WINS
    );
    if (usersWhoHaveNotPlayedTheBid.length > 0) {
      setShowAlert({
        message: "Wait for everyone to bid",
        severity: "info",
      });
      return false;
    }
    // if i have already thrown the card
    if (currentUser.cardThrown) {
      setShowAlert({
        message: "You have already thrown the card",
        severity: "info",
      });
      return false;
    }
    // if I am initiator
    if (currentUser.sequenceNumber === 1) return true;
    // if its not my turn
    const [initiator] = users.filter((user) => user.sequenceNumber === 1);
    const usersWhoThrewCards = users.filter((user) => Boolean(user.cardThrown));
    if (usersWhoThrewCards.length + 1 < Number(currentUser.sequenceNumber)) {
      setShowAlert({
        message: "Wait for your turn to throw the card",
        severity: "info",
      });
      return false;
    }
    // if i am throwing same card type as initiator
    const { type: intiatorType } = initiator.cardThrown;
    if (intiatorType === cardThrown.type) return true;

    // if i have no other option
    const myCardsWithSameType = currentUser.cardsInHand.filter(
      ({ type }) => type === intiatorType
    );
    if (intiatorType !== cardThrown.type && myCardsWithSameType.length === 0)
      return true;

    setShowAlert({
      message: "You can not throw this card",
      severity: "info",
    });
    return false;
  };
  const leaveTheTable = async () => {
    const ws = await socket.getInstance();
    ws.close();
    history.push("/judgement");
  };

  const clearShowAlert = () => {
    setShowAlert({});
  };

  const throwCard = async (cardThrown) => {
    if (currentUser.wins.expectedWins === DEFAULT_WINS) {
      setShowAlert({ message: "Please submit your bid", severity: "error" });
      return;
    }
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
    }
  };

  const openDialogHandler = () => {
    setOpenDialog(true);
  };
  const closeDialogHandler = () => {
    setOpenDialog(false);
  };

  const refreshHandler = async () => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        action: "refreshData",
        message: "",
      })
    );
  };

  useEffect(() => {
    if (!socket.hasInstance()) {
      history.push("/judgement");
    }
    socket.getInstance().then((ws) => {
      ws.onmessage = function(event) {
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
          setShowAlert({
            message: `Round winner is ${thisRoundWinner}`,
            severity: "success",
          });
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
    setShowAlert,
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
    showAlert,
    scores,
    clearShowAlert,
    hostPlayer,
    openDialog,
    openDialogHandler,
    closeDialogHandler,
    refreshHandler,
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
  setTimeout(async () => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        action: "finishRound",
        message: { tableId: currentUser.tableId },
      })
    );
  }, 1000);
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
