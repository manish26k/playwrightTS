import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { faker } from '@faker-js/faker/locale/en';


test.describe("Authorise Access to Portal Features Functionality", () => {
    
    test("Choosing WebRoles For the Portal - Authorise Access to Portal Page " , async ({ loginPage, homePage, homecareportalpage, administeraccountspage,addnewuseraccountspage,portalaccesspage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.clickOnHomeScreenButton("Administer Accounts");
        await administeraccountspage.clickAddNewUserButton();  

        // Using Faker to generate random data
        const fName = faker.person.firstName();
        const lName = faker.person.lastName();
        const newEmail = faker.internet.exampleEmail();

        //Enter FirstName LastName and Email
        await addnewuseraccountspage.enterFirstName(fName);
        await addnewuseraccountspage.enterLasteName(lName);
        await addnewuseraccountspage.enterEmail(newEmail);        

        //Click - Verify Email Button
        await addnewuseraccountspage.clickVerifyEmail();     
        //Click- Continue Button
        await addnewuseraccountspage.clickContinue();

        //Validate the Basic Portal Access - Suboptions defined in instruction box
        const portalInstructionText = await portalaccesspage.areSubOptionsVisible();
        portalInstructionText.forEach(text => expect(text).toBe(true));

        //Validate the Page Heading Text
        const expectedHeading = "Authorise Access to Portal Features.";
        const headingText = await portalaccesspage.verifyPageHeading(expectedHeading);
        console.log(`Page Heading Text : ${headingText}`);
        expect.soft(headingText).toBe(true);

        //Validate the Instruction Text
        const expectedInstructionText = "Please select the features that the person will be authorised to use in Portal. You must select at least one feature. Click the Continue button to proceed.";
        const normalizedInstructionText = expectedInstructionText.replace(/\s+/g, ' ').trim();
        const instructionText = await portalaccesspage.getInstructionText();
        console.log(`Instruction Text : ${instructionText}`);
        expect.soft(instructionText).toBe(normalizedInstructionText)

        //Verify By default- Basic Portal Access checkbox selected
        const isSelected = await portalaccesspage.isBasicPortalAccessChecked("Basic Portal Access");
        expect(isSelected).toBe(true);
        if(isSelected){
            //Verify Continue button is enabled
            const isEnabled = await portalaccesspage.isContinueButtonEnabled();
            expect(isEnabled).toBe(true);

            //Click on the Continue button
            await portalaccesspage.continueButtonClick();
        }
        else{
            //Click in any of the webrole checkbox
            await portalaccesspage.clickCheckBox("financial-management");
            //Click on the Continue button
            await portalaccesspage.continueButtonClick();

        }

        

        


        

    })
})