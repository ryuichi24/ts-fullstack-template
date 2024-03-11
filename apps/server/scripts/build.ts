import path from "path";
import { buildAsEsNode } from "@ts-fullstack-template/esbuild-config/node";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const rootDir = path.resolve(__dirname, "..");

const entryFile = path.resolve(rootDir, "src", "index.ts");

const distFile = path.resolve(rootDir, "dist", "index.js");

const tsconfig = path.resolve(rootDir, "tsconfig.json");

buildAsEsNode({ entryPoints: [entryFile], outfile: distFile, tsconfig: tsconfig });
