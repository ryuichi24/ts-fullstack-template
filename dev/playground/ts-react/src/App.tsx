import { Layout } from "@/components";
import { useState } from "react";
import { useWebSocket } from "@ts-fullstack-template/use-web-socket";

export const App = () => {
  useWebSocket("wsCon");
  const [setState, state] = useState();
  return (
    <div>
      <Layout>App 3</Layout>
    </div>
  );
};
