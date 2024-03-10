import { BuildOptions, SameShape } from "esbuild";
import { makeNodeSettings } from "#src/node";

export function makeMainSettings(options?: BuildOptions): SameShape<BuildOptions, BuildOptions> {
  return {
    ...makeNodeSettings(),
    external: ["electron"],
    ...options,
  };
}

export function makePreloadSettings(options?: BuildOptions): SameShape<BuildOptions, BuildOptions> {
  return {
    ...makeNodeSettings(),
    external: ["electron"],
    // preload script is loaded as common js when the renderer process is sandboxed: see https://www.electronjs.org/docs/latest/tutorial/esm#preload-scripts
    format: "cjs",
    banner: undefined,
    ...options,
  };
}
