import { buildAsEsNode } from "@ts-fullstack-template/esbuild-config/node";

await buildAsEsNode({
  entryPoints: ["./src/index.ts"],
  outdir: "./dist",
  tsconfig: "./tsconfig.json",
});
