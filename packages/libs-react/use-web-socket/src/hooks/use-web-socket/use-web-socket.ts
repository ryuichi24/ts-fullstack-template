import { useCallback, useSyncExternalStore } from "react";
import { useWsConnection } from "../use-ws-connection";
import { EventHandler, EventName } from "@ts-fullstack-template/web-socket/contract";

type Options = {
  isGlobal: boolean;
};

export function useWebSocket(url: string, options: Options = { isGlobal: false }) {
  const { wsClient, closeAll, isConnected } = useWsConnection(url, options);

  const emit = (eventName: EventName, payload?: any) => wsClient?.emit(eventName, payload);

  const on = (eventName: EventName, handler: EventHandler) => {
    wsClient?.on(eventName, handler);
  };

  return { emit, on, closeAll, isConnected };
}
