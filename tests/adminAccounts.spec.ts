import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { faker } from '@faker-js/faker/locale/en';

test.describe("Administer Accounts Pages Functionality", () => {
    
    test.skip("Click Add New User Account Button -Administer Accounts Page" , async ({ loginPage, homePage, homecareportalpage, administeraccountspage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.clickOnHomeScreenButton("Administer Accounts");
        await administeraccountspage.verifyAdministerAccountHeading();
               

    })

    test("Enter New User Info in Portal -Add New Portal User Page" , async ({ loginPage, homePage, homecareportalpage, administeraccountspage,addnewuseraccountspage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.clickOnHomeScreenButton("Administer Accounts");
        await administeraccountspage.clickAddNewUserButton();
        


        //Verify the Instruction Text - New Portal User Page
        const instructionText = await addnewuseraccountspage.getInstructionText();
        console.log("Add New Portal User --- Instruction Text"+ "====>"+ instructionText);
        expect.soft(instructionText).toBe('Please Enter the details below and then click on Continue.');

        /*Validate the Instruction Text is Visible
        const isInstructionTextVisible = await addnewuseraccountspage.isInstructionTextVisible();
        expect(isInstructionTextVisible).toBeTruthy();*/
        
        
        //Verify Heading Page Name
        const headingText = await addnewuseraccountspage.getHeadingText();
        console.log("Heading Text ----Add New Portal User"+ "====>"+ headingText);
        expect.soft(headingText?.trim()).toBe('Add New Portal User.');

        //Validate Email and Continue button disabled
        expect.soft(await addnewuseraccountspage.isVerifyEmailButtonDisabled()).toBeTruthy();
        expect.soft(await addnewuseraccountspage.isVerifyContinueButtonDisabled()).toBeTruthy();

        //Verify First Name - Required field
        const isFirstNameVisible =  await addnewuseraccountspage.isRequiredFirstNameFieldValidator();
        expect.soft(isFirstNameVisible).toBeTruthy();

        //Verify the FirstName Text Box Tooltip text
        await addnewuseraccountspage.hoverOverFirstNameField();
        const tooltip = await addnewuseraccountspage.getFirstNameFieldToolTip();
        expect.soft(tooltip).toBe('First Name is a required field.');


        // Using Faker to generate random data
        const fName = faker.person.firstName();
        const lName = faker.person.lastName();
        const newEmail = faker.internet.exampleEmail();

        //Enter FirstName LastName and Email
        await addnewuseraccountspage.enterFirstName(fName);
        await addnewuseraccountspage.enterLasteName(lName);
        await addnewuseraccountspage.enterEmail(newEmail);

        //Validate Verify Email now Enabled
        const isVerifyEmailButtonEnabled = await addnewuseraccountspage.isVerifyEmailButtonEnabled();
        expect.soft(isVerifyEmailButtonEnabled).toBe(true);

        //Click - Verify Email Button
        await addnewuseraccountspage.clickVerifyEmail();



         //Wait and Validate Button Name Changed : Verify Email---> Email Verified
        await addnewuseraccountspage.waitForEmailVerifiedText();          
        const emailVerifiedText = await addnewuseraccountspage.getVerifiedButtonText();
        expect.soft(emailVerifiedText).toContain('Email Verified');

        
        //Validate Continue Button now Enabled
        const isContinueButtonEnabled = await addnewuseraccountspage.isVerifyContinueButtonEnabled();
        expect.soft(isContinueButtonEnabled).toBe(true);

        //Click- Continue Button
        await addnewuseraccountspage.clickContinue();       

    })


    
})