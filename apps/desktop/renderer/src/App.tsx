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

  const openLoginPageWindow = () => {
    wsSocket.emit("ws-msg:open-login-page");
  };
  return (
    <div>
      <Layout>
        <section>App</section>
        <section>
          <div>
            <button onClick={openLoginPageWindow}>Sign In</button>
          </div>
        </section>
      </Layout>
    </div>
  );
};
