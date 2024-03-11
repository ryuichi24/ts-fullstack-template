import path from "path";
import { buildAsEsNode } from "@ts-fullstack-template/esbuild-config/node";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const rootDir = path.resolve(__dirname, "..");

const entryFile = path.resolve(rootDir, "src", "index.ts");

const distDir = path.resolve(rootDir, "dist");

const tsconfig = path.resolve(rootDir, "tsconfig.json");

await buildAsEsNode({
  entryPoints: [entryFile],
  outdir: distDir,
  tsconfig: tsconfig,
  external: [],
});
