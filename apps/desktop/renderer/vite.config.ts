import path from "path";
import { defineConfig, UserConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const envFileDir = process.env.INIT_CWD ?? process.cwd();
  const env = loadEnv(mode, envFileDir, "TS");
  return {
    root: "src",
    build: {
      sourcemap: false,
      outDir: path.resolve(process.cwd(), "dist"),
    },
    server: {
      // electron app does not have to use browser
      open: process.env.DEV_TYPE === "web" ? "index.html" : false,
      port: env.TS_DESKTOP_RENDERER_DEV_SERVER_PORT || 5555,
    },
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(process.cwd(), "src") }],
    },
    plugins: [react()],
    envPrefix: "TS",
  } as UserConfig;
});
