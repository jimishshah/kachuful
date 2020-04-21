import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

import socket from "../socket";
function Home({ assignConnectionId, connectionId }) {
  const history = useHistory();
  const [playerName, setPlayerName] = useState("");
  const joinTheTable = async () => {
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        message: { playerName },
        action: "sendName",
      })
    );
    history.push("/game");
  };

  useEffect(() => {
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
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {connectionId ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                id="standard-basic"
                variant="outlined"
                label="Enter your name"
                size="small"
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={joinTheTable}
              >
                Join the Table
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        "Loading..."
      )}
    </>
  );
}
export default Home;
