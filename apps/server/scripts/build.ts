import path from "path";
import esbuild from "esbuild";
import { makeNodeSettings } from "@ts-fullstack-template/esbuild-config/node";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const rootDir = path.resolve(__dirname, "..");

const entryFile = path.resolve(rootDir, "src", "index.ts");

const distFile = path.resolve(rootDir, "dist", "index.js");

const tsconfig = path.resolve(rootDir, "tsconfig.json");

if (process.env.ESBUILD_WATCH === "true") {
  const ctx = await esbuild.context({
    ...makeNodeSettings(),
    entryPoints: [entryFile],
    outfile: distFile,
    tsconfig: tsconfig,
  });
  ctx.watch();
}

if (process.env.ESBUILD_WATCH !== "true") {
  await esbuild.build({
    ...makeNodeSettings(),
    entryPoints: [entryFile],
    outfile: distFile,
    tsconfig: tsconfig,
  });
}
