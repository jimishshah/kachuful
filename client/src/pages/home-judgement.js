import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useHistory, useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import socket from "../socket";
import styled from "@emotion/styled";
import ProgressSteps from "../organisms/progress-steps";
import GameRules from "../organisms/game-rules";
import Box from "@material-ui/core/Box";
import ReactGA from "react-ga";
import useButton from "../hooks/use-button";

const StyledTextField = styled(TextField)`
  width: 100%;
`;
const StyledButton = styled(Button)`
  width: 100%;
`;
function HomeJudgement({ setConnectionId, connectionId }) {
  const history = useHistory();
  const [playerName, setPlayerName] = useState("");
  const { tableId } = useParams();
  const joinTheTable = async (e) => {
    e.preventDefault();
    const ws = await socket.getInstance(true);
    ws.send(
      JSON.stringify({
        message: "",
        action: "getConnectionId",
      })
    );
    ReactGA.event({
      category: "Button",
      action: "Create / Join Game",
    });
    ws.onmessage = async function (event) {
      const { connectionID } = JSON.parse(event.data);
      setConnectionId(connectionID);
      localStorage.setItem("connectionID", connectionID);
      if (Boolean(playerName)) {
        ws.send(
          JSON.stringify({
            message: { playerName: playerName.slice(0, 6), tableId },
            action: "sendName",
          })
        );
        history.push("/judgement/game");
      }
    };
  };

  const resumeGame = async () => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        action: "reCreateConnection",
        message: { oldConnectionId: connectionId, shouldRefresh: true },
      })
    );
    ReactGA.event({
      category: "Button",
      action: "Resume Game",
    });
    history.push("/judgement/game");
  };

  const endOldGame = async () => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        action: "endGame",
        message: { connectionID: connectionId },
      })
    );
    ws.send(
      JSON.stringify({
        action: "endGame",
        message: { connectionID: "thisConnection" },
      })
    );
    localStorage.removeItem("connectionID");
    ws.close();
    setConnectionId(null);
    ReactGA.event({
      category: "Button",
      action: "End old Game",
    });
    const redirectUrl = tableId ? `/judgement/${tableId}` : "/judgement";
    history.push(redirectUrl);
  };

  const joinTableButton = useButton(joinTheTable);
  const endOldGameButton = useButton(endOldGame);
  const resumeGameButton = useButton(resumeGame);

  return (
    <>
      {!connectionId ? (
        <>
          <ProgressSteps activeStep={0} isCreate={tableId ? false : true} />
          <form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  variant="outlined"
                  label="Enter your name"
                  size="small"
                  inputProps={{
                    maxLength: 6,
                  }}
                  helperText="* Maximum 6 characters"
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  variant="contained"
                  color="secondary"
                  type="submit"
                  {...joinTableButton}
                >
                  {tableId ? "Join Game" : "Create Game"}
                </StyledButton>
              </Grid>
            </Grid>
          </form>
          <Box pt={4} mb={1}>
            <GameRules />
          </Box>
        </>
      ) : (
        <>
          <Box pt={4} mb={1}>
            <h4>
              You did not end your previous game, What do you want to do ?
            </h4>
            <Box mb={1}>
              <StyledButton
                variant="contained"
                color="secondary"
                {...resumeGameButton}
              >
                Resume Game
              </StyledButton>
            </Box>
            <Box mb={1}>
              <StyledButton
                variant="contained"
                color="primary"
                {...endOldGameButton}
              >
                End game
              </StyledButton>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
export default HomeJudgement;
