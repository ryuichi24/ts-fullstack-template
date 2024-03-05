import { useEffect, useRef, useState } from "react";
import { WebSocketClient, WsConnectionManager } from "@ts-fullstack-template/web-socket/client";

type Options = {
  isGlobal: boolean;
};

export function useWsConnection(url: string, options: Options) {
  const socketRef = useRef<WebSocketClient>();
  const [isConnected, toggleIsConnected] = useState(false);

  const closeAll = () => WsConnectionManager.closeAll();

  useEffect(() => {
    socketRef.current = options.isGlobal
      ? WsConnectionManager.makeGlobalCon({ url })
      : WsConnectionManager.makeCon({ url });

    if (WsConnectionManager.isConnected(url)) {
      return;
    }

    socketRef.current.connect();

    socketRef.current.on("open", () => {
      toggleIsConnected(true);
    });

    socketRef.current.on("close", () => {
      toggleIsConnected(false);
    });

    return () => {
      if (!options.isGlobal) return;
      socketRef.current?.close();
    };
  }, []);

  return { closeAll, wsClient: socketRef.current, isConnected };
}
