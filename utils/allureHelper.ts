import * as allure from "allure-js-commons";
import fs from "fs";

export class AllureHelper {
  static async attachJson(name: string, json: any) {
    await allure.attachment(name, JSON.stringify(json, null, 2), "application/json");
  }

  static async attachText(name: string, content: string) {
    await allure.attachment(name, content, "text/plain");
  }

  static async attachScreenshot(name: string, page: any) {
    const buffer = await page.screenshot();
    await allure.attachment(name, buffer, "image/png");
  }
}
