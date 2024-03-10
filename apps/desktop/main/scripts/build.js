import path from "path";
import * as esbuild from "esbuild";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const rootDir = path.resolve(__dirname, "..");

const entryFile = path.resolve(rootDir, "src", "index.ts");
const entryPreloadFile = path.resolve(rootDir, "src", "preload.ts");

const distFile = path.resolve(rootDir, "dist", "index.js");
const distPreloadFile = path.resolve(rootDir, "dist", "preload.js");

const tsconfig = path.resolve(rootDir, "tsconfig.json");
const preloadTsconfig = path.resolve(rootDir, "tsconfig.preload.json");

await esbuild.build({
  entryPoints: [entryFile],
  bundle: true,
  platform: "node",
  target: ["node20.4.0"],
  outfile: distFile,
  tsconfig: tsconfig,
  format: "esm",
  banner: {
    // for common js imported from third-party libs
    js: 'import { createRequire } from "module"; import url from "url"; const require = createRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));',
  },
  external: ["electron"],
});

await esbuild.build({
  entryPoints: [entryPreloadFile],
  bundle: true,
  platform: "node",
  target: ["node20.4.0"],
  outfile: distPreloadFile,
  tsconfig: preloadTsconfig,
  // preload script is loaded as common js when the renderer process is sandboxed: see https://www.electronjs.org/docs/latest/tutorial/esm#preload-scripts
  format: "cjs",
  external: ["electron"],
});
