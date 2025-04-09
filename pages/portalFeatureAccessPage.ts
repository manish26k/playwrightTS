import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { CommonLocators } from './CommonLocators';


export class PortalAccessPage{
    private page: Page;
    private clickContinueButton: string;
    private selectedCheckBox : (webroles : string) => Locator;
    private subOptions: string[];


    constructor(page: Page){
        this.page = page;
        this.clickContinueButton = '#ContinueButton';
        this.subOptions = ['ul.authBox > li:nth-child(1)', 'ul.authBox > li:nth-child(2)'];
        //this.SelectedCheckBox = 'label[for="basic"]';
        this.selectedCheckBox =(webroles) => this.page.locator(`label[for="${webroles}"]`);
        
        
    }
    
    /*Click on the checkbox*/
    async clickCheckBox(webrole: string){
        await this.selectedCheckBox(webrole).click();
    }

    /*Check by default checkbox is checked*/
    async isBasicPortalAccessChecked(checkbox: string){
        return await this.page.getByLabel(checkbox).isChecked();
    }

    /*Check Continue button enabled or disabled*/
    async isContinueButtonEnabled(){
        return await this.page.isEnabled(this.clickContinueButton);
    }

    /*Click on the Continue button */
    async continueButtonClick(){
        await this.page.click(this.clickContinueButton);
    }

    /*Verify options displayed in the Basic Portal Access */
    async areSubOptionsVisible(){
        return Promise.all(this.subOptions.map(selector => this.page.isVisible(selector)));
    }

    /* verify the Page Heading */
    async verifyPageHeading(expectedHeading: string){
        const heading = await this.page.textContent(CommonLocators.verifyPageHeadingName);
        return heading === expectedHeading;
    }

     /* verify the Page Instruction Text */
      async getInstructionText(){
         const text = await this.page.textContent(CommonLocators.instructionText);
         return text?.replace(/\s+/g, ' ').trim(); //Normalize whitespace
        
    }


    




}