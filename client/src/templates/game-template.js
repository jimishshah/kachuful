import React from "react";
import styled from "@emotion/styled";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import BidWin from "../organisms/bid-win";
import Card from "../organisms/card";

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
  throwCard,
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
            {renderCardsInHand(currentUser, throwCard)}
          </StyledGrid>
          {renderButtons(leaveTheTable, sendMessage, distributeCards)}
          <Card text="" type={currentUser.lastTrumpColour} />
          Trump colour
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
      {user.cardThrown ? (
        <Card text={user.cardThrown.number} type={user.cardThrown.type} />
      ) : (
        `Waiting card from ${user.playerName}`
      )}
    </StyledGrid>
  ));
}

function renderCardsInHand(currentUser, throwCard) {
  return currentUser.cardsInHand.map(({ number, type }) => (
    <StyledGrid item xs key={number}>
      <Card text={number} type={type} onClick={throwCard} />
    </StyledGrid>
  ));
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
