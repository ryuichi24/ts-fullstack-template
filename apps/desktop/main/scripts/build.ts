import path from "path";
import { buildAsMain, buildAsPreload } from "@ts-fullstack-template/esbuild-config/electron";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const rootDir = path.resolve(__dirname, "..");

const entryFile = path.resolve(rootDir, "src", "index.ts");
const entryPreloadFile = path.resolve(rootDir, "src", "preload.ts");

const distFile = path.resolve(rootDir, "dist", "index.js");
const distPreloadFile = path.resolve(rootDir, "dist", "preload.js");

const tsconfig = path.resolve(rootDir, "tsconfig.json");
const preloadTsconfig = path.resolve(rootDir, "tsconfig.preload.json");

await buildAsMain({ entryPoints: [entryFile], outfile: distFile, tsconfig: tsconfig });
await buildAsPreload({ entryPoints: [entryPreloadFile], outfile: distPreloadFile, tsconfig: preloadTsconfig });
