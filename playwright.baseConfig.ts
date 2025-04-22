import { defineConfig } from "@playwright/test";


export default defineConfig({
  testDir: "./tests",
  timeout: 240000,
  globalTimeout: 30 * 60 * 1000,
  expect: {
    timeout: 50000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["allure-playwright", {
      detail: true,
      //outputFolder: "portal-allure-results",
      suiteTitle: true,
    }],
  ],

  use: {
    //baseURL: testConfig[ENV],
    actionTimeout: 50 * 1000,
    navigationTimeout: 70 * 1000,
    launchOptions: {
      slowMo: 2000,
      devtools: false,
    },
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        //channel: "chrome",
        //baseURL: testConfig[ENV],
        headless: false,
        viewport: { width: 1500, height: 730 },
        acceptDownloads: true,
        screenshot: "on",
        video: "retain-on-failure",
        trace: "on",
        launchOptions: {
          slowMo: 1000,
        },
      },
    },
  ],
});
