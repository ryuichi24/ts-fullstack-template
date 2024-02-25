import path from "path";
import { BrowserWindow, app } from "electron";

const isDev = !app.isPackaged;
const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";
const isLinux = process.platform === "linux";
const rendererDevServerURL = `http://localhost:${process.env.DESKTOP_RENDERER_DEV_SERVER_PORT || 3000}`;
const preloadScriptPath = path.resolve(__dirname, "preload.ts");
const rendererFilePath = path.resolve(__dirname, "..", "renderer", "index.html");

/**
 * Initialize custom global variables
 */
global.mainWindow = null;

async function main() {
  await app.whenReady();

  await createMainWindow().catch(shutDown);
}

main().catch(shutDown);

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 1408,
    minHeight: 848,
    width: 1408,
    height: 848 + (isDev ? 630 : 0),
    resizable: isDev,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadScriptPath,
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({
      mode: "bottom",
    });
    await mainWindow.loadURL(rendererDevServerURL);
  } else {
    await mainWindow.loadFile(rendererFilePath);
  }
}

function shutDown(error: Error) {
  console.error(error);
  mainWindow = null;
  process.exit(1);
}
