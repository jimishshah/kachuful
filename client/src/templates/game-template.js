import React from "react";
import styled from "@emotion/styled";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import BidWin from "../organisms/bid-win";
import Card from "../organisms/card";
import UsersList from "../organisms/users-list";
import ScoreCard from "../organisms/score-card";
import { Paper, Box } from "@material-ui/core";

const StyledGrid = styled(Grid)`
  flex-grow: 0;
  /* margin-top: ${({ theme }) => theme.spacing(1)}px; */
  /* margin-bottom: ${({ theme }) => theme.spacing(1)}px; */
`;
const StyledGridButtonsContainer = styled(StyledGrid)`
  flex-grow: 0;
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledDivder = styled(Divider)`
  margin-top: ${({ theme }) => theme.spacing(3)}px;
  margin-bottom: ${({ theme }) => theme.spacing(3)}px;
`;

const CardsContainer = styled(Box)`
  text-align: center;
`;
const StyledH4 = styled.h4`
  margin-bottom: 0;
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
                <StyledGrid container spacing={3}>
                  <StyledGrid item xs={12}>
                    {currentUser.lastTrumpColour && (
                      <CardsContainer
                        bgcolor="secondary.main"
                        color="secondary.contrastText"
                        p={2}
                      >
                        <Card text="" type={currentUser.lastTrumpColour} />
                        <StyledH4>Trump colour</StyledH4>
                      </CardsContainer>
                    )}
                  </StyledGrid>
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
            <StyledGrid container spacing={3}>
              <StyledGrid xs={12}>
                {currentUser.cardsInHand.length > 0 && (
                  <CardsContainer
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    p={2}
                  >
                    <StyledGrid container spacing={3}>
                      {renderCardsInHand(currentUser, throwCard)}
                    </StyledGrid>
                    <StyledH4>Cards in hand</StyledH4>
                  </CardsContainer>
                )}
                {renderButtons({
                  leaveTheTable,
                  sendMessage,
                  distributeCards,
                  finishRound,
                  finishLevel,
                  bidWins,
                })}

                <h1>Last round winner: {roundWinner}</h1>
                <h3>score card</h3>
                <ScoreCard scores={scores} />
              </StyledGrid>
            </StyledGrid>
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
  bidWins,
}) {
  return (
    <StyledGridButtonsContainer container spacing={2}>
      {/* <Button variant="contained" color="primary" onClick={sendMessage}>
        Send message
      </Button> */}
      <StyledGrid item xs={12}>
        <StyledButton
          variant="outlined"
          color="primary"
          onClick={distributeCards}
        >
          Distribute Cards
        </StyledButton>
      </StyledGrid>
      <StyledGrid item xs={12}>
        <BidWin bidWins={bidWins} />
      </StyledGrid>
      <StyledGrid item xs={12}>
        <StyledButton
          variant="outlined"
          color="secondary"
          onClick={finishRound}
        >
          Finish Round
        </StyledButton>
      </StyledGrid>
      <StyledGrid item xs={12}>
        <StyledButton
          variant="outlined"
          color="secondary"
          onClick={finishLevel}
        >
          Finish level
        </StyledButton>
      </StyledGrid>
      <StyledGrid item xs={12}>
        <StyledButton
          variant="contained"
          color="secondary"
          onClick={leaveTheTable}
        >
          Leave the Table
        </StyledButton>
      </StyledGrid>
    </StyledGridButtonsContainer>
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
