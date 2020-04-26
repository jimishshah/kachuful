import React from "react";
import Paper from "@material-ui/core/Paper";
import styled from "@emotion/styled";
import { cardColours } from "../constants";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(1)}px;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  width: ${({ theme }) => theme.spacing(6)}px;
  margin: 0 auto;
  position: relative;
`;

const StyledTypography = styled(Typography)`
  line-height: normal;
`;

function Card({ text, type, badge, onClick = () => {} }) {
  const clickHandler = () => {
    onClick({ type, number: text });
  };
  return (
    <Badge
      badgeContent={badge ? badge.substring(0, 2).toUpperCase() : "..."}
      color="secondary"
      invisible={badge ? false : true}
    >
      <StyledPaper onClick={clickHandler}>
        {type ? (
          <strong>{text}</strong>
        ) : (
          <StyledTypography variant="subtitle1">{text}</StyledTypography>
        )}
        <img src={cardColours[type]} alt={type} />
        {/* <NameTag>Jimish</NameTag> */}
      </StyledPaper>
    </Badge>
  );
}

export default Card;
