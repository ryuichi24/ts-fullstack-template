/// <reference types="vite/client" />

/**
 * Declaration Merging to add API definition to global Window object
 * @see https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
declare global {
  interface Window {}
}
