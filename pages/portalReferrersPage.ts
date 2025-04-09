import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { CommonLocators } from './CommonLocators';


export class PortalReferrerPage{
    private page: Page;

    constructor(page: Page){
        this.page = page;
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

    /*Select- Restricted Referral Radio Button*/
    async selectRestrictedReferralRadioButton(){
        await this.page.click(CommonLocators.restrictedRadioButton);
    }

    /*get checkboxes*/
    async getCheckboxes(){
        return this.page.$$(CommonLocators.restrictedcheckboxes);
    }

    /*Select- Portal referral */
    async selectReferralListCheckboxes(index: number){
        const checkbox = await this.getCheckboxes();
        await checkbox[index].check();
    }

    /*verify- Portal referral Checkbox*/
    async isCheckboxChecked(index: number) {
        const checkboxes = await this.getCheckboxes();
        return checkboxes[index].isChecked();
    }

    /*Grid Table Entries Count*/
    async gridTablEntries(){
        const entries = await this.page.$$(CommonLocators.tableEntries);
        return entries.length;
        
    }

    /* Checking Previous Button Disbale*/
    async isPreviousButtonDisabled() {
        return await this.page.isDisabled(CommonLocators.previousButton);
    }
    
    /* Checking Next Button Disbale*/
    async isNextButtonDisabled() {
        return await this.page.isDisabled(CommonLocators.nextButton);
    }

    /* Click on Name header*/
    async clickNameHeader(){
        await this.page.click(CommonLocators.tableHeader);
    } 
    
    /* Sorting hospital List Name*/
    async getNameHeaderSortOrder(){
        return await this.page.getAttribute(CommonLocators.tableHeader, 'aria-sort');
    }

    /* Click-Continue Button*/
    async clickContinueButton(){
        await this.page.click(CommonLocators.continueButton);
    }
}