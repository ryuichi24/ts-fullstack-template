import { buildAsVanilla } from "@ts-fullstack-template/esbuild-config/browser";
import { buildAsEsNode } from "@ts-fullstack-template/esbuild-config/node";

await buildAsVanilla({
  entryPoints: ["./src/browser/index.ts"],
  outdir: "./dist/browser",
  tsconfig: "./tsconfig.browser.json",
});

await buildAsEsNode({
  entryPoints: ["./src/node/index.ts"],
  outdir: "./dist/node",
  tsconfig: "./tsconfig.node.json",
});
