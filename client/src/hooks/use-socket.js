import { useEffect, useState, useRef } from "react";
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
  const timeInterval = useRef(false);

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
      } else if (!isOnline) {
        onlineHandler();
        setIsOnline(true);
      }
    };

    const hasGoneOffline = () => {
      offlineHandler();
      setIsOnline(false);
    };
    if (webSocket) {
      timeInterval.current = setInterval(async () => {
        try {
          await fetch("/test.html", { cache: "no-store" });
          hasGoneOnline();
        } catch (e) {
          hasGoneOffline();
        }
      }, 2000);
    }

    return () => {
      clearInterval(timeInterval.current);
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
