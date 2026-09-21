export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: { "^(\\.{1,2}/.*)\\.js$": "$1" },
  setupFiles: ["<rootDir>/test/setup.ts"],
  testMatch: ["<rootDir>/test/**/*.test.ts"]
};
