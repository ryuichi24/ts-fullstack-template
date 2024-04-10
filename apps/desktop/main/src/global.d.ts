// When index.d.ts is not recognized by typescript see: https://stackoverflow.com/a/59728984/13723015
import { BrowserWindow } from "electron";
import { ProcessEventEmitter } from "@ts-fullstack-template/process-event-emitter";

// https://stackoverflow.com/a/53981706
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "production" | "development" | "debug";
    }
  }
}

declare global {
  /**
   * A main instance of the application window
   */
  var mainWindow: BrowserWindow | null;
  var loginPageWindow: BrowserWindow | null;
  var backgroundServer: ProcessEventEmitter | null;
}
