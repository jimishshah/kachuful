import React, { useEffect } from "react";
import GameTemplate from "../templates/game-template";

const socket = new WebSocket(
  "wss://dnzhfv2njk.execute-api.eu-west-1.amazonaws.com/dev"
);
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
  const props = {
    currentUserId,
    users,
    currentLevel,
    onEveryonePlayed,
  };

  useEffect(() => {
    socket.onopen = function (event) {
      socket.send(
        JSON.stringify({
          message: "my first message",
          action: "message",
        })
      );

      socket.onmessage = function (event) {
        console.log(event.data);
      };
    };

    return () => {
      socket.close();
    };
  }, []);
  return <GameTemplate {...props} />;
}

export default Game;
