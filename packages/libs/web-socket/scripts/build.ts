import path from "path";
import { buildAsVanilla } from "@ts-fullstack-template/esbuild-config/browser";
import { buildAsEsNode } from "@ts-fullstack-template/esbuild-config/node";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const rootDir = path.resolve(__dirname, "..");

const entryBrowserFile = path.resolve(rootDir, "src", "browser", "index.ts");
const entryNodeFile = path.resolve(rootDir, "src", "node", "index.ts");
const entryContractFile = path.resolve(rootDir, "src", "contract", "index.ts");

const nodeDistDir = path.resolve(rootDir, "dist", "node");
const browserDistDir = path.resolve(rootDir, "dist", "browser");

const browserTsconfig = path.resolve(rootDir, "tsconfig.node.json");
const nodeTsconfig = path.resolve(rootDir, "tsconfig.browser.json");

await buildAsVanilla({
  entryPoints: [entryBrowserFile],
  outdir: browserDistDir,
  tsconfig: browserTsconfig,
  external: ["ws"],
});

await buildAsEsNode({ entryPoints: [entryNodeFile], outdir: nodeDistDir, tsconfig: nodeTsconfig, external: ["ws"] });
