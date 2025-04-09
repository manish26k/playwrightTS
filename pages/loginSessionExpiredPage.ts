import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';


export class LoginSessionExpiredPage {
    private page: Page;
    private enterEmailAddress: Locator;
    private clickVerifyButton: Locator;
    private expireWrapperHeading: Locator;
    private expireSessionMessage: Locator;

    constructor(page){
        this.page= page;
        this.enterEmailAddress = this.page.locator("//input[@id='emailaddress1']");
        this.clickVerifyButton = this.page.locator('#exitButton');
        this.expireWrapperHeading = this.page.locator(".portHeading");
        this.expireSessionMessage = this.page.locator(".portal-desc");
    }

    async enterEmail(email){
        await this.enterEmailAddress.fill(email);
        logger.info("Enter Email in the Session Expired Page");
        
    }

    async clickVerify(){
        await this.clickVerifyButton.click();
        logger.info("Click on the Verify button");
    }

    async verifySessionExpired(heading, message) {
        await expect(this.expireWrapperHeading).toBeVisible()
        await expect(this.expireWrapperHeading).toHaveText(heading)
        await expect(this.expireSessionMessage).toHaveText(message) 
    }
};