// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    browsers: ["ChromeNoSandbox"],
    files: [
      "src/*.js", // Add your source code files
      "test/jasmine/spec/*.spec.js", // Add your test files
    ],
    customLaunchers: {
      ChromeNoSandbox: {
        base: "Chrome",
        flags: ["--no-sandbox"],
      },
    },
    client: {
      clearContext: false, // do not clear Chrome cache and cookies
    },
    autoWatch: true,
    captureTimeout: 60000,
    reporters: ["progress", "kjhtml"],

    logLevel: config.LOG_INFO,
    singleRun: false,
  });
};
