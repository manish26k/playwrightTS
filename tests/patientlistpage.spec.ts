import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';



test.describe("Sciensus Portal- Patients List Page Functionality", () => {

    test.beforeEach(async ({ homePage, loginPage, homecareportalpage}) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.clickOnHomeScreenButton("Patients List");

    });
    test.afterEach(async ({ page}) =>{
        await page.close();
    });

    test.skip("Verify Referral Status Options - Active,onHold,Finished ", async ({ patientslistpage }) => {
        const expectedOptions = ['Active', 'Finished', 'On Hold'];
        const actualOptions = await patientslistpage.getStatusDropDownOptions();
        console.log("Referral Status Options are: "+ "------->"+ actualOptions);        
        expect.soft(expectedOptions).toEqual(actualOptions);

    });

    test.skip("Select Referral Status - Active Option ", async ({ patientslistpage }) => {
        await patientslistpage.selectStatusOption("Active");
        await patientslistpage.validateReferralStatusResults("Active");    

    });  

    test.skip("Select Service - Ajovyy Option ", async ({ patientslistpage }) => {
        await patientslistpage.selectServiceOption("Ajovyy");
        await patientslistpage.validateServiceResults("Ajovy");    

    });

    test.skip("Select Service and Status  - Active and Ajovyy ", async ({ patientslistpage }) => {
        await patientslistpage.selectStatusOption("Active");
        await patientslistpage.validateReferralStatusResults("Active");

        await patientslistpage.selectServiceOption("Ajovy");    
        await patientslistpage.validateServiceResults("Ajovyy");     

    });
    
    test.skip("Search functionality using- First Name,Hospital Number, NHS number, Diagnosis ", async ({ patientslistpage }) => {
        const inputData = [
            'Julie',
            '5241254',
            '6666566',
            'Hepatitis C'
        ]         
        await patientslistpage.searchAndVerify(inputData);

    });

    test.skip("Edit Patients List- ReadOnly Fields And It's Values", async ({ patientslistpage }) => {
        const inputData = ['Julie']           
        await patientslistpage.searchAndVerify(inputData);
        await patientslistpage.clickEditIcon();

        await patientslistpage.verifyFieldsReadOnly();
        const fieldValues = await patientslistpage.verifyReadOnlyValues();
        console.log('ReadOnly fields Values are:'+"----->"+ fieldValues);

    });

    test("Edit Patients List Date - Proposed Clinic, Actual Clinic, Next Blood Results, Latest Blood Results", async ({ patientslistpage }) => {
        const inputData = ['Julie']           
        await patientslistpage.searchAndVerify(inputData);
        await patientslistpage.clickEditIcon();
        const enteredDate = await patientslistpage.enterProposedClinicDateAndUpdate();

        const enterData = ['Julie']           
        await patientslistpage.searchAndVerify(enterData);
        await patientslistpage.verifyPorposedClinicDate(enteredDate);

       

    });

    test.only("Edit Patients List - link is correctly highlighted or underlined", async ({ patientslistpage }) => {
        const inputData = ['Julie']           
        await patientslistpage.searchAndVerify(inputData);
        const isLinkHighlighted = await patientslistpage.isPatientLinkHighlighted();
        expect.soft(isLinkHighlighted).toBe(true);

        await patientslistpage.clickPatientReferralNumber();
    
            

    });
    

    


})