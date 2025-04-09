import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';



export class ViewPatientEnquiries extends BasePage{ 
  
        readonly contactUS: string = 'aContactUs';
        readonly enquiryCategory: string = 'mzk_enquirycategory';
        readonly EnquiryType: string = '#mzk_enquirycategory';
        readonly enquirySubject: string = 'subject';
        readonly enquiryDetails: string = 'mzk_description';
        readonly submitButton: string = 'InsertButton';
        readonly Enq_patientHospitalNumber: string = 'hospitalreferencenumber';
        readonly searchButton: string = 'btnSearch';
        readonly clearSearchButton: string = 'btnClearSearch';
        readonly Enq_subjectInTable: string = '(//*[@id="tbodyid"]/tr[1]/td)[2]';
        readonly Enq_DesriptionInTable: string = '(//*[@id="tbodyid"]/tr[1]/td)[3]';
        readonly continueButton: string = 'btncont';
        readonly logo: string = 'a.homelink img';
        readonly Enq_searchTextBox: string = 'search';
       
    

    getElementById(id: string): Locator {
        return this.page.locator(`//*[@id='${id}']`);
    }

      // Method to get a dynamic locator by type
    getElementByType(type: string): Locator {
        return this.page.locator(`//*[@type='${type}']`);
    }

    async enterTextByType(type: string, text: string): Promise<void> {
        const locator = this.getElementByType(type);
        await locator.fill(text);
    }

    
    async clickElement(id: string): Promise<void> {
        const element = this.getElementById(id);
        await element.click();
    }

    async clickContactUs(): Promise<void>{
        await this.clickElement(this.contactUS);
    }

    async clickSubmitButton(): Promise<void>{
        await this.clickElement(this.submitButton);
    }

    async clickEnquiryCategory(): Promise<void>{
        await this.clickElement(this.enquiryCategory);
    }

    async selectEnquiryType(option:string): Promise<void>{
        await this.selectDropdownOption(this.EnquiryType, option)
    }

    
    // Method to enter text into a text box
    async enterTextIntoTextBox(id: string, text: string): Promise<void>{
        const textBox = this.getElementById(id);
        await textBox.fill(text);
    }

    async enterSubject(text: string){
        await this.enterTextIntoTextBox(this.enquirySubject, text);

    }

    async enterDetails(text: string){
        await this.enterTextIntoTextBox(this.enquiryDetails, text);
    }

    async enterEnquiryPatientHospitalNumber(text: string){
        await this.enterTextIntoTextBox(this.Enq_patientHospitalNumber, text);
        await this.page.waitForTimeout(2000);
    }

    async clickEnquirySearchButton(){
        await this.clickElement(this.searchButton);
        
    }

    async enterEnquirySearchText(text: string){
        await this.enterTextByType(this.Enq_searchTextBox, text);
    }

    async clickEnquiryClearSearchButton(){
        await this.clickElement(this.clearSearchButton);
    }

    async getEnquirySubjectText(): Promise<string> {
        const text = await this.page.textContent(this.Enq_subjectInTable);
        return text ?? '';
    }

    async getEnquiryDescriptionText(): Promise<string>{
        const text = await this.page.textContent(this.Enq_DesriptionInTable);
        return text ?? '';
    }

    async clickContinueButton(){
        await this.clickElement(this.continueButton);
    }

    async clickSciensusLogo(){
        await this.page.click(this.logo);
    }

    

    





}