import path from "path";
import { defineConfig, UserConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const envFileDir = process.env.INIT_CWD ?? process.cwd();
  const env = loadEnv(mode, envFileDir, "TS");
  return {
    root: "src",
    base: mode === "production" || mode === "debug" ? "./" : "/",
    build: {
      sourcemap: mode === "debug" ? true : false,
      outDir: path.resolve(process.cwd(), "dist"),
      minify: mode === "debug" ? false : true,
    },
    server: {
      // electron app does not have to use browser
      open: process.env.DEV_TYPE === "web" ? "index.html" : false,
      port: parseInt(env.TS_DESKTOP_RENDERER_DEV_SERVER_PORT || "5555"),
    },
    resolve: {
      alias: [
        { find: "@", replacement: path.resolve(process.cwd(), "src") },
        // NOTE: when refering to a local sub module that has "react" as its dependency, vite includes a copy of react into the main source code, which breaks the runtime.
        // This is why, the direct alias to the main "react" module is set here.
        { find: "react", replacement: path.resolve(process.cwd(), "node_modules/react") },
      ],
    },
    plugins: [react()],
    envPrefix: "TS",
  } as UserConfig;
});
