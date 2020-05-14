import React from "react";
import styled from "@emotion/styled";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import UsersList from "../organisms/users-list";
import ScoreCard from "../organisms/score-card";
import { linkBase } from "../constants";
import CardsList from "../organisms/cards-list";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import CopyToClipboard from "react-copy-to-clipboard";
import ProgressSteps from "../organisms/progress-steps";
import GameRules from "../organisms/game-rules";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import ActionBar from "../organisms/action-bar";
import MenuDrawer from "../organisms/menu-drawer";
import ReactGA from "react-ga";

const StyledGrid = styled(Grid)`
  flex-grow: 0;
  text-align: center;
`;

const StyledButton = styled(Button)`
  width: 100%;
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
  startGame,
  showAlert,
  scores,
  clearShowAlert,
  hostPlayer,
  openDialog,
  openDialogHandler,
  closeDialogHandler,
  refreshHandler,
  drawer,
  toggleDrawer,
}) {
  const linkToShare = `${linkBase}/judgement/${currentUser.tableId}?utm_source=app&utm_medium=whatsapp&utm_campaign=invite`;
  const actionBarProps = {
    bidWins,
    currentUser,
    openDialogHandler,
    refreshHandler,
    toggleDrawer,
  };

  const menuDrawerProps = {
    drawer,
    toggleDrawer,
    leaveTheTable,
    openDialogHandler,
  };

  const { hasGameStarted } = currentUser;
  return (
    <>
      {!hasGameStarted && currentUser.playerName && (
        <ProgressSteps activeStep={1} isCreate={currentUser.isHost} />
      )}
      {currentUser.playerName ? (
        <>
          <StyledGrid container spacing={3}>
            <StyledGrid item xs={3}>
              <StyledGrid container spacing={3}>
                <UsersList users={users} />
              </StyledGrid>
            </StyledGrid>
            {hasGameStarted && (
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
            {!hasGameStarted && (
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
                  <Box bgcolor="grey.300" p={1} mb={1}>
                    {linkToShare}
                  </Box>
                  <CopyToClipboard text={linkToShare}>
                    <StyledButton
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        ReactGA.event({
                          category: "Button",
                          action: "Copy Link",
                        });
                      }}
                    >
                      Copy Link
                    </StyledButton>
                  </CopyToClipboard>
                  {currentUser.tableId && (
                    <Box p={1} mb={1}>
                      <Typography variant="subtitle2" gutterBottom>
                        Send on:{" "}
                      </Typography>
                      <WhatsappShareButton
                        title="Join our game"
                        url={linkToShare}
                      >
                        <WhatsappIcon
                          size={45}
                          round={true}
                          onClick={() => {
                            ReactGA.event({
                              category: "Button",
                              action: "Whatsapp share",
                            });
                          }}
                        />
                      </WhatsappShareButton>
                    </Box>
                  )}
                </StyledGrid>
              </>
            )}
          </StyledGrid>
          {hasGameStarted && (
            <>
              <StyledGrid container spacing={3}>
                <StyledGrid item xs={12}>
                  <ScoreCard scores={scores} />
                </StyledGrid>
              </StyledGrid>

              <ActionBar {...actionBarProps} />
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
              <MenuDrawer {...menuDrawerProps} />
            </>
          )}
        </>
      ) : (
        "Loading....."
      )}
    </>
  );
}

function renderCardsThrownInCurrentRound(users) {
  users.sort((a, b) => (a.sequenceNumber > b.sequenceNumber ? 1 : -1));
  const cards = users.map(({ cardThrown, playerName, sequenceNumber }) =>
    cardThrown
      ? { ...cardThrown, badge: playerName }
      : {
          number: `${sequenceNumber}. Waiting for ${playerName}`,
        }
  );
  return <CardsList cards={cards} title="Play Table" />;
}

export default GameTemplate;
