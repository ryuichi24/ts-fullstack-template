import { ProcessEventEmitter } from "@ts-fullstack-template/process-event-emitter";
import { WebSocketServer } from "@ts-fullstack-template/web-socket/server";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ELECTRON_USER_DATA_PATH?: string;
      NODE_ENV: "production" | "development" | "debug";
    }
  }
  var webSocket: WebSocketServer | null;
  var pEvtEmitter: ProcessEventEmitter | null;
}
