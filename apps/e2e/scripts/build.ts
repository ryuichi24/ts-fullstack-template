import { glob } from "glob";
import { buildAsEsNode } from "@ts-fullstack-template/esbuild-config/node";

const testFiles = await glob("./src/**/*.test.ts", {});

buildAsEsNode({
  entryPoints: testFiles,
  outdir: "./dist",
  tsconfig: "./tsconfig.json",
  banner: {
    // for common js imported from third-party libs
    js: 'import { createRequire } from "module"; import url from "url"; const require = createRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));',
  },
  external: ["playwright", "@playwright/test"],
  sourcemap: process.env.NODE_ENV === "debug" ? true : false,
});
