import { useState } from "react";

import AsyncStorage from "@react-native-community/async-storage";
import { useHistory, useParams } from "react-router-dom";
import ReactGA from "react-ga";
import { useButton } from "@kachuful/common";
import { socket } from "@kachuful/common";

function useHomeJudgment({ connectionId, setConnectionId }) {
  const history = useHistory();
  const [playerName, setPlayerName] = useState("");
  const { tableId } = useParams();
  const joinTheTable = async (e) => {
    e && e.preventDefault();
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
      await AsyncStorage.setItem("connectionID", connectionID);
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
    await AsyncStorage.removeItem("connectionID");
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

  return {
    tableId,
    setPlayerName,
    joinTableButton,
    resumeGameButton,
    endOldGameButton,
  };
}
export default useHomeJudgment;
