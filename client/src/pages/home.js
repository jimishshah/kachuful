import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
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
          <TextField
            id="standard-basic"
            label="Enter you name"
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={joinTheTable}>
            Join the Table
          </Button>
        </>
      ) : (
        "Loading..."
      )}
    </>
  );
}
export default Home;
