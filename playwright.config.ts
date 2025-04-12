import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { testConfig } from "./testConfig";
//import MonocartReporter from "monocart-reporter";

// Load environment variables
dotenv.config();

// Get environment variable or default to "dev"
let ENV = process.env.ENV || "dev";

if (!ENV || !["dev", "Uat"].includes(ENV)) {
  console.log(`Please provide a correct environment value like "npx cross-env ENV=dev|Uat"`);
  process.exit(1);
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["html"],
    ["allure-playwright", {
      detail: true,
      //outputFolder: "my-allure-results",
      suiteTitle: true,
    }],
    
    // [
    //   "monocart-reporter",
    //   {
    //     name: "Sciensus_Portal_Automation_Report",
    //     outputFile: "./monocart-report/index.html",
    //     mermaid:{
    //       enable: true,
    //       theme: 'dark',
    //       scriptSrc: null,
    //       config:{
    //         startOnLoad: false
    //       }
    //     },
    //     customFieldsInComments: true,
    //     customeColumns: [
    //       {title: 'Owner', key:'owner', width: 100, searchable: true},
    //       {title: 'Assignee', key:'assignee', width: 100, searchable: true},
    //       {title: 'Module', key:'module', width: 100, searchable: true},
    //       {title: 'Priority', key:'priority', width: 100, searchable: true},
    //       {title: 'TestEnvironment', key:'testEnvironment', width: 100, searchable: true},
    //     ],
    //     customDataVisitor:{
    //       removeSecrets: true,
    //       fromTitle: true,
    //       fromAnnotations: true,
    //     },
        
    //     styleTags:{
    //       important: 'background-color: yellow; color: black; font-weight: bold;',
    //       critical: 'background-color: red; color: black; font-weight: bold;',
    //     }        
    //   },
    // ],
    
  ],

  timeout: 240000,
  globalTimeout: 30 * 60 * 1000,

  expect: {
    timeout: 50 * 1000,
  },

  use: {
    baseURL: testConfig[ENV],
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
        channel: "chrome",
        baseURL: testConfig[ENV],
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
