import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { testConfig } from '../testConfig';

export class HomePage {
    private page: Page;
    private signInLink: Locator;
    private expireWrapperHeading: Locator;
    private expireSessionMessage: Locator;

    constructor(page: Page){
        this.page = page;
        this.signInLink = this.page.locator('a[title="Sign in"]');
        this.expireWrapperHeading = this.page.locator(".portHeading");
        this.expireSessionMessage = this.page.locator(".portal-desc");
    }

    /**
   * navigate to homepage
   */
  async navigateToURL() {
    //await this.page.goto("/");
    await this.page.waitForTimeout(2000);
    await this.page.goto(testConfig.dev);
    logger.info("Navigate to the Sciensus HomePage");
    //await this.page.waitForTimeout(2000);
        

    await expect(this.page).toHaveTitle(/Home/);
    logger.info("verify the Sciensus HomePage Title");
  }

  /**
   * Clicks the sign-in button and expects it to be visible before clicking.
   *
   * @return {Promise<void>} A promise that resolves after the button is clicked
   */
  async clickSignInButton() {    
    
    await this.page.waitForTimeout(2000);
    await this.signInLink.click(),  
    logger.info("Click on the SignIn link")
    
    await expect(this.page).toHaveTitle(/Sciensus Healthcare Portal/);
    logger.info("Portal User navigate to the Login Page");     
  
  }

  

}
