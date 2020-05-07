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

const StyledTextField = styled(TextField)`
  width: 100%;
`;
const StyledButton = styled(Button)`
  width: 100%;
`;
function HomeJudgement({ setConnectionId }) {
  const history = useHistory();
  const [playerName, setPlayerName] = useState("");
  const { tableId } = useParams();
  const joinTheTable = async (e) => {
    e.preventDefault();
    socket.getInstance().then((ws) => {
      ws.send(
        JSON.stringify({
          message: "",
          action: "getConnectionId",
        })
      );
      ws.onmessage = async function (event) {
        const { connectionID } = JSON.parse(event.data);
        setConnectionId(connectionID);
        if (Boolean(playerName)) {
          const ws = await socket.getInstance();
          ws.send(
            JSON.stringify({
              message: { playerName: playerName.slice(0, 6), tableId },
              action: "sendName",
            })
          );
          history.push("/judgement/game");
        }
      };
    });
  };

  return (
    <>
      <ProgressSteps activeStep={0} isCreate={tableId ? false : true} />
      <form onSubmit={joinTheTable}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledTextField
              variant="outlined"
              label="Enter your name"
              size="small"
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledButton variant="contained" color="secondary" type="submit">
              {tableId ? "Join Game" : "Create Game"}
            </StyledButton>
          </Grid>
        </Grid>
      </form>
      <Box pt={4} mb={1}>
        <GameRules />
      </Box>
    </>
  );
}
export default HomeJudgement;
