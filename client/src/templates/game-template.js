import React from "react";
import styled from "@emotion/styled";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import ClubLogo from "../svg/club.svg";
import DiamondLogo from "../svg/diamond.svg";
import SpadeLogo from "../svg/spade.svg";
import HeartLogo from "../svg/heart.svg";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";

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

const StyledGrid = styled(Grid)`
  flex-grow: 0;
`;

const StyledDivder = styled(Divider)`
  margin-top: ${({ theme }) => theme.spacing(3)}px;
  margin-bottom: ${({ theme }) => theme.spacing(3)}px;
`;

function GameTemplate({
  currentUserId,
  users,
  currentLevel,
  leaveTheTable,
  sendMessage,
  distributeCards,
}) {
  const [currentUser] = users.filter((user) => user.ID === currentUserId);

  return (
    <>
      {currentUser ? (
        <>
          <StyledGrid container spacing={3}>
            <StyledGrid item xs={3}>
              <StyledGrid container spacing={3}>
                {renderUsers(users, currentLevel)}
              </StyledGrid>
            </StyledGrid>
            <StyledGrid item xs={9}>
              <StyledGrid container spacing={3}>
                {renderCardsThrownInCurrentRound(users)}
              </StyledGrid>
            </StyledGrid>
          </StyledGrid>
          <StyledDivder />
          <StyledGrid container spacing={4}>
            {renderCardsInHand(currentUser)}
          </StyledGrid>
          {renderButtons(leaveTheTable, sendMessage, distributeCards)}
        </>
      ) : (
        "Loading....."
      )}
    </>
  );
}

function renderButtons(leaveTheTable, sendMessage, distributeCards) {
  return (
    <>
      <Button variant="contained" color="primary" onClick={leaveTheTable}>
        Leave the Table
      </Button>
      <Button variant="contained" color="primary" onClick={sendMessage}>
        Send message
      </Button>
      <Button variant="contained" color="primary" onClick={distributeCards}>
        Distribute Cards
      </Button>
    </>
  );
}

function renderCardsThrownInCurrentRound(users) {
  return users.map((user) => (
    <StyledGrid item xs key={user.connectionID}>
      <StyledPaper>
        {user.cardThrown ? (
          <>
            <strong>{user.cardThrown.number}</strong>
            <img src={cardColours[user.cardThrown.type]} alt="club" />
          </>
        ) : (
          `Waiting card from ${user.playerName}`
        )}
      </StyledPaper>
    </StyledGrid>
  ));
}

function renderCardsInHand(currentUser) {
  return currentUser.cardsInHand.map(({ number, type }) => (
    <StyledGrid item xs key={number}>
      <StyledPaper>
        {number}
        <img src={cardColours[type]} alt="club" />
      </StyledPaper>
    </StyledGrid>
  ));
}

function renderUsers(users) {
  return users.map((user) => (
    <StyledGrid item xs key={user.connectionID}>
      <Badge
        color="primary"
        badgeContent={`
          ${user.wins.currentWins}/${user.wins.expectedWins}
        `}
        showZero
      >
        <Avatar>{user.playerName.slice(0, 2).toUpperCase()}</Avatar>
      </Badge>
    </StyledGrid>
  ));
}

export default GameTemplate;
