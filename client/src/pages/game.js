import React, { useEffect, useState, useRef } from "react";
import GameTemplate from "../templates/game-template";
import socket from "../socket";
import { useHistory } from "react-router-dom";
import { DEFAULT_WINS } from "../constants";
import ReactGA from "react-ga";
import useButton from "../hooks/use-button";
import useToggle from "../hooks/use-toggle";
import usePlayerData from "../hooks/use-player-data";

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
  const [helpDialog, toggleHelpDialogHandler] = useToggle(false);
  const [drawer, setDrawer] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
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
  } = usePlayerData(users, currentUserId);
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
      return true;
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
      return;
    }
    return true;
  };

  const toggleHelpDialog = () => {
    if (helpDialog) {
      ReactGA.event({
        category: "Menu",
        action: "Help",
      });
    }
    toggleHelpDialogHandler();
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

  const startGame = async () => {
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
  };

  useEffect(() => {
    if (!socket.hasInstance()) {
      history.push("/judgement");
      return;
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

          const { playerStateBeforeRoundFinished = [] } = JSON.parse(
            event.data
          );
          setUsers(playerStateBeforeRoundFinished);
          setScores(getScores(playerStateBeforeRoundFinished));
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
      // clearTimeout(timer.current);
    };
  }, [
    history,
    currentUser,
    hasEveryoneThrownCard,
    setShowAlert,
    setScores,
    setUsers,
    setConnectionId,
    users.length,
    currentUserId,
  ]);

  const startGameButton = useButton(startGame);

  const props = {
    currentUser,
    users,
    leaveTheTable,
    sendMessage,
    bidWins,
    throwCard,
    startGameButton,
    showAlert,
    scores,
    clearShowAlert,
    hostPlayer,
    helpDialog,
    toggleHelpDialog,
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

async function sendMessage() {
  const ws = await socket.getInstance();
  ws.send(
    JSON.stringify({
      message: "my first message",
      action: "message",
    })
  );
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
