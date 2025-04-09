import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { FileHelper } from '../utils/FileHelper';


test.describe("Portal Administer Accounts- Edit User Accounts Functionality", () => {

    test("Edit User Accounts Functionlaity", async ({ loginPage, homePage, homecareportalpage, administeraccountspage, edituserpage }) => {
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.clickOnHomeScreenButton("Administer Accounts");
        await administeraccountspage.clickEditUserButton();
        /*Enter- Search Text*/
        await edituserpage.entersearchText("manish");
        const results = await edituserpage.getFilteredResults();
        const resultsCount = await results.count()

        expect.soft(resultsCount).toBeGreaterThan(0);
        for (let i = 0; i < resultsCount; i++) {
            const resultText = await results.nth(i).innerText();
            expect.soft(resultText.toLowerCase()).toContain("manish".toLowerCase());
        }

        const intialData = await FileHelper.readData();

        //Select- 2nd Row
        const secondRow = await edituserpage.tableRows.nth(2);

        //Before Click Edit button Fetch from 2nd row- First Name , Last Name
        const currentData = await edituserpage.getRowData(secondRow);
        console.log(`Portal User First Name: ${currentData.firstname}`);
        console.log(`Portal User Last Name: ${currentData.lastname}`);

        intialData.currentData = currentData;
        FileHelper.writeData(intialData);

        //Edit Updated User Info- First Name and Last Name
        const newFirstName = 'Playwright';
        const newLastName = 'Automation';

        //Click- Edit button and Updated the User info
        await edituserpage.editRowData(secondRow, newFirstName, newLastName);

        //Click Again- Edit User Accounts Button
        await administeraccountspage.clickEditUserButton();
        await edituserpage.entersearchText("manish");

        //After Edited User Info Fetch from 2nd row- First Name, Last Name
        const updatedData = await edituserpage.getRowData(secondRow);
        console.log(`Portal User Updated First Name: ${updatedData.firstname}`);
        console.log(`Portal User Updated Last Name: ${updatedData.lastname}`);

        intialData.updatedData = updatedData;
        FileHelper.writeData(intialData);
        expect.soft(updatedData.firstname).toBe(newFirstName);
        expect.soft(updatedData.lastname).toBe(newLastName);


    }) 

    


})

