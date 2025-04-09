import { Page, expect , Locator } from '@playwright/test';
import { getRandomDate, format}  from '../utils/dateUtils'

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async selectDropdownOption(locator: string, value: string): Promise<void> {
        await this.page.locator(locator).selectOption(value);
    }

    
    async validateTableResults(locator: string, expectedText: string): Promise<void>{
        const rows: Locator = this.page.locator(locator);
        const rowCount = await rows.count();
        for(let i=0; i< rowCount;i++){
            await expect.soft(rows.nth(i)).toHaveText(expectedText);
        }
    }

    async getDropdownOptions(locator: string): Promise<string[]>{
        return await this.page.locator(`${locator} option`).allTextContents();
    }

    async SearchText(locator: string, text: string): Promise<void>{
        await this.page.fill(locator,text);
        await this.page.press(locator, 'Enter');
    }

    async getSearchedTextFromTableRows(locator:string): Promise<string[]>{
        return await this.page.locator(locator).allTextContents();        
    }

    async clickElement(locator: string):Promise<void>{
        await this.page.locator(locator).click();
    }

    async isFieldsInputReadOnly(locator: string): Promise<boolean> {
        const readonly = await this.page.locator(locator).getAttribute('readonly');
        return readonly!== null;

    }

    async getReadOnlyFieldValue(locator: string){
        return await this.page.locator(locator).inputValue();
    }

    async getFieldsReadOnly(locators: string[]): Promise<void>{
        for(const locator of locators){
            const isReadOnly = await this.isFieldsInputReadOnly(locator);
            if(!isReadOnly){
                throw new Error(`The input field with locator ${locator} is not readonly.`);
            }
        }
    }


    async getReadsOnlyValue(locators: string[]): Promise<string[]>{
        const values: string[] = [];
        for(const locator of locators){
            const value = await this.getReadOnlyFieldValue(locator);
            values.push(value);

        }
        return values;
    }

    async getElementsValues(locators: string[]): Promise<string[]> {
        return Promise.all(locators.map(locator => this.getReadOnlyFieldValue(locator)));
    }


    async enterDate(locator: string): Promise<string>{
        const randomDate = getRandomDate();
        //await this.page.fill(locator, '');
        await this.page.fill(locator,randomDate);
        return randomDate;
    }

    async verifyUpdatedDate(tableLocator: string , expectedDate: string): Promise<void>{
        await this.page.waitForTimeout(3000);
        await this.page.waitForSelector(tableLocator);
        const updatedDate = await this.page.innerText(tableLocator);

        const [year, month, day] = expectedDate.split('-');
        const formattedExpectedDate = `${day}/${month}/${year}`;

        
        if (updatedDate !== formattedExpectedDate) {
            throw new Error(`The entered date is not correct. Expected: ${formattedExpectedDate}, Found: ${updatedDate}`);
          } else {
            console.log(`The entered date is correct. Expected: ${formattedExpectedDate}, Found: ${updatedDate}`);
          }
    }




     // Generic method to click an element using a string locator or Locator
     async clickElement01(locator: string | Locator): Promise<void> {
        if (typeof locator === 'string') {
            await this.page.locator(locator).click();
        } else {
            await locator.click();
        }
    }

    // Generic method to search text using a string locator or Locator
    async searchText(locator: string | Locator, text: string): Promise<void> {
        if (typeof locator === 'string') {
            await this.page.fill(locator, text);
            await this.page.press(locator, 'Enter');
        } else {
            await locator.fill(text);
            await locator.press('Enter');
        }
    }

    getElementById(id: string): Locator {
        return this.page.locator(`//*[@id='${id}']`);
    }

    async clickElementOnPage(id: string): Promise<void> {
        const element = this.getElementById(id);
        await element.click();
    }

    getElementByType(type: string): Locator {
        return this.page.locator(`//*[@type='${type}']`);
    }

    async enterSearchText(type: string, text: string): Promise<void> {
        const locator = this.getElementByType(type);
        await locator.fill(text);
    }

    


    



}
