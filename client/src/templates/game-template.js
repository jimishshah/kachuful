import React from "react";
import styled from "@emotion/styled";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import BidWin from "../organisms/bid-win";
import UsersList from "../organisms/users-list";
import ScoreCard from "../organisms/score-card";
import { DEFAULT_WINS, cardColours, linkBase } from "../constants";
import CardsList from "../organisms/cards-list";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import CopyToClipboard from "react-copy-to-clipboard";
import ProgressSteps from "../organisms/progress-steps";
import GameRules from "../organisms/game-rules";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";

const StyledAppBar = styled(AppBar)`
  top: auto;
  bottom: 0;
  /* background-color: #d9d7d6; */
`;

const StyledGrid = styled(Grid)`
  flex-grow: 0;
  text-align: center;
`;

const BoxContainer = styled(Box)`
  padding: 8px 0;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledImg = styled.img`
  width: 35px;
  display: block;
  margin: 0 auto;
  background-color: white;
  padding: 5px;
`;

const StyledSnackbar = styled(Snackbar)`
  bottom: 90px;
`;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function GameTemplate({
  currentUser,
  users,
  leaveTheTable,
  sendMessage,
  bidWins,
  throwCard,
  isGameStarted,
  startGame,
  showAlert,
  scores,
  clearShowAlert,
  hostPlayer,
  openDialog,
  openDialogHandler,
  closeDialogHandler,
}) {
  return (
    <>
      {!isGameStarted && (
        <ProgressSteps activeStep={1} isCreate={currentUser.isHost} />
      )}
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
                        title="My Cards"
                        clickHandler={throwCard}
                        cards={currentUser.cardsInHand}
                      />
                    )}
                  </StyledGrid>
                </StyledGrid>
              </StyledGrid>
            )}
            {!isGameStarted && (
              <>
                <StyledGrid item xs={9}>
                  {currentUser.isHost ? (
                    <StyledButton
                      variant="contained"
                      color="primary"
                      onClick={() => startGame(currentUser)}
                    >
                      Start Game
                    </StyledButton>
                  ) : (
                    <Typography variant="subtitle1" gutterBottom>
                      {Boolean(hostPlayer.playerName)
                        ? `Waiting for ${hostPlayer.playerName} to start the game`
                        : "Loading..."}
                    </Typography>
                  )}
                </StyledGrid>
                <StyledGrid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Share the link below and invite your friends to join your
                    game, players are not allowed to join once the game is
                    started. Only Host can start the game.
                  </Typography>
                  <Box
                    bgcolor="grey.300"
                    p={1}
                    mb={1}
                  >{`${linkBase}/judgement/${currentUser.tableId}`}</Box>
                  <CopyToClipboard
                    text={`${linkBase}/judgement/${currentUser.tableId}`}
                  >
                    <StyledButton variant="contained" color="secondary">
                      Copy Link
                    </StyledButton>
                  </CopyToClipboard>
                </StyledGrid>
              </>
            )}
          </StyledGrid>
          {isGameStarted && (
            <>
              <StyledGrid container spacing={3}>
                <StyledGrid item xs={12}>
                  <ScoreCard scores={scores} />
                </StyledGrid>
              </StyledGrid>
              <StyledAppBar position="fixed" color="primary">
                <Container maxWidth="sm">
                  {renderButtons({
                    sendMessage,
                    bidWins,
                    currentUser,
                    leaveTheTable,
                    openDialogHandler,
                  })}
                </Container>
              </StyledAppBar>
              <StyledSnackbar
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                open={Boolean(showAlert.message)}
                autoHideDuration={6000}
                onClose={clearShowAlert}
                message={showAlert.severity}
              >
                <Alert onClose={clearShowAlert} severity={showAlert.severity}>
                  {showAlert.message}
                </Alert>
              </StyledSnackbar>
              <Dialog
                fullScreen
                open={openDialog}
                onClose={closeDialogHandler}
                TransitionComponent={Transition}
              >
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={closeDialogHandler}
                  aria-label="close"
                >
                  <CancelIcon />
                </IconButton>
                <GameRules />
              </Dialog>
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
  bidWins,
  currentUser,
  leaveTheTable,
  openDialogHandler,
}) {
  return (
    <BoxContainer display="flex">
      {/* <Box pr={2} pt={2}>
        <PowerSettingsNewRoundedIcon
          variant="outlined"
          color="secondary"
          onClick={leaveTheTable}
        />
      </Box> */}
      <Box pr={2} pt={2}>
        <HelpOutlineIcon
          variant="outlined"
          color="secondary"
          onClick={openDialogHandler}
        />
      </Box>
      {currentUser.hasLevelStarted && (
        <Box pr={2}>
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
        </Box>
      )}
      {/* <Button variant="contained" color="primary" onClick={sendMessage}>
        Send message
      </Button> */}
      {currentUser.wins.currentWins === DEFAULT_WINS &&
        currentUser.hasLevelStarted && (
          <Box flexGrow={1}>
            <BidWin bidWins={bidWins} />
          </Box>
        )}
    </BoxContainer>
  );
}

function renderCardsThrownInCurrentRound(users) {
  users.sort((a, b) => (a.sequenceNumber > b.sequenceNumber ? 1 : -1));
  const cards = users.map(
    ({ cardThrown, playerName, sequenceNumber }) =>
      cardThrown || {
        number: `${sequenceNumber}. Waiting for ${playerName}`,
      }
  );
  return <CardsList cards={cards} title="Play Table" />;
}

export default GameTemplate;
