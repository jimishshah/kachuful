import React from "react";
import Paper from "@material-ui/core/Paper";
import styled from "@emotion/styled";
import ClubLogo from "../svg/club.svg";
import DiamondLogo from "../svg/diamond.svg";
import SpadeLogo from "../svg/spade.svg";
import HeartLogo from "../svg/heart.svg";

const cardColours = {
  club: ClubLogo,
  diamond: DiamondLogo,
  spade: SpadeLogo,
  heart: HeartLogo,
};

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(1)}px;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  width: ${({ theme }) => theme.spacing(6)}px;
`;

function Card({ text, type, onClick }) {
  const clickHandler = () => {
    onClick({ type, number: text });
  };
  return (
    <StyledPaper onClick={clickHandler}>
      <strong>{text}</strong>
      <img src={cardColours[type]} alt={type} />
    </StyledPaper>
  );
}

export default Card;
