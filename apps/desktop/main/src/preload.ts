import { contextBridge } from "electron";
import { type EXPOSED } from "@ts-fullstack-template/contract";

const exposed: EXPOSED = { webSocketPort: parseInt(process.argv.slice(-1)[0]) };

contextBridge.exposeInMainWorld("EXPOSED", exposed);
