import { expect, Page, Locator } from '@playwright/test';

export class TermsAndConditionPage{
    private page: Page;
    private termsAndCondition: string;
    private portalMessage: string;
    private welcomeMessage: string;
    private agreementList: Locator;
    private cancelButton: string;
    private proceedButton: string;

    constructor(page: Page){
        this.page = page;
        this.termsAndCondition = 'div.col-md-12 > h2';
        this.welcomeMessage = 'div.col-md-12>p';
        this.agreementList = this.page.locator('div.col-md-12>ul');
        this.portalMessage = 'div.col-md-12 > h4:nth-of-type(1)';
        this.cancelButton = "(//*[@id='NextButton'])[1]";
        this.proceedButton = "(//*[@id='NextButton'])[2]";
    }

    async getTermsHeadingText() {
        return this.page.textContent(this.termsAndCondition);
    }

    async getPortalMessage() {
        return this.page.textContent(this.portalMessage);
    } 
    
    async getWelcomeMessage() {
        return this.page.textContent(this.welcomeMessage);
    }

    async getAgreementList() {
        return this.agreementList;
    }

    async getAgreementText(index:number){
        const agreements = await this.getAgreementList();
        return agreements.nth(index).textContent();
    }

    async clickCancelButton() {
        await this.page.click(this.cancelButton);
    }

    async clickProceedButton() {
        await this.page.click(this.proceedButton);
    }


    async selectTermsConditionButtonType(buttonType: 'Cancel' | 'Proceed'){
        switch(buttonType){
            case 'Cancel':
                await this.page.click(this.cancelButton);
                await this.page.waitForTimeout(500);
                break;
            case 'Proceed':
                await this.page.click(this.proceedButton);
                await this.page.waitForTimeout(500);
                break;






        }

    }
}