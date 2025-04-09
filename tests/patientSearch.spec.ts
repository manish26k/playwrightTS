import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';

test.describe("Sciensus Portal- Patients List Page Functionality", () => {

    test.beforeEach(async ({ homePage, loginPage, homecareportalpage}) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.clickOnHomeScreenButton('Search for a Patient');

    });
    test.afterEach(async ({ page}) =>{
        await page.close();
    });

    test("Patient Search Using- Date of Birth", async ({ searchpatientpage }) => {
        await searchpatientpage.enterValue("dob","01-07-1982");
        await searchpatientpage.clickSearchButton();
        await searchpatientpage.enterSearchText("Will");
        await searchpatientpage.clickShowMoreButton();               

    });

    test("Patient Search Using- Sciensus Patient Account Number", async ({ searchpatientpage }) => {
        await searchpatientpage.enterValue("referralnumber","REF-000200091");
        await searchpatientpage.clickSearchButton();
        await searchpatientpage.clickShowMoreButton();               

    });

    test("Patient Search Using- Patient Hospital Number", async ({ searchpatientpage }) => {
        await searchpatientpage.enterValue("hospitalreferencenumber","5241254");
        await searchpatientpage.clickSearchButton();
        await searchpatientpage.clickShowMoreButton();               

    });

    test("Patient Search Using- NHS / CHI Number", async ({ searchpatientpage }) => {
        await searchpatientpage.enterValue("nhschinumber","6543215");
        await searchpatientpage.clickSearchButton();
        await searchpatientpage.clickShowMoreButton();               

    });

    test.only("Patient Search - Clear Search Functionality", async ({ searchpatientpage }) => {
        await searchpatientpage.enterValue("nhschinumber","6543215");
        await searchpatientpage.clickSearchButton();
        await searchpatientpage.clickClearSearchButton();             

    });



    
    

    


})