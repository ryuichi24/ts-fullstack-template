import type { Config } from "jest";

// https://jestjs.io/docs/configuration
const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    // https://zenn.dev/kohski/articles/typescript_jest
    collectCoverage: true,
    collectCoverageFrom: ["**/*.ts", "!**/node_modules/**"],
    coverageDirectory: "coverage",
    coverageReporters: [],
    // https://www.valentinog.com/blog/jest-coverage/
    coverageThreshold: {
        global: {
            lines: 0,
        },
    },
    // display describe text and test name
    verbose: true,
    // https://github.com/facebook/jest/issues/13022
    // https://github.com/VitorLuizC/ts-jest-resolver
    resolver: "ts-jest-resolver",
};

export default config;
