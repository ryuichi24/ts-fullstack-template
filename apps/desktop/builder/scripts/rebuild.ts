import path from "path";
import { rebuild } from "@electron/rebuild";
import { devDependencies } from "../../main/package.json";
import { execSync } from "child_process";

const rootPath = process.env.INIT_CWD;

if (!rootPath) {
  throw new Error("Run this script from NPM package.json script.");
}

const productionAppPath = path.join(rootPath, "release", "app");

execSync("yarn install", {
  cwd: productionAppPath,
  stdio: "inherit",
});

console.log("rebuilding native modules...");
await rebuild({ buildPath: productionAppPath, electronVersion: devDependencies.electron.replace("^", "") });
console.log("rebuild done!");
