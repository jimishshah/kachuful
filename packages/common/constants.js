import ClubLogo from "./svg/club.svg";
import DiamondLogo from "./svg/diamond.svg";
import SpadeLogo from "./svg/spade.svg";
import HeartLogo from "./svg/heart.svg";
import ClubLogoPng from "./svg/club.png";
import DiamondLogoPng from "./svg/diamond.png";
import SpadeLogoPng from "./svg/spade.png";
import HeartLogoPng from "./svg/heart.png";

export const cardColours = {
  club: ClubLogo,
  diamond: DiamondLogo,
  spade: SpadeLogo,
  heart: HeartLogo,
  clubPng: ClubLogoPng,
  diamondPng: DiamondLogoPng,
  spadePng: SpadeLogoPng,
  heartPng: HeartLogoPng,
};

export const DEFAULT_WINS = 99;
export const websocketLink =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
    ? "ws://localhost:3001"
    : "wss://dnzhfv2njk.execute-api.eu-west-1.amazonaws.com/dev";

export const linkBase =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://thecardgames.net";

export const gameRules = [
  "1. Each Player gets 1 card in Level 1, 2 cards in Level 2 and so on",
  "2. Trump type changes on every level. In rotational order of Spade, Diamond, Club & Heart.",
  "3. Each Player need to predict wins in the level before first player throws card",
  "4. Each player throws one card, first player's card decides the type other players should throw, highest card player wins the round",
  "5. If player don't have same type card then Trump type could be thrown and that takes precedence, if player don't have Trump type card then any card can be thrown",
  "6. Each player that wins exact same rounds as predicted, wins the level",
  "7. Every Level winning player will get 10 + predicted win points. eg if predicted win was 2, player gets 10 + 2 = 12 points",
  "8. Player with the highest total points in the score card wins.",
];
