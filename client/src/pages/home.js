import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useHistory, useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

import socket from "../socket";
function Home({ assignConnectionId, connectionId }) {
  const history = useHistory();
  const [playerName, setPlayerName] = useState("");
  const { tableId } = useParams();
  const joinTheTable = async () => {
    if (Boolean(playerName)) {
      const ws = await socket.getInstance();
      ws.send(
        JSON.stringify({
          message: { playerName, tableId },
          action: "sendName",
        })
      );
      history.push("/game");
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
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="Enter your name"
                size="small"
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" color="secondary" type="submit">
                {tableId ? "Join Game" : "Create Game"}
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        "Loading..."
      )}
    </>
  );
}
export default Home;
