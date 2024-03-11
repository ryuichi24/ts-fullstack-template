import { EsbuildOptions } from "#src/type";

export const vanillaConfig: EsbuildOptions = {
  bundle: true,
  platform: "browser",
  target: ["chrome58"],
  format: "esm",
  treeShaking: true,
};
