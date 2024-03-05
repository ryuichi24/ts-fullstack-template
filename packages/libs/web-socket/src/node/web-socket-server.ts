import http from "http";
import { WebSocketServer as WSServer, WebSocket } from "ws";
import { EventHandler, EventName, EventPayload, MessageData } from "../contract";

type WSOptions = { server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>; path: "/ws" };

export class WebSocketServer extends WSServer {
  constructor(options: WSOptions) {
    super(options);
  }

  public onConnected(handler: (sock: ServerWebSocketClient) => void) {
    this.on("connection", (sock) => {
      handler(new ServerWebSocketClient(sock));
    });
  }
}

class ServerWebSocketClient {
  private _wsSock: WebSocket;

  private readonly _listeners = new Map<EventName, EventHandler[]>();

  constructor(wsSock: WebSocket) {
    this._wsSock = wsSock;

    this._wsSock.addEventListener("message", (evt) => {
      if (Buffer.isBuffer(evt.data) || evt.data instanceof ArrayBuffer || Array.isArray(evt.data)) {
        // NOTE: propagate the buffer data parsing to a different method
        return;
      }

      const msgData = JSON.parse(evt.data) as MessageData;

      const handlers = this._listeners.get(msgData.eventName);
      if (!handlers) {
        throw new Error(`No listeners are registered for the event of ${msgData.eventName}`);
      }

      handlers.forEach((handler) => {
        handler(msgData.payload);
      });
    });
  }

  public on(eventName: EventName, handler: EventHandler) {
    const targetListener = this._listeners.get(eventName);
    if (!targetListener) {
      this._listeners.set(eventName, [handler]);
      return;
    }

    targetListener.push(handler);
  }

  public emit(eventName: EventName, eventPayload?: EventPayload) {
    const event = { eventName, payload: eventPayload } as MessageData;
    this._wsSock.send(JSON.stringify(event));
  }
}
