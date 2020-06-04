import { useEffect, useState } from "react";
import socket from "../socket";
export default function useSocket({
  onMessageHandler,
  reCreateConnectionHandler = () => {},
  noSocketHandler = () => {},
  offlineHandler,
  onlineHandler,
}) {
  const [webSocket, setWebSocket] = useState();

  useEffect(() => {
    if (!socket.hasInstance()) {
      return noSocketHandler();
    }
    socket.getInstance().then((ws) => {
      ws.onmessage = (event) => {
        onMessageHandler(event, ws);
      };

      ws.onclose = (event) => {
        if (!event.wasClean) {
          offlineHandler();
          socket.getInstance(true).then((ws) => {
            setWebSocket(ws);
            reCreateConnectionHandler(ws);
            onlineHandler();
          });
        }
      };
      setWebSocket(ws);
    });
  }, [
    noSocketHandler,
    offlineHandler,
    reCreateConnectionHandler,
    onlineHandler,
    onMessageHandler,
  ]);
  return webSocket;
}
