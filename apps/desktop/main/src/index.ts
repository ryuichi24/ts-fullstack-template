import { fork } from "child_process";
import path from "path";
import { BrowserWindow, app, dialog } from "electron";
import log from "electron-log";
import { autoUpdater } from "electron-updater";
import { ProcessEventEmitter } from "@ts-fullstack-template/process-event-emitter";

log.transports.file.level = "info";
autoUpdater.logger = log;

const isDev = !app.isPackaged;
const isDebug = process.env.NODE_ENV === "debug";
const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";
const isLinux = process.platform === "linux";

const preloadScriptPath = path.resolve(__dirname, "preload.js");
const rendererDevServerURL = `http://localhost:${process.env.TS_DESKTOP_RENDERER_DEV_SERVER_PORT || 5555}`;
// NOTE: while the main module type is ESM but `require` can be used since esbuild adds a script making a custom `require`
const rendererFilePath = isDebug
  ? require.resolve("@ts-fullstack-template/desktop-renderer/dist/index.html")
  : path.resolve(__dirname, "..", "renderer", "index.html");
const backgroundServerPath = isDev
  ? require.resolve("@ts-fullstack-template/server/dist/index.js")
  : path.resolve(__dirname, "..", "server", "index.js");
const ASSETS_PATH = app.isPackaged ? path.join(process.resourcesPath, "assets") : path.join(".", "assets");

/**
 * Initialize custom global variables
 */
global.mainWindow = null;
global.backgroundServer = null;

async function main() {
  await app.whenReady();
  const port = await initBGServer(backgroundServerPath);
  createMainWindow([port.toString()]);

  app.on("quit", (event) => {
    global.backgroundServer?.close();
  });

  app.on("window-all-closed", () => {
    // Mac will not quit an app even though the window is closed
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow([port.toString()]);
    }
  });

  autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.addListener("update-downloaded", (event) => {
    if (!global.mainWindow) return;

    dialog
      .showMessageBox(global.mainWindow, {
        type: "info",
        buttons: ["Restart", "Later"],
        message: "UPDATE",
        detail: "A new version has been downloaded. Restart the application to apply the updates.",
      })
      .then((result) => {
        if (result.response === 0) autoUpdater.quitAndInstall();
      });
  });
}

main();

async function createMainWindow(args?: string[]) {
  global.mainWindow = new BrowserWindow({
    minWidth: 1408,
    minHeight: 848,
    width: 1408,
    height: 848 + (isDev ? 630 : 0),
    icon: getOSIcon(),
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

  global.mainWindow.on("closed", () => {
    global.mainWindow = null;
  });
}

function getOSIcon() {
  const osIconPath = isMac
    ? path.join("mac", "logo.icns")
    : isWindows
    ? path.join("windows", "logo.ico")
    : path.join("linux", "logo.png");
  return path.join(ASSETS_PATH, "icons", "logo", osIconPath);
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
      env: { FORK: "1", ELECTRON_USER_DATA_PATH: app.getPath("userData"), NODE_ENV: process.env.NODE_ENV },
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

function terminateOnErr(err: Error) {
  log.error("electron:err");
  log.error(err);
  log.error(err.stack);
  global.mainWindow = null;
  global.backgroundServer?.close();
  app.quit();
}

process.on("uncaughtException", terminateOnErr);
