import http from "http";
import net from "net";
import path from "path";
import { ProcessEventEmitter } from "@ts-fullstack-template/process-event-emitter";
import { WebSocketServer } from "@ts-fullstack-template/web-socket/server";
import Database from "better-sqlite3";

global.webSocket = null;
global.pEvtEmitter = null;

/**
 * If 0 is passed as a port to listen to, OS automatically sets a free port.
 */
const RANDOM_PORT = 0;

const isChildProcess = !!process.env.FORK;

async function main() {
  if (isChildProcess) {
    global.pEvtEmitter = new ProcessEventEmitter();

    await initWebSocketServer(RANDOM_PORT, {
      onStarted(port) {
        console.log("Web Socket started as a child process");
        global.pEvtEmitter?.emit("msg:ws-ready", { port });
      },
      onError(error) {
        console.log("Web Socket failed to start as a child process");
        global.pEvtEmitter?.emit("msg:ws-failed", { error });
      },
    });
  }

  if (!isChildProcess) {
    const PORT = process.env.TS_WEBSOCKET_PORT ?? 7777;
    await initWebSocketServer(PORT, {
      onStarted() {
        console.log("Web Socket started as a non-child process");
      },
    });
  }

  global?.webSocket?.onConnected((sock) => {
    if (isChildProcess) {
      // reset old event handlers
      global.pEvtEmitter?.offAll();

      console.log("Web Socket connected as a child process");
      global.pEvtEmitter?.emit("msg:ws-connected");
      new Database(path.join(process.env.ELECTRON_USER_DATA_PATH ?? "", "app.db"));

      // propagate event from main process
      global.pEvtEmitter?.on("msg:quitting-requested", () => {
        sock.emit("msg:quitting-requested");
      });
    }
    if (!isChildProcess) {
      console.log("Web Socket connected as a non-child process");
    }

    // process message
    sock.on("msg:greeting-from-client", (payload) => {
      console.log("got a message from client ", { payload });

      sock.emit("msg:hello-from-server", {
        server: "ws",
      });
    });
  });
}

main();

async function initWebSocketServer(
  port: string | number,
  handlers: {
    onStarted?: (port: number) => void;
    onError?: (error: NodeJS.ErrnoException) => void;
  },
) {
  return new Promise<void>((res, rej) => {
    initHttpServer(port, {
      onStarted({ srv, port }) {
        global.webSocket = new WebSocketServer({ server: srv, path: "/ws" });
        global.webSocket.on("error", (error: NodeJS.ErrnoException) => {
          handlers.onError?.(error);
        });

        handlers.onStarted?.(port);
        res();
      },
      onError(error) {
        rej(error);
      },
    });
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
