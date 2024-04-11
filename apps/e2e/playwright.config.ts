import { defineConfig } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./dist",
  fullyParallel: true,
  testMatch: "*dist/*.test.js",
  timeout: 30 * 1000,
  use: {
    headless: true,
  },
  expect: {
    timeout: 5000,
  },
  outputDir: "./test-results",
});
