import { useEffect } from "react";
import { Layout } from "@/components";
import { useWebSocket } from "@ts-fullstack-template/use-web-socket";

export const App = () => {
  const wsSocket = useWebSocket(`wsCon`);

  useEffect(() => {
    if (!wsSocket.isConnected) return;
    wsSocket.emit("msg:greeting-from-client", { userName: "React-user" });
    wsSocket.on("msg:hello-from-server", (payload) => {
      console.log("got a msg from server", { payload });
    });
  }, [wsSocket.isConnected]);
  return (
    <Layout>
      <section>
        <h1>TS Full Stack Template</h1>
      </section>
    </Layout>
  );
};
