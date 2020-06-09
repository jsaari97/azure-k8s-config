module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 10 * 1000,
  setupFiles: ["<rootDir>/jest/setup-env-vars.js"],
};
