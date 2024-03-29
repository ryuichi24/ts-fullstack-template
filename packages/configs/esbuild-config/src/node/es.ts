import { EsbuildOptions } from "#src/type";

export const esNodeConfig: EsbuildOptions = {
  bundle: true,
  platform: "node",
  target: ["node20.4.0"],
  format: "esm",
};
