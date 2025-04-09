// playwright.uat.config.ts
import baseConfig from "./playwright.baseConfig";
import { defineConfig } from "@playwright/test";
import { testConfig } from "./testConfig";

export default defineConfig({
    ...baseConfig,
    use: {
        ...baseConfig.use,
        baseURL: testConfig.Uat,
    },
    testMatch : ["**/*.spec.ts"],
}); 


