import React from "react";
import Paper from "@material-ui/core/Paper";
import styled from "@emotion/styled";
import { cardColours } from "@kachuful/common";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import { useButton } from "@kachuful/common";

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(1)}px;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  width: ${({ theme }) => theme.spacing(6)}px;
  margin: 0 auto;
  position: relative;
  min-height: 69px;
`;

const StyledTypography = styled(Typography)`
  line-height: 1;
  font-size: 0.9rem;
  text-align: center;
`;

function Card({ text, type, badge, onClick = () => {} }) {
  const clickHandler = () => {
    return onClick({ type, number: text });
  };

  const clickHandlerButton = useButton(clickHandler);
  return (
    <Badge
      badgeContent={badge ? badge.substring(0, 2).toUpperCase() : "..."}
      color="secondary"
      invisible={badge ? false : true}
    >
      <StyledPaper {...clickHandlerButton}>
        {type ? (
          <strong>{text}</strong>
        ) : (
          <StyledTypography variant="subtitle1">{text}</StyledTypography>
        )}
        {cardColours[type] && (
          <img src={cardColours[type]} alt={`${type} ${text}`} />
        )}
      </StyledPaper>
    </Badge>
  );
}

export default Card;
