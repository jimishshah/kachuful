import React from "react";
import Paper from "@material-ui/core/Paper";
import styled from "@emotion/styled";
import { cardColours } from "@kachuful/common";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import { useButton } from "@kachuful/common";
import Box from "@material-ui/core/Box";

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(1)}px;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  width: ${({ theme }) => theme.spacing(6)}px;
  margin: 0 auto;
  position: relative;
  min-height: 69px;
  border-bottom-left-radius: ${({ playerName }) =>
    playerName ? "0px" : "4px"};
  border-bottom-right-radius: ${({ playerName }) =>
    playerName ? "0px" : "4px"};
`;

const StyledTypography = styled(Typography)`
  line-height: 1;
  font-size: 0.9rem;
  text-align: center;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlayerName = styled(Box)`
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding-top: 4px;
  padding-bottom: 2px;
  border: 1px solid;
`;

function Card({ text, type, badge, onClick = () => {}, playerName }) {
  const clickHandler = () => {
    return onClick({ type, number: text });
  };

  const clickHandlerButton = useButton(clickHandler);
  return (
    <Badge
      badgeContent={badge}
      color="secondary"
      invisible={badge ? false : true}
    >
      <CardContainer>
        <StyledPaper {...clickHandlerButton} playerName={playerName}>
          {type ? (
            <strong>{text}</strong>
          ) : (
            <StyledTypography variant="subtitle1">{text}</StyledTypography>
          )}
          {cardColours[type] && (
            <img src={cardColours[type]} alt={`${type} ${text}`} />
          )}
        </StyledPaper>
        {playerName && (
          <PlayerName>
            <StyledTypography variant="subtitle1">
              {playerName}
            </StyledTypography>
          </PlayerName>
        )}
      </CardContainer>
    </Badge>
  );
}

export default Card;
