import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';

export class AdministerAccountsPage{
    private page: Page;
    private clickAddNewUserAccount: Locator;
    private clickEditUserAccount: Locator;
    private administerHeadingTitle: Locator;

    constructor(page: Page){
        this.page = page;
        this.clickAddNewUserAccount = this.page.locator('a.btnCircularPurple');
        this.clickEditUserAccount = this.page.locator('a.btnCircularGreen');
        this.administerHeadingTitle = this.page.locator('.portHeading');
    }

    async clickAddNewUserButton(){
        await this.clickAddNewUserAccount.click();
        logger.info("Click on the Add New User Account Button");
    }

    async clickEditUserButton(){
        await this.clickEditUserAccount.click();
        logger.info("Click on the Edit User Account Button");
    }

    async verifyAdministerAccountHeading(){
        await expect(this.administerHeadingTitle).toHaveText(/Administer Accounts./);
        logger.info("Verify the Administer Accounts Page heading");
    }

}