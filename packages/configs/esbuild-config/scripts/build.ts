import path from "path";
import esbuild from "esbuild";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const rootDir = path.resolve(__dirname, "..");

const browserConfigEntry = path.resolve(rootDir, "src", "browser");
const electronConfigEntry = path.resolve(rootDir, "src", "electron");
const nodeConfigEntry = path.resolve(rootDir, "src", "node");

const distFile = path.resolve(rootDir, "dist");

const tsconfig = path.resolve(rootDir, "tsconfig.json");

await esbuild.build({
  entryPoints: [electronConfigEntry, nodeConfigEntry, browserConfigEntry],
  outdir: distFile,
  tsconfig: tsconfig,
  bundle: true,
  platform: "node",
  target: ["node20.4.0"],
  format: "esm",
  banner: {
    // for common js imported from third-party libs
    js: 'import { createRequire } from "module"; import url from "url"; const require = createRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));',
  },
  external: ["esbuild"],
});
