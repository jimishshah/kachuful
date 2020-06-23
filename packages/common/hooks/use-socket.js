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
  const checkConnection = useRef();
  const isOffline = useRef(false);
  const createNewConnection = useCallback(
    () =>
      socket.getInstance(true).then((ws) => {
        setWebSocket(ws);
        reCreateConnectionHandler(ws);
        offlineHandler("Network unstable, Try again in 3 secs");
      }),
    [reCreateConnectionHandler, socket, offlineHandler]
  );
  const returnValue = {
    send: (message, shouldExpectResponse = true) => {
      if (shouldExpectResponse) {
        hasGotMessageAfterSend.current = setTimeout(async () => {
          await createNewConnection();
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

  useEffect(() => {
    checkConnection.current = setInterval(async () => {
      try {
        const controller = new AbortController();
        const signal = controller.signal;

        setTimeout(() => controller.abort(), 1600);
        await fetch("/test.json", {
          cache: "no-cache",
          method: "GET",
          signal,
        });
        if (isOffline.current) {
          isOffline.current = false;
          await createNewConnection();
        }
      } catch {
        isOffline.current = true;
        offlineHandler("Reconnecting....");
      }
    }, 1000);

    return () => clearInterval(checkConnection.current);
  }, [createNewConnection, isOffline, offlineHandler]);
  return returnValue;
}
