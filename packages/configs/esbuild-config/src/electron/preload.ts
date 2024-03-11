import { EsbuildOptions } from "#src/type";
import { commonNodeConfig } from "#src/node/common";

export const preloadConfig: EsbuildOptions = {
  ...commonNodeConfig,
  external: ["electron"],
};
