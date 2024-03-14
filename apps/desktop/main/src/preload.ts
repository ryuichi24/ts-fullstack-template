// https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/2974#issuecomment-1213008550
import { contextBridge } from "electron";
import { type ExposedContext } from "@ts-fullstack-template/desktop-contract";

const exposed: ExposedContext = { webSocketPort: parseInt(process.argv.slice(-1)[0]) };
contextBridge.exposeInMainWorld("EXPOSED", exposed);
