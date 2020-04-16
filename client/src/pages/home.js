import React from "react";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import socket from "../socket";
function Home() {
  const history = useHistory();
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
    await socket.getInstance();
    history.push("/game");
  };
  return (
    <>
      <Button variant="contained" color="primary" onClick={joinTheTable}>
        Join the Table
      </Button>
    </>
  );
}
export default Home;
