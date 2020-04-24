import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useHistory, useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import socket from "../socket";
import styled from "@emotion/styled";

const StyledTextField = styled(TextField)`
  width: 100%;
`;
const StyledButton = styled(Button)`
  width: 100%;
`;
function HomeJudgement({ assignConnectionId, connectionId }) {
  const history = useHistory();
  const [playerName, setPlayerName] = useState("");
  const { tableId } = useParams();
  const joinTheTable = async (e) => {
    e.preventDefault();
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

  useEffect(() => {
    if (!connectionId) {
      socket.getInstance().then((ws) => {
        ws.send(
          JSON.stringify({
            message: "",
            action: "getConnectionId",
          })
        );
        ws.onmessage = function (event) {
          const { connectionID } = JSON.parse(event.data);
          assignConnectionId(connectionID);
        };
      });
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {connectionId ? (
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
      ) : (
        "Loading..."
      )}
    </>
  );
}
export default HomeJudgement;
