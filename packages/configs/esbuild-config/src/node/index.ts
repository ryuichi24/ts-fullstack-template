import { makeBuilder } from "#src/util/make-builder";
import { esNodeConfig } from "#src/node/es";
import { commonNodeConfig } from "#src/node/common";

export const buildAsEsNode = makeBuilder(esNodeConfig);

export const buildAsCommonNode = makeBuilder(commonNodeConfig);
