import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import socket from "../socket";
function Home() {
  const history = useHistory();
  const [playerName, setPlayerName] = useState("");
  const joinTheTable = async () => {
    //   socket.send(
    //     JSON.stringify({
    //       message: "my first message",
    //       action: "message",
    //     })
    //   );
    //   socket.onmessage = function (event) {
    //     history.push("/game");
    //   };
    // };
    const ws = await socket.getInstance();
    ws.send(
      JSON.stringify({
        message: { playerName },
        action: "sendName",
      })
    );
    history.push("/game");
  };
  return (
    <>
      <TextField
        id="standard-basic"
        label="Standard"
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={joinTheTable}>
        Join the Table
      </Button>
    </>
  );
}
export default Home;
