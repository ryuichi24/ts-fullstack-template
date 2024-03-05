import { fork } from "child_process";
import path from "path";
import { BrowserWindow, app } from "electron";
import { ProcessEventEmitter } from "@ts-fullstack-template/process-event-emitter";

const isDev = !app.isPackaged;
const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";
const isLinux = process.platform === "linux";
const rendererDevServerURL = `http://localhost:${process.env.TS_DESKTOP_RENDERER_DEV_SERVER_PORT || 5555}`;
const preloadScriptPath = path.resolve(__dirname, "preload.js");
const rendererFilePath = path.resolve(__dirname, "..", "renderer", "index.html");
const backgroundServerPath = isDev
  ? path.resolve("..", "..", "server", "dist", "index.js")
  : path.resolve("server", "dist", "index.js");

/**
 * Initialize custom global variables
 */
global.mainWindow = null;
global.backgroundServer = null;

async function main() {
  await app.whenReady();
  const port = await initBGServer(backgroundServerPath);
  createMainWindow([port.toString()]).catch(shutDown);
}

main().catch(shutDown);

async function createMainWindow(args?: string[]) {
  global.mainWindow = new BrowserWindow({
    minWidth: 1408,
    minHeight: 848,
    width: 1408,
    height: 848 + (isDev ? 630 : 0),
    resizable: isDev,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadScriptPath,
      additionalArguments: args,
    },
  });

  if (isDev) {
    global.mainWindow.webContents.openDevTools({
      mode: "bottom",
    });
    await global.mainWindow.loadURL(rendererDevServerURL);
  } else {
    await global.mainWindow.loadFile(rendererFilePath);
  }
}

async function initBGServer(serverPath: string) {
  return new Promise<number>((res, rej) => {
    // NOTE: the hot reload in dev does not work since the server project is started as child process
    // and the main process does not re-fork the process accordingly.
    global.backgroundServer = new ProcessEventEmitter(fork(serverPath, { env: { FORK: "1" } }));
    global.backgroundServer.on("msg:ws-ready", ({ port }) => {
      res(port);
    });
    global.backgroundServer.on("msg:ws-failed", ({ error }) => {
      rej(error);
    });
  });
}

function shutDown(error: Error) {
  console.error(error);
  global.mainWindow = null;
  global.backgroundServer?.close();
  process.exit(1);
}
