import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { BasePage } from './basePage';



export class PatientsListPage extends BasePage {

    private statusDropdown: string = '#mzk_status';
    private servicesDropdown: string = '#mzk_services';
    private referralStatusResults: string = '//tbody/tr/td[11]';
    private serviceResults: string = '//tbody/tr/td[9]';
    private searchInput: string = 'input[type="search"]';
    private searchResults: string = '#myTable tbody tr';
    private editIcon: string = 'td a span.glyphicon-pencil';
    private referralNumberReadOnly: string = 'input#refNo';
    private firstNameReadOnly: string = "//*[@id='firstName']";
    private lastNameReadOnly: string = "//*[@id='lastName']";
    private dobReadOnly: string = "//*[@id='dob']";
    private editProposedClinicDate: string = "//*[@id='prclinicDt']";
    private editActualClinicDate: string = "//*[@id='aclinicDt']";
    private editNextBloodResultsDueDate: string = "//*[@id='nxtbloodresults']";
    private editLatestBloodResultsDate: string = "//*[@id='actlbloodresults']";
    private updateProposedClinicDate: string = '//*[@id="tbodyid"]/tr[1]/td[14]';
    private updateActualClinicDate: string = '//*[@id="tbodyid"]/tr[1]/td[15]';
    private updateNextBloodResultsDueDate: string = '//*[@id="tbodyid"]/tr[1]/td[16]';
    private updateLatestBloodResultsDate: string = '//*[@id="tbodyid"]/tr[1]/td[17]';
    private editUpdateButton: string = '#Update';
    private editCancelButton: string = '#cancel';
    private editUploadBloodResults: string = '#UploadBloodResults';
    private patientLinkSelector: string = '//*[@id="tbodyid"]/tr/td[2]';

    async selectStatusOption(value: string): Promise<void>{
        await this.selectDropdownOption(this.statusDropdown, value);
        
    }

    async selectServiceOption(value: string): Promise<void>{
        await this.selectDropdownOption(this.servicesDropdown, value);
    }

    async validateReferralStatusResults(expectedStatus: string): Promise<void>{        
        await this.validateTableResults(this.referralStatusResults, expectedStatus);
    }

    async validateServiceResults(expectedStatus: string): Promise<void>{        
        await this.validateTableResults(this.serviceResults, expectedStatus);
    }

    async getStatusDropDownOptions(): Promise<string[]>{
        return this.getDropdownOptions(this.statusDropdown);

    }


    async enterSearchText(searchText: string): Promise<void>{
        await this.SearchText(this.searchInput,searchText);
    }

    async verifySearchResults(searchText: string): Promise<void>{
        const rows = await this.getSearchedTextFromTableRows(this.searchResults);
        for (const rowText of rows){
            expect.soft(rowText).toContain(searchText);
        }
    }

    async searchAndVerify(inputData: string[]): Promise<void>{
        for (const data of inputData){
            await this.enterSearchText(data);
            await this.verifySearchResults(data);
        }
    }

    async clickEditIcon(): Promise<void>{
        await this.clickElement(this.editIcon);
    }

    async clickPatientReferralNumber(): Promise<void>{
        await this.clickElement(this.patientLinkSelector);
    }

    async getPatientLink(){
        return this.page.locator(this.patientLinkSelector);
    }

    async isPatientLinkHighlighted(){
        return this.page.$eval(this.patientLinkSelector, (el) => window.getComputedStyle(el).textDecoration.includes('underline'));
        
    }

    

    async verifyFieldsReadOnly(): Promise<void>{
        const locators = [
            this.referralNumberReadOnly,
            this.firstNameReadOnly,
            this.lastNameReadOnly,
            this.dobReadOnly
        ];
        await this.getFieldsReadOnly(locators);
    }

    async verifyReadOnlyValues(): Promise<string[]>{
        const locators = [
            this.referralNumberReadOnly,
            this.firstNameReadOnly,
            this.lastNameReadOnly,
            this.dobReadOnly
        ];
        return await this.getElementsValues(locators);
    }

    async enterProposedClinicDateAndUpdate(): Promise<string>{
        const enteredDate = await this.enterDate(this.editProposedClinicDate);
        await this.clickElement(this.editUpdateButton);
        
        return enteredDate;
    }

    async enterActualClinicDateAndUpdate(): Promise<string>{
        const enteredDate = await this.enterDate(this.editActualClinicDate);
        await this.clickElement(this.editUpdateButton);
        return enteredDate;
    }

    async enterNextBloodResultsDueDateAndUpdate(): Promise<string>{
        const enteredDate = await this.enterDate(this.editNextBloodResultsDueDate);
        await this.clickElement(this.editUpdateButton);
        return enteredDate;
    }

    async enterLatestBloodResultsDateAndUpdate(): Promise<string>{
        const enteredDate = await this.enterDate(this.editLatestBloodResultsDate);
        await this.clickElement(this.editUpdateButton);
        return enteredDate;
    }

    async verifyPorposedClinicDate(expectedDate: string): Promise<void>{
        await this.verifyUpdatedDate(this.updateProposedClinicDate, expectedDate);

    }

    
    
}
