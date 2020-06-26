import { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { DEFAULT_WINS } from "../constants";
import ReactGA from "react-ga";
import useButton from "./use-button";
import useToggle from "./use-toggle";
import usePlayerData from "./use-player-data";
import useSocket from "./use-socket";
import socket from "../socket";

function Game({ currentUserId, setConnectionId }) {
  const [helpDialog, toggleHelpDialogHandler] = useToggle(false);
  const [shouldDisableMyCards, disableMyCardsHandler] = useState(false);
  const [drawer, setDrawer] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [users, setUsers] = useState([]);

  const [showAlert, setShowAlert] = useState({});
  const history = useHistory();
  const timer = useRef(null);

  const {
    currentUser,
    hostPlayer,
    usersWhoThrewCards,
    intiatorCardType,
    usersWhoHaveNotPlayedTheBid,
    myCardsWithSameType,
    scores,
    cardsThrown,
    cardsInHand,
  } = usePlayerData(users, currentUserId, DEFAULT_WINS);

  const noSocketHandler = () => history.push("/judgement");

  const onSocketMessageHandler = (event, ws) => {
    const { players = [], action } = JSON.parse(event.data);
    switch (action) {
      case "sendPong":
        return;
      case "sendFinishRound":
        const [{ playerName: thisRoundWinner }] = players.filter(
          ({ lastRoundWinner }) => lastRoundWinner === true
        );
        setShowAlert({
          message: `Round winner is ${thisRoundWinner}`,
          severity: "success",
        });

        timer.current = setTimeout(() => {
          setUsers(players);
        }, 3000);

        const { playerStateBeforeRoundFinished = [] } = JSON.parse(event.data);
        setUsers(playerStateBeforeRoundFinished);
        return;
      case "sendRecreateConnection":
        clearTimeout(timer.current);
        const [{ ID: newConnectionId }] = players.filter(
          ({ oldConnectionId }) => oldConnectionId === currentUserId
        );
        localStorage.setItem("connectionID", newConnectionId);
        setConnectionId(newConnectionId);
        setUsers(players);
        return;
      case "sendCloseSession":
        ws.close();
        const { shouldRefresh } = JSON.parse(event.data);
        if (shouldRefresh) {
          history.push("/judgement");
          window.location.reload();
        }
        return;
      default:
        setUsers(players);
    }
  };

  const reCreateConnectionHandler = (ws) => {
    ws.send(
      JSON.stringify({
        action: "reCreateConnection",
        message: {
          oldConnectionId: localStorage.getItem("connectionID"),
          shouldRefresh: false,
        },
      })
    );
  };

  const offlineHandler = (message) => {
    setShowAlert({
      message: message || `Reconnecting...check your network`,
      severity: "error",
    });
  };
  const onlineHandler = () => {
    setShowAlert({
      message: `Connected. You are back`,
      severity: "success",
    });
  };

  const ws = useSocket({
    socket,
    onMessageHandler: onSocketMessageHandler,
    reCreateConnectionHandler,
    noSocketHandler,
    offlineHandler,
    onlineHandler,
  });

  const leaveTheTable = () => {
    ws.send(
      JSON.stringify({
        action: "endGame",
        message: { connectionID: "thisConnection" },
      }),
      false
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

  const throwCard = (cardThrown) => {
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
      ws.send(
        JSON.stringify({
          action: "throwCard",
          message: { cardThrown },
        })
      );
      disableMyCardsHandler(true);
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
    ws.send(
      JSON.stringify({
        action: "bidWins",
        message: { myBid },
      })
    );
  };

  const startGame = () => {
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
    window.addEventListener("popstate", () => {
      window.location.reload();
    });
  }, [history]);

  useEffect(() => {
    disableMyCardsHandler(false);
  }, [users]);

  const startGameButton = useButton(startGame);

  return {
    currentUser,
    users,
    leaveTheTable,
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
    shouldDisableMyCards,
    cardsThrown,
    cardsInHand,
    reCreateConnectionManuallyHandler: ws.createNewConnection,
  };
}

export default Game;

function messageUs() {
  ReactGA.event({
    category: "Button",
    action: "Send Feedback",
  });
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
