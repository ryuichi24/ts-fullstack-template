import { createRequire } from "module";
import url from "url";
import path from "path";
import builder from "electron-builder";
import { devDependencies } from "../../main/package.json";
import { readPackageJsonFile } from "./util.js";

const require = createRequire(import.meta.url);
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const rootPath = process.env.INIT_CWD;

if (!rootPath) {
  throw new Error("Run this script from NPM package.json script.");
}

const prodPackageJson = readPackageJsonFile(path.join(rootPath, "release", "app", "package.json"));
const assetsPath = path.join(rootPath, "release", "app", "dist", "main", "assets");

const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";
const isLinux = process.platform === "linux";

let builderConfig: builder.Configuration = {
  appId: prodPackageJson.publishMeta.appId,
  productName: prodPackageJson.publishMeta.appName,
  copyright: prodPackageJson.publishMeta.copyright,
  asar: true,
  asarUnpack: "**\\*.{node,dll}",
  directories: {
    app: path.join(rootPath, "release", "app"),
    output: "release/build/${version}",
  },
  files: ["dist", "node_modules", "package.json", "!dist/main/assets/**"],
  extraResources: [path.join(rootPath, "release", "app", "dist", "main", "assets", "**")],
  npmRebuild: false,
  electronVersion: devDependencies.electron.replace("^", ""),
  publish: [
    {
      provider: "github",
      owner: prodPackageJson.publishMeta.provider.github.owner,
      repo: prodPackageJson.publishMeta.provider.github.repositoryName,
      // to use private repository
      private: prodPackageJson.publishMeta.provider.github.private,
      // to publish it to private repsotiry and make it auto updater work as well
      token: process.env.GH_TOKEN,
    },
  ],
};

if (isMac) {
  builderConfig = {
    ...builderConfig,
    mac: {
      icon: path.join(assetsPath, "logo", "mac", "logo.icns"),
      target: {
        target: "default",
        arch: ["arm64", "x64"],
      },
    },
    dmg: {
      contents: [
        {
          x: 130,
          y: 220,
        },
        {
          x: 410,
          y: 220,
          type: "link",
          path: "/Applications",
        },
      ],
    },
  };
}

if (isWindows) {
  builderConfig = {
    ...builderConfig,
    win: {
      icon: path.join(assetsPath, "logo", "windows", "logo.ico"),
      target: ["nsis"],
    },
  };
}

if (isLinux) {
  builderConfig = {
    ...builderConfig,
    linux: {
      icon: path.join(assetsPath, "logo", "windows", "logo.png"),
      target: ["AppImage"],
    },
  };
}

builder.build({
  publish: process.env.ELECTRON_PUBLISH === "true" ? "always" : "never",
  config: builderConfig,
});
