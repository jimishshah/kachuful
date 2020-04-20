import React from "react";
import styled from "@emotion/styled";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import BidWin from "../organisms/bid-win";
import Card from "../organisms/card";
import UsersList from "../organisms/users-list";
import ScoreCard from "../organisms/score-card";
import { Box } from "@material-ui/core";
import { DEFAULT_WINS } from "../constants";

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

const CardsContainer = styled(Box)`
  text-align: center;
`;
const StyledH4 = styled.h4`
  margin-bottom: 0;
`;

function GameTemplate({
  currentUser,
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
  hasEveryoneThrownCard,
}) {
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
                    {currentUser.hasLevelStarted && (
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
              <StyledGrid item xs={12}>
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
                  currentUser,
                  hasEveryoneThrownCard,
                })}

                <h1>Last round winner: {roundWinner}</h1>
                <ScoreCard scores={scores} />
                <StyledGrid item xs={12}>
                  <StyledButton
                    variant="outlined"
                    color="secondary"
                    onClick={leaveTheTable}
                  >
                    Leave the Table
                  </StyledButton>
                </StyledGrid>
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
  currentUser,
  hasEveryoneThrownCard,
}) {
  return (
    <StyledGridButtonsContainer container spacing={2}>
      {/* <Button variant="contained" color="primary" onClick={sendMessage}>
        Send message
      </Button> */}
      {!currentUser.hasLevelStarted && (
        <StyledGrid item xs={12} key="dc">
          <StyledButton
            variant="contained"
            color="secondary"
            onClick={distributeCards}
          >
            Distribute Cards
          </StyledButton>
        </StyledGrid>
      )}
      {currentUser.wins.currentWins === DEFAULT_WINS &&
        currentUser.hasLevelStarted && (
          <StyledGrid item xs={12} key="bw">
            <BidWin bidWins={bidWins} />
          </StyledGrid>
        )}
      {hasEveryoneThrownCard && (
        <StyledGrid item xs={12} key="fr">
          <StyledButton
            variant="contained"
            color="secondary"
            onClick={finishRound}
          >
            Finish Round
          </StyledButton>
        </StyledGrid>
      )}
      {currentUser.shouldShowFinishLevel && (
        <StyledGrid item xs={12} key="fll">
          <StyledButton
            variant="contained"
            color="secondary"
            onClick={finishLevel}
          >
            Finish level
          </StyledButton>
        </StyledGrid>
      )}
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
