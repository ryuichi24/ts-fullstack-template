import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import { ProcessEventEmitter } from "@ts-fullstack-template/process-event-emitter";

global.webSocket = null;
global.pEvtEmitter = null;

const isChildProcess = !!process.env.FORK;

if (isChildProcess) {
  global.pEvtEmitter = new ProcessEventEmitter();

  global.pEvtEmitter.on("msg-init-server", (payload) => {
    initWebSocketServer(payload.port, {
      onStarted() {
        console.log("Web Socket started as a child process");
        global.pEvtEmitter?.emit("msg-ws-ready");
      },
      onConnected(stream) {
        console.log("Web Socket connected as a child process");
        global.pEvtEmitter?.emit("msg-ws-connected");
      },
    });
  });
}

if (!isChildProcess) {
  const PORT = process.env.PORT ?? 8888;
  initWebSocketServer(PORT, {
    onStarted() {
      console.log("Web Socket started as a main process");
    },
    onConnected(stream) {
      console.log("Web Socket connected as a main process");
    },
  });
}

function initWebSocketServer(
  port: string | number,
  handlers: { onStarted?: () => void; onConnected?: (stream: WebSocket) => void },
) {
  const server = http.createServer();
  server.listen(port);

  global.webSocket = new WebSocketServer({ server, path: "/ws" });

  global.webSocket.on("listening", () => {
    handlers.onStarted?.();
  });

  global.webSocket.on("connection", (stm) => {
    handlers.onConnected?.(stm);
  });
}
