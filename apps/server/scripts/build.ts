import path from "path";
import { buildAsEsNode } from "@ts-fullstack-template/esbuild-config/node";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const rootDir = path.resolve(__dirname, "..");

const entryFile = path.resolve(rootDir, "src", "index.ts");

const distFile = path.resolve(rootDir, "dist", "index.js");

const tsconfig = path.resolve(rootDir, "tsconfig.json");

buildAsEsNode({
  entryPoints: [entryFile],
  outfile: distFile,
  tsconfig: tsconfig,
  banner: {
    // for common js imported from third-party libs
    js: 'import { createRequire } from "module"; import url from "url"; const require = createRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));',
  },
  external: ["ws"],
});
