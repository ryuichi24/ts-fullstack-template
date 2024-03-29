import path from "path";
import fs from "fs";
import { rebuild } from "@electron/rebuild";
import { dependencies } from "../package.json";

const rootPath = process.env.INIT_CWD;
const projectRootPath = process.env.PROJECT_CWD;

if (!rootPath || !projectRootPath) {
  throw new Error("Run this script from NPM package.json script.");
}

// prepare production package.json
const projectRootPackageJsonPath = path.join(projectRootPath, "package.json");
const projectRootPackageJson = readPackageJsonFile(projectRootPackageJsonPath);
const productionPackageJson = {
  name: process.env.DESKTOP_APP_NAME ?? `${projectRootPackageJson.name}-desktop`,
  author: projectRootPackageJson.author,
  type: "module",
  version: projectRootPackageJson.version,
  main: "dist/main/index.js",
  description: projectRootPackageJson.description,
  license: projectRootPackageJson.license,
  dependencies: {},
};

const nodeModulesPath = path.join(rootPath, "node_modules");
const subModuleNames = Object.keys(dependencies);

subModuleNames.forEach((subModule) => {
  const subModulePath = path.join(nodeModulesPath, subModule);
  const subModulePackageJsonPath = path.join(subModulePath, "package.json");
  const parsedPackageJsonData = readPackageJsonFile(subModulePackageJsonPath);
  const subModuleDependencies = Object.entries(parsedPackageJsonData.dependencies ?? {});

  // sub module node_modules
  const subModuleNode_modulesPath = path.join(subModulePath, "node_modules");

  const nativeModuleDependency = subModuleDependencies.find(([subModuleDependency]) => {
    const subModuleDependencyPath = path.join(subModuleNode_modulesPath, subModuleDependency);
    const subModuleDependencyPackageJsonPath = path.join(subModuleDependencyPath, "package.json");
    const parsedSubModuleDependencyPackageJsonData = readPackageJsonFile(subModuleDependencyPackageJsonPath);
    return isNativeModule(parsedSubModuleDependencyPackageJsonData);
  });

  if (!nativeModuleDependency) {
    return;
  }

  Reflect.set(productionPackageJson.dependencies, nativeModuleDependency[0], nativeModuleDependency[1]);
});

// generate production package.json
const productionAppPath = path.join(rootPath, "release", "app");
if (!fs.existsSync(productionAppPath)) {
  fs.mkdirSync(productionAppPath, { recursive: true });
}
const productionPackageJsonPath = path.join(productionAppPath, "package.json");
fs.writeFileSync(productionPackageJsonPath, JSON.stringify(productionPackageJson, null, 2), "utf8");

// rebuild({ buildPath: "", electronVersion: "" });

type PackageJson = {
  name: string;
  version?: string;
  description?: string;
  license?: string;
  author?: string | { name?: string; email?: string; url?: string };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

function readPackageJsonFile(path: string) {
  const raw = fs.readFileSync(path, {
    encoding: "utf8",
  });
  return JSON.parse(raw) as PackageJson;
}

function isNativeModule(packageJson: PackageJson) {
  const NATIVE_BUILD_TOOLS = ["bindings", "node-addon-api", "prebuild", "nan", "node-pre-gyp", "node-gyp-build"];
  if (!packageJson.dependencies && !packageJson.devDependencies) {
    throw new Error('Cannot validate the package since there is no "dependencies" nor "devDependencies"');
  }

  return NATIVE_BUILD_TOOLS.some((tool) => {
    return Reflect.has(packageJson.dependencies ?? {}, tool) || Reflect.has(packageJson.devDependencies ?? {}, tool);
  });
}
