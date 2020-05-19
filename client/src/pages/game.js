import React, { useEffect, useState, useRef, useCallback } from "react";
import GameTemplate from "../templates/game-template";
import socket from "../socket";
import { useHistory } from "react-router-dom";
import { DEFAULT_WINS } from "../constants";
import ReactGA from "react-ga";

function Game({
  connectionId: currentUserId,
  users = [],
  setUsers,
  showAlert,
  setShowAlert,
  scores,
  setScores,
  setConnectionId,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [drawer, setDrawer] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const onEveryonePlayed = () => {};
  const history = useHistory();
  const timer = useRef(null);

  const {
    currentUser,
    hostPlayer,
    playersThatHaveThrownCard,
    usersWhoThrewCards,
    intiatorCardType,
    usersWhoHaveNotPlayedTheBid,
    myCardsWithSameType,
  } = getMyData(users, currentUserId);
  const hasEveryoneThrownCard =
    users.length === playersThatHaveThrownCard.length;

  const leaveTheTable = async () => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        action: "endGame",
        message: { connectionID: "thisConnection" },
      })
    );
    localStorage.removeItem("connectionID");
    ws.close();
    setConnectionId(null);
    ReactGA.event({
      category: "Menu",
      action: "Exit Game",
    });
    history.push("/judgement");
  };

  const clearShowAlert = () => {
    setShowAlert({});
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawer({ ...drawer, [anchor]: open });
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
    if (
      canIThrowThisCard({
        cardThrown,
        usersWhoHaveNotPlayedTheBid,
        currentUser,
        usersWhoThrewCards,
        intiatorCardType,
        setShowAlert,
        myCardsWithSameType,
      })
    ) {
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
    ReactGA.event({
      category: "Menu",
      action: "Help",
    });
    setOpenDialog(true);
  };
  const closeDialogHandler = () => {
    setOpenDialog(false);
  };

  const bidWins = async (myBid) => {
    if (myBid < 0 || myBid > currentUser.cardsInHand.length) {
      setShowAlert({
        message: `Your bid should be between 0 and ${currentUser.cardsInHand.length}`,
        severity: "error",
      });
      return;
    }
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        action: "bidWins",
        message: { myBid },
      })
    );
  };

  const refreshHandler = useCallback(async (e) => {
    let ws = await socket.getInstance();
    if (ws.readyState === WebSocket.CLOSED) {
      ws = await socket.getInstance(true);
      const oldConnectionId = localStorage.getItem("connectionID");
      ws.send(
        JSON.stringify({
          action: "reCreateConnection",
          message: { oldConnectionId },
        })
      );
      return;
    }
    ws.send(
      JSON.stringify({
        action: "refreshData",
        message: "",
      })
    );
  }, []);

  useEffect(() => {
    if (!socket.hasInstance()) {
      history.push("/judgement");
      return;
    }
    if (users.length === 0) {
      refreshHandler();
    }
    socket.getInstance().then((ws) => {
      ws.onmessage = function (event) {
        const { players = [], action } = JSON.parse(event.data);
        if (action === "sendCloseSession") {
          ws.close();
          history.push("/judgement");
          window.location.reload();
          return;
        }
        if (action === "sendRecreateConnection") {
          const [{ ID: newConnectionId }] = players.filter(
            ({ oldConnectionId }) => oldConnectionId === currentUserId
          );
          setConnectionId(newConnectionId);
          localStorage.setItem("connectionID", newConnectionId);
        }
        if (action === "sendFinishRound") {
          const [{ playerName: thisRoundWinner }] = players.filter(
            ({ lastRoundWinner }) => lastRoundWinner === true
          );
          setShowAlert({
            message: `Round winner is ${thisRoundWinner}`,
            severity: "success",
          });

          timer.current = setTimeout(() => {
            setUsers(players);
            setScores(getScores(players));
          }, 1700);
        } else {
          setUsers(players);
          setScores(getScores(players));
        }
      };
    });

    window.addEventListener("popstate", (e) => {
      // Nope, go back to your page
      history.go(1);
    });

    return () => {
      clearTimeout(timer.current);
    };
  }, [
    history,
    currentUser,
    hasEveryoneThrownCard,
    setShowAlert,
    setScores,
    setUsers,
    refreshHandler,
    setConnectionId,
    users.length,
    currentUserId,
  ]);

  const props = {
    currentUser,
    users,
    onEveryonePlayed,
    leaveTheTable,
    sendMessage,
    bidWins,
    throwCard,
    startGame,
    showAlert,
    scores,
    clearShowAlert,
    hostPlayer,
    openDialog,
    openDialogHandler,
    closeDialogHandler,
    refreshHandler,
    drawer,
    toggleDrawer,
    messageUs,
  };
  return <GameTemplate {...props} />;
}

export default Game;

function messageUs() {
  ReactGA.event({
    category: "Button",
    action: "Send Feedback",
  });
}

function getScores(players) {
  return players.map(({ playerName, scoreCard }) => ({
    playerName,
    scoreCard,
  }));
}

async function startGame(currentUser) {
  const ws = await socket.getInstance();
  ws.send(
    JSON.stringify({
      action: "startGame",
      message: { tableId: currentUser.tableId },
    })
  );
  ReactGA.event({
    category: "Button",
    action: "Start Game",
  });
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

function getMyData(users, currentUserId) {
  const [currentUser = { cardsInHand: [] }] = users.filter(
    (user) => user.ID === currentUserId
  );
  const [hostPlayer = { playerName: "" }] = users.filter(
    (user) => user.isHost === true
  );
  const playersThatHaveThrownCard = users.filter(
    ({ cardThrown }) => cardThrown !== null
  );
  const usersWhoThrewCards = users.filter((user) => Boolean(user.cardThrown));
  const usersWhoHaveNotPlayedTheBid = users.filter(
    (user) => user.wins.expectedWins === DEFAULT_WINS
  );
  const [initiator] = users.filter((user) => user.sequenceNumber === 1);
  let intiatorCardType = null;
  let myCardsWithSameType = [];
  if (initiator && initiator.cardThrown && initiator.cardThrown.type) {
    ({ type: intiatorCardType } = initiator.cardThrown);
    myCardsWithSameType = currentUser.cardsInHand.filter(
      ({ type }) => type === intiatorCardType
    );
  }
  return {
    currentUser,
    hostPlayer,
    playersThatHaveThrownCard,
    usersWhoThrewCards,
    intiatorCardType,
    usersWhoHaveNotPlayedTheBid,
    myCardsWithSameType,
  };
}

function canIThrowThisCard({
  cardThrown,
  usersWhoHaveNotPlayedTheBid,
  currentUser,
  usersWhoThrewCards,
  intiatorCardType,
  setShowAlert,
  myCardsWithSameType,
}) {
  // if everyone have not placed the bid
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
  if (usersWhoThrewCards.length + 1 < Number(currentUser.sequenceNumber)) {
    setShowAlert({
      message: "Wait for your turn to throw the card",
      severity: "info",
    });
    return false;
  }
  // if i am throwing same card type as initiator
  if (intiatorCardType === cardThrown.type) return true;

  // if i have no other option
  if (intiatorCardType !== cardThrown.type && myCardsWithSameType.length === 0)
    return true;

  setShowAlert({
    message: "You can not throw this card",
    severity: "info",
  });
  return false;
}
