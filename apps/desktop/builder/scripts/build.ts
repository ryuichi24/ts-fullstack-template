import { createRequire } from "module";
import url from "url";
import path from "path";
import builder from "electron-builder";
import { devDependencies } from "../../main/package.json";

const require = createRequire(import.meta.url);
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const rootPath = process.env.INIT_CWD;

if (!rootPath) {
  throw new Error("Run this script from NPM package.json script.");
}

builder.build({
  publish: "never",
  config: {
    appId: "com.ryuichi24.tsfullstack",
    productName: "TsFullStackElectronApp",
    copyright: "Copyright © 2024 ${author}",
    asar: true,
    asarUnpack: "**\\*.{node,dll}",
    directories: {
      app: path.join(rootPath, "release", "app"),
      output: "release/build/${version}",
    },
    files: ["dist", "node_modules", "package.json"],
    mac: {
      // icon: "dist/assets/images/app-icon.png",
      target: {
        target: "default",
        arch: ["arm64", "x64"],
      },
    },
    npmRebuild: false,
    electronVersion: devDependencies.electron.replace("^", ""),
  },
});
