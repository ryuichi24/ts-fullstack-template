import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
import url from "url";

const require = createRequire(import.meta.url);
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const rootPath = process.env.INIT_CWD;

if (!rootPath) {
  throw new Error("Run this script from NPM package.json script.");
}

const nodeModulesPath = path.join(rootPath, "node_modules");

const releasePath = path.join(rootPath, "release", "app");
const mainPath = path.join(nodeModulesPath, "@ts-fullstack-template/desktop-main");
const rendererPath = path.join(nodeModulesPath, "@ts-fullstack-template/desktop-renderer");
const serverPath = path.join(nodeModulesPath, "@ts-fullstack-template/server");

await fs.cp(path.join(mainPath, "dist"), path.join(releasePath, "dist", "main"), {
  recursive: true,
});

await fs.cp(path.join(rendererPath, "dist"), path.join(releasePath, "dist", "renderer"), {
  recursive: true,
});

await fs.cp(path.join(serverPath, "dist"), path.join(releasePath, "dist", "server"), {
  recursive: true,
});
