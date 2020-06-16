import { useEffect, useState, useRef, useCallback } from "react";
export default function useSocket({
  socket,
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
      }),
    [reCreateConnectionHandler, socket]
  );
  const returnValue = {
    send: (message, shouldExpectResponse = true) => {
      if (shouldExpectResponse) {
        hasGotMessageAfterSend.current = setTimeout(() => {
          createNewConnection();
          offlineHandler("Network unstable, Try again in 5 secs");
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
  }, [noSocketHandler, onMessageHandler, createNewConnection, socket]);
  return returnValue;
}
