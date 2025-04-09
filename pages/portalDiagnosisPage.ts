import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { CommonLocators } from './CommonLocators';


export class PortalDiagnosisPage{
    private page: Page;
    private fillSearchBox: Locator;
    private searchRecord: string;
    private noSearchRecordMessage: string;

    constructor(page: Page){
        this.page = page;
        this.fillSearchBox = this.page.locator('input[type="search"]');
        this.searchRecord = '//*[@id="records"]/tbody';
        this.noSearchRecordMessage = 'td.dataTables_empty';
        
        
    }

    /* verify the Page Heading */
    async verifyPageHeading(expectedHeading: string){
        const heading = await this.page.textContent(CommonLocators.verifyPageHeadingName);
        return heading === expectedHeading;
        //return heading ? heading.replace(/\s+/g, ' ').trim() : '';
    }

     /* verify the Page Instruction Text */
      async getInstructionText(){
         const text = await this.page.textContent(CommonLocators.instructionText);
         return text?.replace(/\s+/g, ' ').trim(); //Normalize whitespace        
    }

    /* Selecteing Restricted Diagnosis Radio Button */
    async selectRestrictedDiagnosisRadioButton(){
        await this.page.click(CommonLocators.restrictedRadioButton);
    }

    /* get checkbox */
    async getCheckboxes() {
        return this.page.$$(CommonLocators.restrictedcheckboxes);
    }

    /* selecting checkboxes from the Diagnosis list name*/
    async selectDiagnosisListCheckbox(index: number){
        const checkboxes = await this.getCheckboxes();
        await checkboxes[index].check();
    }

    /* Verify checkbox is Checked*/
    async isCheckboxChecked(index: number) {
        const checkboxes = await this.getCheckboxes();
        return checkboxes[index].isChecked();
    }

    /* Table Entries Count*/
    async countTableEntries(){
        return await this.page.$$(CommonLocators.tableEntries);
    }

    /* Checking Previous Button Disbale*/
    async isPreviousButtonDisabled() {
        return await this.page.isDisabled(CommonLocators.previousButton);
    }
    
    /* Checking Next Button Disbale*/
    async isNextButtonDisabled() {
        return await this.page.isDisabled(CommonLocators.nextButton);
    }

    /* Click on Diagnosis header*/
    async clickDiagnosisGroupHeader(){
        await this.page.click(CommonLocators.tableHeader);
    } 

    /* Sorting Diagnosis List Name*/
    async getDiagnosisGroupSortOrder(){
        return await this.page.getAttribute(CommonLocators.tableHeader, 'aria-sort');
    }

    /* Click- Continue button*/
    async clickContinue(){
        await this.page.click(CommonLocators.continueButton);
    }

    /*******Search Functions********************/
    
    /*Enter Search text*/
    async enterSearchText(text: string){
        await this.fillSearchBox.fill(text);
        
    }

    /* Get Table Count */
    async getTableCount(){
        return this.page.locator(this.searchRecord).count();

    }

    /*Search Result - For Valid Search*/
    async getSearchResults(){
        
        return this.page.$$eval(this.searchRecord , rows => rows.map(row => row.textContent?.trim() || ''));
    }
    
    /*Retain Text- Search Input*/
    async getSearchInputValue(){
        return this.fillSearchBox.inputValue();
    }

     /*Clear Text- Search Input*/
     async clearSearchText(){
        await this.fillSearchBox.fill('');

     }

     /*Select- Single checkbox*/
     async selectSingleRestrictedCheckbox(){
        await this.page.check(CommonLocators.restrictedcheckboxes);
     }

     /*Verify Text- no search records found*/
     async ischeckNoRecordsMessage(){
        await this.page.waitForSelector(this.noSearchRecordMessage);
        const gridText = await this.page.textContent(this.noSearchRecordMessage);
        return gridText?.includes('No matching records found') ?? false;
     }

     async resultUpdateWait(){
        await this.page.waitForTimeout(600);
     }




     











}