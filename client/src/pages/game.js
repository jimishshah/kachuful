import React, { useEffect, useState } from "react";
import GameTemplate from "../templates/game-template";
import socket from "../socket";
import { useHistory } from "react-router-dom";

const currentUserId = 1;
const users = [
  {
    name: "Jimish",
    avatarLink: "",
    userId: 1,
  },
  {
    name: "Sujana",
    avatarLink: "",
    userId: 2,
  },
  {
    name: "Hardik",
    avatarLink: "",
    userId: 3,
  },
  {
    name: "Hiren",
    avatarLink: "",
    userId: 4,
  },
  {
    name: "Malav",
    avatarLink: "",
    userId: 5,
  },
  {
    name: "Meghana",
    avatarLink: "",
    userId: 6,
  },
];

const currentLevel = {
  users: {
    1: {
      cardThrown: { type: "club", number: "2" },
      cardsInHand: [
        { type: "club", number: "J" },
        { type: "club", number: "K" },
      ],
      wins: { expectedWins: 3, currentWins: 1 },
    },
    2: {
      cardsInHand: [
        { type: "club", number: "J" },
        { type: "club", number: "K" },
      ],
      wins: { expectedWins: 3, currentWins: 1 },
    },
    3: {
      cardThrown: { type: "heart", number: "2" },
      cardsInHand: [
        { type: "club", number: "J" },
        { type: "club", number: "K" },
      ],
      wins: { expectedWins: 3, currentWins: 1 },
    },
    4: {
      cardThrown: { type: "diamond", number: "2" },
      cardsInHand: [
        { type: "club", number: "J" },
        { type: "club", number: "K" },
      ],
      wins: { expectedWins: 3, currentWins: 2 },
    },
    5: {
      cardThrown: { type: "spade", number: "2" },
      cardsInHand: [
        { type: "club", number: "J" },
        { type: "club", number: "K" },
      ],
      wins: { expectedWins: 0, currentWins: 1 },
    },
    6: {
      cardThrown: { type: "spade", number: "K" },
      cardsInHand: [
        { type: "club", number: "J" },
        { type: "club", number: "K" },
      ],
      wins: { expectedWins: 3, currentWins: 3 },
    },
  },
  totalNumberOfCards: 3,
  cardsRemaining: 2,
  trumpColour: "spade",
};
function Game() {
  const onEveryonePlayed = () => {};
  const [users, setUsers] = useState([]);
  console.log(users, "users");
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

  const props = {
    currentUserId,
    users,
    currentLevel,
    onEveryonePlayed,
    leaveTheTable,
    sendMessage,
  };
  return <GameTemplate {...props} />;
}

export default Game;
