import { makeBuilder } from "../util/make-builder";
import { mainConfig } from "#src/electron/main";
import { preloadConfig } from "#src/electron/preload";

export const buildAsMain = makeBuilder(mainConfig);

export const buildAsPreload = makeBuilder(preloadConfig);
