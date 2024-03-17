declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BUILD_MODE: "initial" | "node" | "electron";
    }
  }
}

export {};
