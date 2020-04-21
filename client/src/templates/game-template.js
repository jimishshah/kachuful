import React from "react";
import styled from "@emotion/styled";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import BidWin from "../organisms/bid-win";
import UsersList from "../organisms/users-list";
import ScoreCard from "../organisms/score-card";
import { DEFAULT_WINS, cardColours } from "../constants";
import CardsList from "../organisms/cards-list";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

const StyledAppBar = styled(AppBar)`
  top: auto;
  bottom: 0;
`;

const StyledGrid = styled(Grid)`
  flex-grow: 0;
  text-align: center;
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

const StyledImg = styled.img`
  width: 35px;
  display: block;
  margin: 0 auto;
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
                  <StyledGrid item xs={12}>
                    {renderCardsThrownInCurrentRound(users)}
                  </StyledGrid>
                  <StyledGrid item xs={12}>
                    {currentUser.cardsInHand.length > 0 && (
                      <CardsList
                        title="Cards in hand"
                        clickHandler={throwCard}
                        cards={currentUser.cardsInHand}
                      />
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
            <>
              <StyledGrid container spacing={3}>
                <StyledGrid item xs={12}>
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
              <StyledAppBar position="fixed" color="primary">
                <Container container maxWidth="sm">
                  {renderButtons({
                    sendMessage,
                    distributeCards,
                    finishRound,
                    finishLevel,
                    bidWins,
                    currentUser,
                    hasEveryoneThrownCard,
                  })}
                </Container>
              </StyledAppBar>
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
      {currentUser.hasLevelStarted && (
        <StyledGrid item xs={2}>
          <StyledGrid item xs={12}>
            <StyledImg
              src={cardColours[currentUser.lastTrumpColour]}
              alt={currentUser.lastTrumpColour}
            />
          </StyledGrid>
          <StyledGrid item xs={12}>
            <Typography variant="caption" display="block" gutterBottom>
              Trump
            </Typography>
          </StyledGrid>
        </StyledGrid>
      )}
      {/* <Button variant="contained" color="primary" onClick={sendMessage}>
        Send message
      </Button> */}
      {!currentUser.hasLevelStarted && (
        <StyledGrid item xs={10} key="dc">
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
          <StyledGrid item xs={10} key="bw">
            <BidWin bidWins={bidWins} />
          </StyledGrid>
        )}
      {hasEveryoneThrownCard && (
        <StyledGrid item xs={10} key="fr">
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
        <StyledGrid item xs={10} key="fll">
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
  users.sort((a, b) => (a.sequenceNumber > b.sequenceNumber ? 1 : -1));
  const cards = users.map(
    ({ cardThrown, playerName, sequenceNumber }) =>
      cardThrown || {
        number: `Waiting card from ${playerName}: Sq ${sequenceNumber}`,
      }
  );
  // const { cards } = sortedUsers.reduce(
  //   (acc, { cardThrown, playerName, sequenceNumber }) => {
  //     const { hasFoundBlankSpace } = acc;
  //     if (!hasFoundBlankSpace) {
  //       if (!cardThrown) {
  //         return {
  //           hasFoundBlankSpace: true,
  //           cards: [
  //             ...acc.cards,
  //             { number: `Waiting card from ${playerName}` },
  //           ],
  //         };
  //       }
  //       return {
  //         ...acc,
  //         cards: [...acc.cards, cardThrown],
  //       };
  //     }
  //     return acc;
  //   },
  //   {
  //     cards: [],
  //     hasFoundBlankSpace: false,
  //   }
  // );
  return <CardsList cards={cards} title="Play Table" />;
}

export default GameTemplate;
