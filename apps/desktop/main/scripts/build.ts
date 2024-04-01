import { buildAsMain, buildAsPreload } from "@ts-fullstack-template/esbuild-config/electron";

await buildAsMain({
  entryPoints: ["./src/index.ts"],
  outdir: "./dist",
  tsconfig: "./tsconfig.json",
  banner: {
    // for common js imported from third-party libs
    js: 'import { createRequire } from "module"; import url from "url"; const require = createRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));',
  },
  treeShaking: true,
  sourcemap: process.env.NODE_ENV === "debug" ? true : false,
});

await buildAsPreload({
  entryPoints: ["./src/preload.ts"],
  outfile: "./dist/preload.js",
  tsconfig: "./tsconfig.preload.json",
  sourcemap: process.env.NODE_ENV === "debug" ? true : false,
});
