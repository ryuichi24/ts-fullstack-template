import { WebSocketServer } from "ws";
import { ProcessEventEmitter } from "@ts-fullstack-template/process-event-emitter";

declare global {
  var webSocket: WebSocketServer | null;
  var pEvtEmitter: ProcessEventEmitter | null;
}
