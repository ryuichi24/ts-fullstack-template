import { EsbuildOptions } from "#src/type";
import { esNodeConfig } from "#src/node/es";

export const mainConfig: EsbuildOptions = {
  ...esNodeConfig,
  external: ["electron"],
};
