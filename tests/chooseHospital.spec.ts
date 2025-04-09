import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { faker } from '@faker-js/faker/locale/en';


test.describe("Authorise Access to Portal Features Functionality", () => {
    
    test("Choosing Hospital For the Portal User- Choose Hospital Page " , async ({ loginPage, homePage, homecareportalpage, administeraccountspage,addnewuseraccountspage,portalaccesspage, choosehospitalpage }) =>{
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
        await addnewuseraccountspage.clickVerifyEmail();   
        await addnewuseraccountspage.clickContinue();

        

        // Portal WebRoles Access Page
        await portalaccesspage.clickCheckBox("financial-management");
        await portalaccesspage.continueButtonClick();

        //Choose Hospital For Portal User Page

        //Validate the Page Heading Text
        const expectedHeading = "Choose the Hospitals That This User Can View.";
        const headingText = await choosehospitalpage.verifyPageHeading(expectedHeading);
        console.log(`Page Heading Text : ${headingText}`);
        expect.soft(headingText).toBe(true);

        //Validate the Instruction Text
        const expectedInstructionText = "Please select the hospitals that the person will be authorised to view in the Portal. You must select at least one hospital. Click the Continue button to proceed.";
        const normalizedInstructionText = expectedInstructionText.replace(/\s+/g, ' ').trim();
        const instructionText = await choosehospitalpage.getInstructionText();
        console.log(`Instruction Text : ${instructionText}`);
        expect.soft(instructionText).toBe(normalizedInstructionText)

        // Selecting Restricted Hosital Radio Button
        await choosehospitalpage.selectRestrictedHospitalRadioButton();

        // Hospital List Entries- Count
        const entries = await choosehospitalpage.countTableEntries();
        expect.soft(entries.length).toBe(5);


        //const isDisabled = await choosehospitalpage.isContinueButtonDisabled();
        //expect.soft(await choosehospitalpage.isContinueButtonDisabled()).toBe(true);

        // Verify Prev and Next Button Enabled an Disabled
        const isPrevDisabled = await choosehospitalpage.isPreviousButtonDisabled();
        const isNextDisbaled = await choosehospitalpage.isNextButtonDisabled();
        expect.soft(isPrevDisabled).toBe(true);
        expect.soft(isNextDisbaled).toBe(true);


        // Clicking the Rstericted Checkboxes one by one in grid
        const checkbox = await choosehospitalpage.getCheckboxes();
        for( let i = 0; i < checkbox.length; i++){
            await choosehospitalpage.selectHospitalListCheckbox(i);
            expect.soft(await choosehospitalpage.isCheckboxChecked(i)).toBeTruthy();
        }

        /*for( let i = 0; i < checkbox.length; i++){
            await choosehospitalpage.deselectHospitalListCheckbox(i);
            expect(await choosehospitalpage.isCheckboxChecked(i)).toBeFalsy();
        }*/

        /*sort column in ascending order
        await choosehospitalpage.clickNameHeader();
        const sortOrder = await choosehospitalpage.getNameHeaderSortOrder();
        expect(sortOrder).toBe('ascending');*/

        //sort column in descending order. By deafult = Ascending Order
        await choosehospitalpage.clickNameHeader(); // first sort - descending
        await choosehospitalpage.clickNameHeader(); // second sort - ascending
        await choosehospitalpage.clickNameHeader(); //thrid sort - descending
        const hospitalListOrder = await choosehospitalpage.getNameHeaderSortOrder();
        expect.soft(hospitalListOrder).toBe('descending');

        //Click-Continue button
        await choosehospitalpage.clickContinue();
  

    })
})