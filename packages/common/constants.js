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
