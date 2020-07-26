import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
// import { linkBase } from "@kachuful/common";

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
  // const isOffline = useRef(false);

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
    1200
  );
  const returnValue = useMemo(
    () => ({
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
    }),
    [createNewConnection, debouncedCreateNewConnection, webSocket]
  );
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
      returnValue.send(
        JSON.stringify({
          action: "message",
          message: "ping",
        }),
        true
      );
    }, 30000);

    return () => clearInterval(checkConnection.current);
  }, [returnValue]);

  // useEffect(() => {
  //   checkConnection.current = setInterval(async () => {
  //     try {
  //       const controller = new AbortController();
  //       const signal = controller.signal;

  //       setTimeout(() => controller.abort(), 1600);
  //       await fetch(`${linkBase}/test.json`, {
  //         cache: "no-cache",
  //         method: "GET",
  //         signal,
  //         mode: "no-cors",
  //       });
  //       if (isOffline.current) {
  //         isOffline.current = false;
  //         await debouncedCreateNewConnection();
  //       }
  //     } catch {
  //       isOffline.current = true;
  //       offlineHandler("Reconnecting....");
  //     }
  //   }, 1000);

  //   return () => clearInterval(checkConnection.current);
  // }, [debouncedCreateNewConnection, isOffline, offlineHandler]);
  return returnValue;
}
