import React from "react";
import Paper from "@material-ui/core/Paper";
import styled from "@emotion/styled";
import { cardColours } from "../constants";

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(1)}px;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  width: ${({ theme }) => theme.spacing(6)}px;
  margin: 0 auto;
`;

function Card({ text, type, onClick = () => {} }) {
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
