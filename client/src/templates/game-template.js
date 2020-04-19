import React from "react";
import styled from "@emotion/styled";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import BidWin from "../organisms/bid-win";
import Card from "../organisms/card";
import UsersList from "../organisms/users-list";
import ScoreCard from "../organisms/score-card";

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
  leaveTheTable,
  sendMessage,
  distributeCards,
  bidWins,
  throwCard,
  finishRound,
  isGameStarted,
  startGame,
  roundWinner,
  finishLevel,
  scores,
}) {
  const [currentUser] = users.filter((user) => user.ID === currentUserId);

  return (
    <>
      {currentUser ? (
        <>
          <StyledGrid container spacing={3}>
            <StyledGrid item xs={3}>
              <StyledGrid container spacing={3}>
                <UsersList users={users} />
              </StyledGrid>
            </StyledGrid>
            {isGameStarted && (
              <StyledGrid item xs={9}>
                <StyledGrid container spacing={3}>
                  {renderCardsThrownInCurrentRound(users)}
                </StyledGrid>
              </StyledGrid>
            )}
            {!isGameStarted && (
              <Button variant="contained" color="primary" onClick={startGame}>
                Start Game
              </Button>
            )}
          </StyledGrid>
          {isGameStarted && (
            <>
              <StyledDivder />
              <StyledGrid container spacing={4}>
                {renderCardsInHand(currentUser, throwCard)}
              </StyledGrid>
              {renderButtons({
                leaveTheTable,
                sendMessage,
                distributeCards,
                finishRound,
                finishLevel,
              })}
              <Card text="" type={currentUser.lastTrumpColour} />
              Trump colour
              <BidWin bidWins={bidWins} />
              <h1>Last round winner: {roundWinner}</h1>
              <h3>score card</h3>
              <ScoreCard scores={scores} />
            </>
          )}
        </>
      ) : (
        "Loading....."
      )}
    </>
  );
}

function renderButtons({
  leaveTheTable,
  sendMessage,
  distributeCards,
  finishRound,
  finishLevel,
}) {
  return (
    <>
      {/* <Button variant="contained" color="primary" onClick={sendMessage}>
        Send message
      </Button> */}
      <Button variant="contained" color="primary" onClick={distributeCards}>
        Distribute Cards
      </Button>
      <Button variant="contained" color="primary" onClick={finishRound}>
        Finish Round
      </Button>
      <Button variant="contained" color="primary" onClick={finishLevel}>
        Finish level
      </Button>
      <Button variant="contained" color="primary" onClick={leaveTheTable}>
        Leave the Table
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
        `Waiting card from ${user.playerName}: Sq ${user.sequenceNumber}`
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

export default GameTemplate;
