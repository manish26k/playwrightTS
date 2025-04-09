// playwright.dev.config.ts
import baseConfig from "./playwright.baseConfig";
import { defineConfig } from "@playwright/test";
import { testConfig } from "./testConfig";

export default defineConfig({
    ...baseConfig,
    use: {
        ...baseConfig.use,
        baseURL: testConfig.dev,
    },
    testMatch : ["**/loginWithCode.spec.ts"],
});    


