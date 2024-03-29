import { WsConnectionManager } from "@ts-fullstack-template/web-socket/client";
import { EventHandler, EventName } from "@ts-fullstack-template/web-socket/contract";
import { useEffect, useState } from "react";

export function useWebSocket(id: string) {
  const [isConnected, toggleIsConnected] = useState(false);
  const con = WsConnectionManager.getCon(id);

  const emit = (eventName: EventName, payload?: any) => con?.emit(eventName, payload);

  useEffect(() => {
    if (con.isConnected) {
      toggleIsConnected(true);
    }

    con.on("open", () => {
      toggleIsConnected(true);
    });

    con.on("close", () => {
      toggleIsConnected(false);
    });
  }, []);

  const on = (eventName: EventName, handler: EventHandler) => {
    con?.on(eventName, handler);
  };

  return { emit, on, isConnected };
}
