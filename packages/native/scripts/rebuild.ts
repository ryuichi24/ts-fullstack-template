import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { devDependencies } from "../../../apps/desktop/main/package.json";
import { dependencies } from "../package.json";

const isWindows = process.platform === "win32";
const isMac = process.platform === "darwin";
const isLinux = process.platform === "linux";
const arch = process.arch;

const nativeModules = Object.keys(dependencies);

if (nativeModules.length === 0) {
  process.exit(0);
}

const BUILD_INFO_JSON = "build-info.json";
const cwd = process.cwd();
const buildInfoJsonPath = path.join(cwd, BUILD_INFO_JSON);

const isBuildModeInitial = process.env.BUILD_MODE === "initial";

if (isBuildModeInitial) {
  fs.writeFileSync(buildInfoJsonPath, '{"lastBuildMode": "initial"}', "utf8");
  process.exit(0);
}

const targetElectronVersion = devDependencies.electron.replace("^", "");

if (!fs.existsSync(buildInfoJsonPath)) {
  fs.writeFileSync(buildInfoJsonPath, '{"lastBuildMode": ""}', "utf8");
}

const raw = fs.readFileSync(buildInfoJsonPath, { encoding: "utf8" });
const buildInfo = JSON.parse(raw);

const isLastBuildModeElectron = buildInfo.lastBuildMode === "electron";
const isLastBuildModeNode = buildInfo.lastBuildMode === "node";
const isElectronBuild = process.env.BUILD_MODE === "electron";
const isNodeBuild = process.env.BUILD_MODE === "node";

if (isElectronBuild && isLastBuildModeElectron) {
  process.exit(0);
}

if (isNodeBuild && isLastBuildModeNode) {
  process.exit(0);
}

if (isElectronBuild && !isLastBuildModeElectron) {
  const electronRebuildCmd = `./node_modules/.bin/electron-rebuild.cmd --force --types prod,dev,optional --module-dir . -v ${targetElectronVersion}`;
  const cmd = isWindows ? electronRebuildCmd.replace(/\//g, "\\") : electronRebuildCmd.replace(".cmd", "");

  try {
    execSync(cmd, {
      stdio: "inherit",
    });
    fs.writeFileSync(buildInfoJsonPath, '{"lastBuildMode": "electron"}', "utf8");
    process.exit(0);
  } catch (error) {
    if (isMac) {
      console.log(`
      There are some missing dependencies for the native node module build.\n
      Here are the requirements for your OS:\n
      - Xcode Command Line Tools (just run "xcode-select --install" in your terminal)\n
      - python\n
    `);
    }

    if (isWindows) {
      console.log(`
        There are some missing dependencies for the native node module build.\n
        Here are the requirements for your OS:\n
        - VS 20xx C++ ${arch} Build tools (can be installed with Visual Studio)\n
        - Desktop development with C++ (can be installed with Visual Studio)\n
        - python\n
      `);
    }

    if (isLinux) {
      console.log(`
      There are some missing dependencies for the native node module build.\n
      Here are the requirements for your OS:\n
      - C/C++ compiler toolchain such as GCC\n
      - make CLI\n
      - python\n
    `);
    }
    process.exit(1);
  }
}

if (isNodeBuild && !isLastBuildModeNode) {
  try {
    const cmd = `npm rebuild ${nativeModules.join(" ")}`;
    execSync(cmd, {
      stdio: "inherit",
    });
    fs.writeFileSync(buildInfoJsonPath, '{"lastBuildMode": "node"}', "utf8");
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}
