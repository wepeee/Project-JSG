/** @type {import('jest').Config} */
const baseProjectConfig = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json", useESM: true }],
  },
};

/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      ...baseProjectConfig,
      displayName: "unit",
      setupFilesAfterEnv: ["<rootDir>/tests/setup-unit.ts"],
      testMatch: ["<rootDir>/tests/unit/**/*.test.ts"],
    },
    {
      ...baseProjectConfig,
      displayName: "integration",
      setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
      testMatch: ["<rootDir>/tests/integration/**/*.test.ts"],
      testTimeout: 60000,
    },
  ],
};

export default config;
