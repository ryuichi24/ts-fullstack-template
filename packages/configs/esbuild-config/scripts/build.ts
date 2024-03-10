import path from "path";
import esbuild from "esbuild";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const rootDir = path.resolve(__dirname, "..");

const electronConfigEntry = path.resolve(rootDir, "src", "electron");
const nodeConfigEntry = path.resolve(rootDir, "src", "node");

const distFile = path.resolve(rootDir, "dist");

const tsconfig = path.resolve(rootDir, "tsconfig.json");

await esbuild.build({
  entryPoints: [electronConfigEntry, nodeConfigEntry],
  outdir: distFile,
  tsconfig: tsconfig,
  bundle: true,
  platform: "node",
  target: ["node20.4.0"],
  format: "esm",
});
