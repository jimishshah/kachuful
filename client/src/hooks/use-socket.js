import { useEffect, useState, useRef, useCallback } from "react";
import socket from "../socket";
export default function useSocket({
  onMessageHandler,
  reCreateConnectionHandler = () => {},
  noSocketHandler = () => {},
  offlineHandler,
}) {
  const [webSocket, setWebSocket] = useState();
  const hasGotMessageAfterSend = useRef();
  const createNewConnection = useCallback(
    () =>
      socket.getInstance(true).then((ws) => {
        setWebSocket(ws);
        reCreateConnectionHandler(ws);
        offlineHandler("Your network is unstable, try again");
      }),
    [reCreateConnectionHandler, offlineHandler]
  );
  const returnValue = {
    send: (message, shouldExpectResponse = true) => {
      if (shouldExpectResponse) {
        hasGotMessageAfterSend.current = setTimeout(() => {
          createNewConnection();
        }, 1500);
      }
      return webSocket.send(message);
    },
    close: () => webSocket.close(),
  };
  useEffect(() => {
    if (!socket.hasInstance()) {
      return noSocketHandler();
    }
    socket.getInstance().then((ws) => {
      ws.onmessage = (event) => {
        clearTimeout(hasGotMessageAfterSend.current);
        onMessageHandler(event, ws);
      };

      ws.onclose = (event) => {
        if (!event.wasClean) {
          createNewConnection();
        }
      };
      setWebSocket(ws);
    });
  }, [noSocketHandler, onMessageHandler, createNewConnection]);
  return returnValue;
}
