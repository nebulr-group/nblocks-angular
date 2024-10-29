const path = require('path');
const { Config, ConfigOptions } = require('karma');

module.exports = function (config) {
  console.log('Karma config being loaded...');
  /** @type {ConfigOptions} */
  const configuration = {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer',
          '--disable-web-security',
          '--remote-debugging-port=9222'
        ]
      }
    },
    coverageReporter: {
      dir: "test-results",
      subdir: 'coverage',
      reporters: [
        { type: 'html' }
      ],
      check: {
        global: {
          statements: 70,
          branches: 70,
          functions: 50,
          lines: 70
        }
      }
    },
    reporters: ['progress', 'coverage', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    restartOnFileChange: true
  };
  config.set(configuration);
};
