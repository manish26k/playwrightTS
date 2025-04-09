import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { BasePage } from './basePage';


export class SearchPortalPatient extends BasePage{
   
    private searchButtonLocator: string = '//*[@id="btnSearch"]';
    private clearSearchButtonLocator: string = "//*[@id='btnClearSearch']";
    private searchTextBoxLocator: string = "//*[@type='search']";
    private showMoreButtonLocator: string = '//*[@id="tbodyid"]/tr/td[15]/input';

    get searchButton(): Locator {
        return this.page.locator(this.searchButtonLocator);
    }

    get clearSearchButton(): Locator{
        return this.page.locator(this.clearSearchButtonLocator);
    }

    get searchTextBox(): Locator {
        return this.page.locator(this.searchTextBoxLocator);
    }

    private formatDate(date: string): string {
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day}`;
    }






    getElementById(id: string): Locator{
        return this.page.locator(`//*[@id='${id}']`);
    }

    getElementByType(type: string): Locator {
        return this.page.locator(`//*[@type='${type}']`);
    }

    async enterValue(id: string, value: string){
        const element = this.getElementById(id);
        const inputType = await element.getAttribute('type');
        if(inputType === 'date'){
            value = this.formatDate(value);
        }
        await element.fill(value);
        await this.page.waitForTimeout(500);
    }

    async clickSearchButton(): Promise<void>{
        //await this.clickElement01(this.searchButtonLocator); //string locator
        await this.clickElement01(this.searchButton); //LOcator
           
    }

    async clickClearSearchButton(): Promise<void>{
        await this.clickElement01(this.clearSearchButtonLocator);
        await this.page.waitForTimeout(500);
    }

    async enterSearchText(text: string): Promise<void> {
        await this.searchText(this.searchTextBox, text);
    }

    async clickShowMoreButton(): Promise<void>{
        await this.clickElement01(this.showMoreButtonLocator);
    }

    

    

}