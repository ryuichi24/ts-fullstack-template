import ReactDOM from "react-dom/client";
import { App } from "./App";
import { initWS } from "@ts-fullstack-template/use-web-socket";

// init a global web socket connection
initWS({
  id: "wsCon",
  url: `ws://localhost:${7777}/ws`,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
