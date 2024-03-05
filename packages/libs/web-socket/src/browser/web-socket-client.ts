import { EventHandler, EventName, EventPayload, MessageData } from "../contract";

type WSOptions = {
  url: string;
};

export class WebSocketClient {
  private readonly _options: WSOptions;

  private _wsConnection: WebSocket | null = null;

  private readonly _listeners = new Map<EventName, EventHandler[]>();

  constructor(options: WSOptions) {
    this._options = options;
  }

  public connect() {
    const ws = new WebSocket(this._options.url);

    ws.addEventListener("message", (evt: MessageEvent<string>) => {
      const msgData = JSON.parse(evt.data) as MessageData;
      const handlers = this._listeners.get(msgData.eventName);
      if (!handlers) {
        throw new Error(`No listeners are registered for the event of ${msgData.eventName}`);
      }

      handlers.forEach((handler) => {
        handler(msgData.payload);
      });
    });

    ws.addEventListener("open", () => {
      console.log(`successfully connected to ${this._options.url}`);
      const handlers = this._listeners.get("open");
      if (!handlers) return;
      handlers.forEach((handler) => {
        handler();
      });
    });

    ws.addEventListener("close", () => {
      console.log(`successfully disconnected from ${this._options.url}`);
      const handlers = this._listeners.get("close");
      if (!handlers) return;
      handlers.forEach((handler) => {
        handler();
      });
    });

    this._wsConnection = ws;
  }

  public onConnected(listener: () => any) {}

  public onStateChange(listener: () => any) {
    this._wsConnection?.addEventListener("message", listener);
    this._wsConnection?.addEventListener("open", listener);
    this._wsConnection?.addEventListener("error", listener);
    this._wsConnection?.addEventListener("close", listener);
  }

  public get state() {
    return {
      isConnecting: this.isConnecting,
      isConnected: this.isConnected,
      isClosing: this.isClosing,
      isClosed: this.isClosed,
    };
  }

  public on(eventName: EventName, handler: EventHandler) {
    const targetListener = this._listeners.get(eventName);
    if (!targetListener) {
      this._listeners.set(eventName, [handler]);
      return;
    }

    targetListener.push(handler);
  }

  public emit(eventName: EventName, payload?: EventPayload) {
    this._wsConnection?.send(JSON.stringify({ eventName, payload }));
  }

  public close() {
    this._wsConnection?.close();
  }

  public get isConnected() {
    return this._wsConnection?.readyState === WebSocket.OPEN;
  }

  public get isConnecting() {
    return this._wsConnection?.readyState === WebSocket.CONNECTING;
  }

  public get isClosing() {
    return this._wsConnection?.readyState === WebSocket.CLOSING;
  }

  public get isClosed() {
    return this._wsConnection?.readyState === WebSocket.CLOSED;
  }
}
