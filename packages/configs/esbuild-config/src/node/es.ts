import { EsbuildOptions } from "#src/type";

export const esNodeConfig: EsbuildOptions = {
  bundle: true,
  platform: "node",
  target: ["node20.4.0"],
  format: "esm",
  banner: {
    // for common js imported from third-party libs
    js: 'import { createRequire } from "module"; import url from "url"; const require = createRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));',
  },
};
