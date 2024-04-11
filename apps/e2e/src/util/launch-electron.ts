import { _electron as electron } from "@playwright/test";

export async function launchElectron() {
  return await electron.launch({
    args: [require.resolve("@ts-fullstack-template/desktop-main/dist/index.js")],
    executablePath: require.resolve("@ts-fullstack-template/desktop-main/node_modules/.bin/electron"),
  });
}
