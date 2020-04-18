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
import BidWin from "../organisms/bid-win";

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
  bidWins,
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
          {renderCard("", currentUser.lastTrumpColour)} Trump colour
          <BidWin bidWins={bidWins} />
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
      {/* <Button variant="contained" color="primary" onClick={sendMessage}>
        Send message
      </Button> */}
      <Button variant="contained" color="primary" onClick={distributeCards}>
        Distribute Cards
      </Button>
    </>
  );
}

function renderCardsThrownInCurrentRound(users) {
  return users.map((user) => (
    <StyledGrid item xs key={user.ID}>
      {user.cardThrown
        ? renderCard(user.cardThrown.number, user.cardThrown.type)
        : `Waiting card from ${user.playerName}`}
    </StyledGrid>
  ));
}

function renderCardsInHand(currentUser) {
  return currentUser.cardsInHand.map(({ number, type }) => (
    <StyledGrid item xs key={number}>
      {renderCard(number, type)}
    </StyledGrid>
  ));
}

function renderCard(text, type) {
  return (
    <StyledPaper>
      <strong>{text}</strong>
      <img src={cardColours[type]} alt={type} />
    </StyledPaper>
  );
}

function renderUsers(users) {
  return users.map((user) => {
    const badgeText =
      user.wins.expectedWins === 99
        ? "..."
        : `${user.wins.currentWins}/${user.wins.expectedWins}`;
    return (
      <StyledGrid item xs key={user.ID}>
        <Badge color="primary" badgeContent={badgeText} showZero>
          <Avatar>{user.playerName.slice(0, 2).toUpperCase()}</Avatar>
        </Badge>
      </StyledGrid>
    );
  });
}

export default GameTemplate;
