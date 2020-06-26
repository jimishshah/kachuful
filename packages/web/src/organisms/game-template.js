import React from "react";
import styled from "@emotion/styled";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import UsersList from "./users-list";
import ScoreCard from "./score-card";
import { linkBase } from "@kachuful/common";
import CardsList from "./cards-list";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import CopyToClipboard from "react-copy-to-clipboard";
import ProgressSteps from "./progress-steps";
import GameRules from "./game-rules";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import ActionBar from "./action-bar";
import MenuDrawer from "./menu-drawer";
import ReactGA from "react-ga";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StyledGrid = styled(Grid)`
  flex-grow: 0;
  text-align: center;
`;
const MyCardsContainer = styled(StyledGrid)(({ disabled }) => ({
  pointerEvents: disabled ? "none" : "inherit",
}));

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledSnackbar = styled(Snackbar)`
  bottom: 90px;
`;

const LinkContainer = styled(Box)`
  word-wrap: break-word;
`;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function GameTemplate({
  currentUser,
  users,
  leaveTheTable,
  bidWins,
  throwCard,
  startGameButton,
  showAlert,
  scores,
  clearShowAlert,
  hostPlayer,
  helpDialog,
  toggleHelpDialog,
  drawer,
  toggleDrawer,
  messageUs,
  shouldDisableMyCards,
  cardsThrown,
  cardsInHand,
  reCreateConnectionManuallyHandler,
}) {
  const linkToShare = `${linkBase}/judgement/${currentUser.tableId}?utm_source=app&utm_medium=whatsapp&utm_campaign=invite`;
  const actionBarProps = {
    bidWins,
    currentUser,
    toggleDrawer,
  };

  const menuDrawerProps = {
    drawer,
    toggleDrawer,
    leaveTheTable,
    toggleHelpDialog,
    messageUs,
    reCreateConnectionManuallyHandler,
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
                    <CardsList cards={cardsThrown} title="Play Table" />
                  </StyledGrid>
                  <MyCardsContainer
                    item
                    xs={12}
                    disabled={shouldDisableMyCards}
                  >
                    {cardsInHand.length > 0 && (
                      <CardsList
                        title="My Cards"
                        clickHandler={throwCard}
                        cards={cardsInHand}
                      />
                    )}
                  </MyCardsContainer>
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
                      {...startGameButton}
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
                  <LinkContainer bgcolor="grey.300" p={1} mb={1}>
                    <Typography>{linkToShare}</Typography>
                  </LinkContainer>
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

              <Dialog
                fullScreen
                open={helpDialog}
                onClose={toggleHelpDialog}
                TransitionComponent={Transition}
              >
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={toggleHelpDialog}
                  aria-label="close"
                >
                  <CancelIcon />
                </IconButton>
                <GameRules />
              </Dialog>
              <MenuDrawer {...menuDrawerProps} />
              <ActionBar {...actionBarProps} />
            </>
          )}
          <StyledSnackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            open={Boolean(showAlert.message)}
            autoHideDuration={showAlert.duration || 6000}
            onClose={(event, reason) => {
              if (reason === "clickaway") {
                return;
              }
              clearShowAlert();
            }}
            message={showAlert.severity}
          >
            <Alert onClose={clearShowAlert} severity={showAlert.severity}>
              {showAlert.message}
            </Alert>
          </StyledSnackbar>
        </>
      ) : (
        "Loading....."
      )}
    </>
  );
}

export default GameTemplate;
