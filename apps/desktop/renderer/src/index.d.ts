/// <reference types="vite/client" />

import { type EXPOSED } from "@ts-fullstack-template/contract";
/**
 * Declaration Merging to add API definition to global Window object
 * @see https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
declare global {
  interface Window {
    EXPOSED: EXPOSED;
  }
}
