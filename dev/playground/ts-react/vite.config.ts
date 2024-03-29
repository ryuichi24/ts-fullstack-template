import path from "path";
import { defineConfig, UserConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const envFileDir = process.cwd();
  const env = loadEnv(mode, envFileDir, "VITE");
  return {
    root: "src",
    base: mode === "production" ? "./" : "/",
    build: {
      sourcemap: false,
      outDir: path.resolve(process.cwd(), "dist"),
    },
    server: {
      open: "index.html",
      port: parseInt(env.VITE_DEV_SERVER_PORT ?? "3333"),
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
    envPrefix: "VITE",
  } as UserConfig;
});
