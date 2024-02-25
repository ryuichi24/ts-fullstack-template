import path from "path";
import { defineConfig, UserConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const envFileDir = process.env.INIT_CWD ?? process.cwd();
  const env = loadEnv(mode, envFileDir, "");
  return {
    root: "src",
    server: {
      // electron app does not have to use browser
      // open: "index.html",
      port: env.DESKTOP_RENDERER_DEV_SERVER_PORT || 3000,
    },
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(process.cwd(), "src") }],
    },
    plugins: [react()],
  } as UserConfig;
});
