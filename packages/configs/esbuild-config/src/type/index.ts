import { BuildOptions, SameShape } from "esbuild";

export type EsbuildOptions = SameShape<BuildOptions, BuildOptions>;
