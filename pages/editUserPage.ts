import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { CommonLocators } from './CommonLocators';

export class EditUserPage{
    private page: Page;
    private pageTitle: string;
    private searchTextBox: Locator;
    private editButton: Locator;
    private auditlogButton: Locator;
    private updateUserInfoExitAndSaveButton: Locator;
    private updateUserInfoContinueButton: Locator;
    private editUserInfoFirstName: Locator;
    private editUserInfoLastName: Locator;
    private updateUserInfoEmail: Locator;
    private searchInput: Locator;
    private filteredSearchResult: Locator;
    readonly tableRows: Locator;
    private currentPageSelector: string;
    private pageNumberSelector: (pageNumber: number) => string;


    constructor(page: Page){
        this.page = page;
        this.pageTitle = 'div>h2.page-title';
        this.searchTextBox = this.page.locator('//*[@type="search"]');
        this.editButton = this.page.locator('//*[@id="tbodyid"]/tr[1]/td[6]/input[1]');
        this.auditlogButton = this.page.locator('//*[@id="tbodyid"]/tr[1]/td[6]/input[2]');
        this.updateUserInfoExitAndSaveButton = this.page.locator("//*[@id='exitButton']");
        this.updateUserInfoContinueButton = this.page.locator("//*[@id='ContinueButton']");
        this.editUserInfoFirstName = this.page.locator("//*[@id='firstname']");
        this.editUserInfoLastName = this.page.locator("//*[@id='lastname']");
        this.updateUserInfoEmail = this.page.locator("//*[@id='emailaddress1']");
        this.searchInput = this.page.locator('input[type="search"]');
        this.filteredSearchResult = this.page.locator('table#myTable tbody tr');
        this.tableRows = this.page.locator('table#myTable tbody tr');
        this.pageNumberSelector = (pageNumber: number) => `a[data-dt-idx="${pageNumber-1}"]`;
        this.currentPageSelector = 'a.paginate_button.current';
    }
    
    /*Get Page Title Text*/
    async getTitleText(){
        return this.page.textContent(this.pageTitle);
    }

    /*Assert the page title text*/
    async assertTitleIsCorrect(){
        const titleText = await this.getTitleText();
        expect.soft(titleText).toBe('My Portal Users.')
    }

    /*Click- Edit Button*/
    async clickEditButton(){
        await this.editButton.click();
    }

    /*Click- Audit Log button*/
    async clickAuditLogButton(){
        await this.auditlogButton.click();
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

    /*Edit- FirstName*/
    async editFirstName(newFname: string){
        await this.editUserInfoFirstName.fill(newFname);
    }

    /*Edit- LastName*/
    async editLastName(newLname: string){
        await this.editUserInfoLastName.fill(newLname);
    }

    /*Click- Edit and Save Button*/
    async clickEditAndSaveButton(){
        await this.updateUserInfoExitAndSaveButton.click();
    }

    /*Get FirsName*/
    async getFirstNameValue(){
        //await this.editUserInfoFirstName.inputValue();
        await this.editUserInfoFirstName.textContent();

    }

    /*Get LastName*/
    async getLastNameValue(){
        //await this.editUserInfoLastName.inputValue();
        await this.editUserInfoLastName.textContent();
    }

    /*Get- Email and Disbaled*/
    async getEmailValueAndDisbaled(){
        await this.updateUserInfoEmail.inputValue();
        expect.soft(await this.updateUserInfoEmail.isDisabled());
    }

    /*Search Text*/
    async entersearchText(text: string){
        await this.searchInput.fill(text);
        await this.searchInput.press('Enter');
    }

    /*Filtered- Search result*/
    async getFilteredResults(){
        return this.filteredSearchResult;
    }

    /*Get Rows Data before -Click Edit button*/
    async getRowData(row: Locator): Promise<{ firstname: string, lastname: string}>{
        const firstname = await row.locator('td:nth-child(1)').textContent();
        const lastname = await row.locator('td:nth-child(2)').textContent();
        return{ firstname: firstname?.trim() || '', lastname: lastname?.trim() || ''};
    }

    /*Get edited Row After- Updated info*/
    async editRowData(row: Locator, newFirstName: string, newLastName: string){
        const portalEditButton = row.locator('td:nth-child(6) input[value="Edit"]');
        await portalEditButton.click();
        await this.editFirstName(newFirstName);
        await this.editLastName(newLastName);
        await this.updateUserInfoExitAndSaveButton.click();

    }

    async getTableRowData(row: Locator): Promise<any> {
        const columns = await row.locator('td').allInnerTexts();
        return {
          firstName: columns[0],
          lastName: columns[1],
          email: columns[2],
          activeInactive: columns[3],
          elapsed: columns[4]
        };
    }

    async fetchRowData(row: Locator): Promise<any> {
        const columns = await row.locator('td').allInnerTexts();
        return {
          firstName: columns[0],
          lastName: columns[1],
          email: columns[2],
          activeInactive: columns[3],
          elapsed: columns[4]
        };
    }

    async navigateToPaginationPage(pageNumber: number){
        //await this.page.click(this.pageNumberSelector(pageNumber))
        const selector = this.pageNumberSelector(pageNumber);
        await this.page.waitForSelector(selector, {state: 'visible'});

        await this.page.evaluate((selector) =>{
            const element = document.querySelector(selector);
            if(element){
                element.scrollIntoView();
            }
        }, selector);

        await this.page.click(selector , { timeout: 60000 });
    }

    async getCurrentPaginationNumber(){
        const currentPageElement = await this.page.$(this.currentPageSelector);
        return currentPageElement ? parseInt(await currentPageElement.innerText()) : null;
    }


}