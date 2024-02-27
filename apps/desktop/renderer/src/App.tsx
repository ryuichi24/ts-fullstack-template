import { useEffect, useRef } from "react";
import { Layout } from "@/components";

export const App = () => {
  const socketRef = useRef<WebSocket>();

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://localhost:${window.EXPOSED.webSocketPort}/ws`);

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
