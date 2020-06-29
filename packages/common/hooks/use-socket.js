import { useEffect, useState, useRef, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

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

  const createNewConnection = useCallback(() => {
    webSocket.close();
    socket.getInstance(true).then((ws) => {
      setWebSocket(ws);
      reCreateConnectionHandler(ws);
      offlineHandler("Connected", "success");
    });
  }, [reCreateConnectionHandler, socket, offlineHandler, webSocket]);

  const [debouncedCreateNewConnection] = useDebouncedCallback(
    createNewConnection,
    // delay in ms
    1000
  );
  const returnValue = {
    send: (message, shouldExpectResponse = true) => {
      if (shouldExpectResponse) {
        hasGotMessageAfterSend.current = setTimeout(async () => {
          await debouncedCreateNewConnection();
        }, 1500);
      }
      return webSocket.send(message);
    },
    close: () => webSocket.close(),
    createNewConnection,
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
        console.log("closing");
        if (!event.wasClean) {
          debouncedCreateNewConnection();
        }
      };
      setWebSocket(ws);
    });
  }, [noSocketHandler, onMessageHandler, debouncedCreateNewConnection, socket]);

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
          await debouncedCreateNewConnection();
        }
      } catch {
        isOffline.current = true;
        offlineHandler("Reconnecting....");
      }
    }, 1000);

    return () => clearInterval(checkConnection.current);
  }, [debouncedCreateNewConnection, isOffline, offlineHandler]);
  return returnValue;
}
