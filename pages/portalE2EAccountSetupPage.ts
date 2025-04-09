import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { CommonLocators } from './CommonLocators';

export class E2EPortalAccountRegistration{
    private page: Page;
    private thankYouMessage: Locator;

    constructor(page: Page){
        this.page = page;
        this.thankYouMessage = this.page.locator('.container>.row:nth-child(1)>.col-md-6');
    }

    /*Registration Complete-Thank You Message */
    async getRegistrationFinishMessage(){
        return await this.thankYouMessage.textContent();
    }

    /*Click-Continue Button*/
    async clickContinueButton(){
        await this.page.click(CommonLocators.continueButton);
        
    }

    /* verify the Page Heading */
    async verifyPageHeading(expectedHeading: string){
        const heading = await this.page.textContent(CommonLocators.verifyPageHeadingName);
        return heading === expectedHeading;
    }
}