import { useEffect, useRef } from "react";
import { Layout } from "@/components";

export const App = () => {
  const socketRef = useRef<WebSocket>();

  useEffect(() => {
    socketRef.current = new WebSocket(
      `ws://localhost:${window.EXPOSED?.webSocketPort ?? import.meta.env.TS_WEBSOCKET_PORT ?? 7777}/ws`,
    );

    return () => {
      if (!socketRef.current) return;
      socketRef.current.close();
    };
  }, []);
  return (
    <div>
      <Layout>App</Layout>
    </div>
  );
};
