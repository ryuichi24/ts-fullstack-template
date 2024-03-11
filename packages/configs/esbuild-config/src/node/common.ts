import { EsbuildOptions } from "#src/type";

export const commonNodeConfig: EsbuildOptions = {
  bundle: true,
  platform: "node",
  target: ["node20.4.0"],
  format: "cjs",
};
