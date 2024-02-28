import http from "http";
import net from "net";
import { WebSocket, WebSocketServer } from "ws";
import { ProcessEventEmitter } from "@ts-fullstack-template/process-event-emitter";

global.webSocket = null;
global.pEvtEmitter = null;

/**
 * If 0 is passed as a port to listen to, OS automatically sets a free port.
 */
const RANDOM_PORT = 0;

const isChildProcess = !!process.env.FORK;

if (isChildProcess) {
  global.pEvtEmitter = new ProcessEventEmitter();

  initWebSocketServer(RANDOM_PORT, {
    onStarted(port) {
      console.log("Web Socket started as a child process");
      global.pEvtEmitter?.emit("msg:ws-ready", { port });
    },
    onConnected() {
      console.log("Web Socket connected as a child process");
      global.pEvtEmitter?.emit("msg:ws-connected");
    },
    onError(error) {
      console.log("Web Socket failed to start as a child process");
      global.pEvtEmitter?.emit("msg:ws-failed", { error });
    },
  });
}

if (!isChildProcess) {
  const PORT = process.env.TS_WEBSOCKET_PORT ?? 7777;
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
  handlers: {
    onStarted?: (port: number) => void;
    onConnected?: (stream: WebSocket) => void;
    onError?: (error: NodeJS.ErrnoException) => void;
  },
) {
  initHttpServer(port, {
    onStarted({ srv, port }) {
      global.webSocket = new WebSocketServer({ server: srv, path: "/ws" });

      global.webSocket.on("connection", (stm) => {
        handlers.onConnected?.(stm);
      });

      global.webSocket.on("error", (error: NodeJS.ErrnoException) => {
        handlers.onError?.(error);
      });

      handlers.onStarted?.(port);
    },
    onError(error) {
      //
    },
  });
}

function initHttpServer(
  port: string | number,
  handlers: {
    onStarted?: (res: {
      srv: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
      port: number;
    }) => void;
    onError?: (error: NodeJS.ErrnoException) => void;
  },
) {
  const srv = http.createServer();
  srv.listen(port);

  srv.on("listening", () => {
    const usedPort = (srv.address() as net.AddressInfo).port;
    handlers?.onStarted?.({ srv, port: usedPort });
  });

  srv.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error("Address in use, retrying...");
      setTimeout(() => {
        srv.close();
        srv.listen(port);
      }, 1000);
      return;
    }

    handlers?.onError?.(error);
  });
}
