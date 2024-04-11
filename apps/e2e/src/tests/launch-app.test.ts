import fs from "fs/promises";
import { ElectronApplication, Page, test, expect } from "@playwright/test";
import { launchElectron } from "../util/launch-electron";

let electronApp: ElectronApplication;
let mainWindow: Page;
let electronAppLogs: string[] = [];
let mainWindowLogs: string[] = [];

test.beforeEach(async ({}, testInfo) => {
  electronApp = await launchElectron();
  mainWindow = await electronApp.firstWindow();
  electronAppLogs = [];
  mainWindowLogs = [];
  // collect logs from main process
  electronApp.on("console", (msg) => electronAppLogs.push(msg.text()));
  // collect logs from main window
  mainWindow.on("console", (msg) => mainWindowLogs.push(msg.text()));
});

test.afterEach(async ({}, testInfo) => {
  const logsMainProcess = testInfo.outputPath("logs-main-process.txt");
  await fs.writeFile(logsMainProcess, electronAppLogs.join("\n"), "utf8");
  const logsMainWindow = testInfo.outputPath("logs-main-window.txt");
  await fs.writeFile(logsMainWindow, mainWindowLogs.join("\n"), "utf8");
  await electronApp.close();
});

test("it should render a home screen", async ({}, testInfo) => {
  const windowTitle = await mainWindow.title();
  expect(windowTitle).toBe("TS Full Stack Template");

  const windows = await electronApp.windows();
  expect(windows.length).toBe(1);

  const homeScreenImage = testInfo.outputPath("home-screen.png");
  await mainWindow.screenshot({ path: homeScreenImage });
});

test("it should log out from main process", async ({}, testInfo) => {
  const testLog = "test log";
  const logOutFromMain = await electronApp.evaluate(async (ctx) => {
    const testLogInMain = "test log";
    console.log(testLogInMain);
    return testLogInMain;
  });
  expect(logOutFromMain).toBe(testLog);
});
