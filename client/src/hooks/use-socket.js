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
  const [isOnline, setIsOnline] = useState(true);
  const [wasSocketCloseClean, setWasSocketCloseClean] = useState(true);

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
          setWasSocketCloseClean(false);
        }
      };
      setWebSocket(ws);
    });
  });

  useEffect(() => {
    const hasGoneOnline = () => {
      if (!isOnline && !wasSocketCloseClean) {
        socket.getInstance(true).then((ws) => {
          setWebSocket(ws);
          setIsOnline(true);
          setWasSocketCloseClean(true);
          reCreateConnectionHandler(ws);
          onlineHandler();
        });
      } else {
        onlineHandler();
      }
    };

    const hasGoneOffline = () => {
      offlineHandler();
      setIsOnline(false);
    };
    if (webSocket) {
      window.addEventListener("offline", hasGoneOffline);
      window.addEventListener("online", hasGoneOnline);
    }

    return () => {
      window.removeEventListener("offline", hasGoneOffline);
      window.removeEventListener("online", hasGoneOnline);
    };
  }, [
    webSocket,
    isOnline,
    reCreateConnectionHandler,
    wasSocketCloseClean,
    onlineHandler,
    offlineHandler,
  ]);
  return webSocket;
}
