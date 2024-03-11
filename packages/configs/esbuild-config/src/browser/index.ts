import { makeBuilder } from "#src/util/make-builder";
import { reactConfig } from "#src/browser/react";
import { vanillaConfig } from "#src/browser/vanilla";

export const buildAsVanilla = makeBuilder(vanillaConfig);

export const buildAsReact = makeBuilder(reactConfig);
