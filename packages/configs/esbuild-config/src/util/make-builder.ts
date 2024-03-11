import esbuild, { SameShape, BuildOptions } from "esbuild";

export function makeBuilder(mainOptions: SameShape<BuildOptions, BuildOptions>) {
  return async (options?: SameShape<BuildOptions, BuildOptions>, watchEnvVarKey = "ESBUILD_WATCH") => {
    if (process.env[watchEnvVarKey] === "true") {
      const ctx = await esbuild.context({
        ...mainOptions,
        ...options,
      });
      ctx.watch();
    }

    if (process.env[watchEnvVarKey] !== "true") {
      await esbuild.build({
        ...mainOptions,
        ...options,
      });
    }
  };
}
