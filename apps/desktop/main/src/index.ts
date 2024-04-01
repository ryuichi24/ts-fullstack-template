import { fork } from "child_process";
import path from "path";
import { BrowserWindow, app } from "electron";
import { ProcessEventEmitter } from "@ts-fullstack-template/process-event-emitter";

const isDev = !app.isPackaged;
const isDebug = process.env.NODE_ENV === "debug";
const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";
const isLinux = process.platform === "linux";
// NOTE: the returned absolute file path cannot be used for child_process.fork
// const backgroundServerPath = await import.meta.resolve("@ts-fullstack-template/server/dist/index.js");

const preloadScriptPath = path.resolve(__dirname, "preload.js");
const rendererDevServerURL = `http://localhost:${process.env.TS_DESKTOP_RENDERER_DEV_SERVER_PORT || 5555}`;
// NOTE: while the main module type is ESM but `require` can be used since esbuild adds a script making a custom `require`
const rendererFilePath = isDebug
  ? require.resolve("@ts-fullstack-template/desktop-renderer/dist/index.html")
  : path.resolve(__dirname, "..", "renderer", "index.html");
const backgroundServerPath = isDev
  ? require.resolve("@ts-fullstack-template/server/dist/index.js")
  : path.resolve(__dirname, "..", "server", "index.js");

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

  if (isDev && !isDebug) {
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
    // NOTE: this pushed arg will be applied to an initialization of the child process by "fork" from "child_process" module.
    if (isDebug) {
      process.execArgv.push(`--inspect=${process.env.WS_DEBUGGER_PORT}`);
    }
    // NOTE: the hot reload in dev does not work since the server project is started as child process
    // and the main process does not re-fork the process accordingly.
    const childProcess = fork(serverPath, [], {
      env: { FORK: "1", ELECTRON_USER_DATA_PATH: app.getPath("userData") },
      stdio: "inherit",
    });
    global.backgroundServer = new ProcessEventEmitter(childProcess);
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
