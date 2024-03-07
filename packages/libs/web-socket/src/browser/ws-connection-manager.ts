import { WebSocketClient } from "./web-socket-client";

export type WSClientOptions = {
  id?: string;
  url: string;
};

export class WsConnectionManager {
  private static _wsConnectionMap: Map<string, WebSocketClient> = new Map();

  public static makeCon(options: WSClientOptions) {
    const wsId = options.id ?? options.url;
    if (!this._wsConnectionMap.has(wsId)) {
      const newGlobalCon = new WebSocketClient({ url: options.url });
      newGlobalCon.connect();
      this._wsConnectionMap.set(wsId, newGlobalCon);
    }
  }

  public static getCon(id: string) {
    const con = this._wsConnectionMap.get(id);
    if (!con) {
      throw new Error(`no web socket connection is found with the ID: ${id}`);
    }
    return con;
  }

  public static closeAll() {
    this._wsConnectionMap.forEach((wsCon, url, wsConMap) => {
      wsCon.close();
      wsConMap.delete(url);
    });
  }
}
