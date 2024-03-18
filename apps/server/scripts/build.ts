import { buildAsEsNode } from "@ts-fullstack-template/esbuild-config/node";

buildAsEsNode({
  entryPoints: ["./src/index.ts"],
  outdir: "./dist",
  tsconfig: "./tsconfig.json",
  banner: {
    // for common js imported from third-party libs
    js: 'import { createRequire } from "module"; import url from "url"; const require = createRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));',
  },
});
