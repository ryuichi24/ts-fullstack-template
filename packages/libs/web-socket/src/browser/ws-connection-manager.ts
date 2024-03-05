import { WebSocketClient } from "./web-socket-client";

type Options = {
  url: string;
};

export class WsConnectionManager {
  private static _wsConnectionMap: Map<string, WebSocketClient> = new Map();

  public static makeGlobalCon(options: Options) {
    const existingCon = this._wsConnectionMap.get(options.url);
    if (!existingCon) {
      const newGlobalCon = new WebSocketClient({ url: options.url });
      this._wsConnectionMap.set(options.url, newGlobalCon);
      return newGlobalCon;
    }
    return existingCon;
  }

  public static makeCon(options: Options) {
    return new WebSocketClient({ url: options.url });
  }

  public static closeAll() {
    this._wsConnectionMap.forEach((wsCon, url, wsConMap) => {
      wsCon.close();
      wsConMap.delete(url);
    });
  }

  public static isConnected(url: string) {
    return this._wsConnectionMap.get(url)?.isConnected;
  }

  public static isConnecting(url: string) {
    return this._wsConnectionMap.get(url)?.isConnecting;
  }

  public static isClosing(url: string) {
    return this._wsConnectionMap.get(url)?.isClosing;
  }

  public static isClosedConnected(url: string) {
    return this._wsConnectionMap.get(url)?.isClosed;
  }
}
