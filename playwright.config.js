const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './src/features',
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: 'html',
  use: {
    actionTimeout: 10000,
    trace: 'on-first-retry',
    headless: process.env.HEADLESS === 'true' ? true : process.env.HEADLESS === 'false' ? false : !!process.env.CI,
    launchOptions: {
      slowMo: parseInt(process.env.SLOW_MO || '0', 10)
    },
    screenshot: process.env.SCREENSHOT || 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
});
