import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const envFileDir = process.cwd();
  const env = loadEnv(mode, envFileDir, "VITE");
  return {
    root: "src",
    build: {
      sourcemap: false,
      outDir: path.resolve(process.cwd(), "dist"),
    },
    server: {
      open: "index.html",
      port: parseInt(env.VITE_DEV_SERVER_PORT ?? "3333"),
    },
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(process.cwd(), "src") }],
    },
    plugins: [react()],
    envPrefix: "VITE",
  };
});
