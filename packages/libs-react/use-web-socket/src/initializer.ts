import { WsConnectionManager, WSClientOptions } from "@ts-fullstack-template/web-socket/client";

export function initWS(options: WSClientOptions) {
  WsConnectionManager.makeCon({ ...options });
}
