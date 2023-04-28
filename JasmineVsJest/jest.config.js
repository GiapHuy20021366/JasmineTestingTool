module.exports = {
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(test).js?(x)"],
  reporters: ["jest-html-reporter", "default"],
  collectCoverage: true,
  coverageReporters: ["html"],
  coverageDirectory: "coverage",
  testPathIgnorePatterns: ["/node_modules/"],
};
