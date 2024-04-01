import path from "path";
import fs from "fs";

import { dependencies } from "../package.json";
import { isNativeModule, readPackageJsonFile } from "./util.js";

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
  publishMeta: projectRootPackageJson.publishMeta,
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
