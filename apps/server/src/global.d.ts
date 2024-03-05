import { ProcessEventEmitter } from "@ts-fullstack-template/process-event-emitter";
import { WebSocketServer } from "@ts-fullstack-template/web-socket/server";

declare global {
  var webSocket: WebSocketServer | null;
  var pEvtEmitter: ProcessEventEmitter | null;
}
