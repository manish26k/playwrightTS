import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { CommonLocators } from './CommonLocators';

export class ChooseHospitalPage{
    private page: Page;
    private RadioSelected: string;
    private hospitalListCheckbox: string;
    private previousButton: string;
    private nextButton: string;
    private tableEnteries: string;
    private nameHeader: string;
    private continueButton: string;


    constructor(page){
        this.page = page;
        this.RadioSelected = 'input[id="prescription"]';
        this.hospitalListCheckbox = 'input[type="checkbox"]';
        this.previousButton = '#records_previous';
        this.nextButton = '#records_next';
        this.tableEnteries = '#records tbody tr';
        this.nameHeader = '//*[@id="records"]/thead/tr/th[1]';
        this.continueButton = '//*[@id="ContinueButton"]';
    }

    /* Verify Continue button Disabled*/
    async isContinueButtonDisabled(){
        //await this.page.waitForLoadState("networkidle");
        //await this.page.waitForSelector(this.continueButton);
        await this.page.isDisabled(this.continueButton);
    }

    /* Verify Continue button Enabled*/
    async isContinueButtonEnabled(){
        await this.page.isEnabled(this.continueButton);
    }

    /* Click- Continue button*/
    async clickContinue(){
        await this.page.click(this.continueButton);
    }


    /* Selecteing Restricted Hospitals Radio Button */
    async selectRestrictedHospitalRadioButton(){
        await this.page.click(this.RadioSelected);
    }

    /* get checkbox */
    async getCheckboxes() {
        return this.page.$$(this.hospitalListCheckbox);
    }

    /* selecting checkboxes of the hospital list name*/
    async selectHospitalListCheckbox(index: number){
        const checkboxes = await this.getCheckboxes();
        await checkboxes[index].check();
    }

    /* deselecting checkboxes of the hospital list name*/
    async deselectHospitalListCheckbox(index: number){
        const checkboxes = await this.getCheckboxes();
        await checkboxes[index].uncheck();
    }

     /* Verify checkbox is Checked*/
    async isCheckboxChecked(index: number) {
        const checkboxes = await this.getCheckboxes();
        return checkboxes[index].isChecked();
    }

    /* Table Entries Count*/
    async countTableEntries(){
        return await this.page.$$(this.tableEnteries);
    }
   
    /* Checking Previous Button Disbale*/
    async isPreviousButtonDisabled() {
        return await this.page.isDisabled(this.previousButton);
      }
    
    /* Checking Next Button Disbale*/
    async isNextButtonDisabled() {
        return await this.page.isDisabled(this.nextButton);
      }

    /* Click on Name header*/
    async clickNameHeader(){
        await this.page.click(this.nameHeader);
    } 
    
    /* Sorting hospital List Name*/
    async getNameHeaderSortOrder(){
        return await this.page.getAttribute(this.nameHeader, 'aria-sort');
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