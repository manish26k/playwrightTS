import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { faker } from '@faker-js/faker/locale/en';


test.describe("Authorise Access to Portal Features Functionality", () => {
    
    test("Portal Referrer List - Referrer Page " , async ({ loginPage, homePage, homecareportalpage, administeraccountspage,addnewuseraccountspage,portalaccesspage, choosehospitalpage, portaldiagnosispage, patientcategoriespage, portalreferrerpage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.clickOnHomeScreenButton("Administer Accounts");
        await administeraccountspage.clickAddNewUserButton();  

        //Using Faker to generate random data
        const fName = faker.person.firstName();
        const lName = faker.person.lastName();
        const newEmail = faker.internet.exampleEmail();

        //Portal- Add New User Page
        await addnewuseraccountspage.enterFirstName(fName);
        await addnewuseraccountspage.enterLasteName(lName);
        await addnewuseraccountspage.enterEmail(newEmail);
        await addnewuseraccountspage.clickVerifyEmail();   
        await addnewuseraccountspage.clickContinue();        

        //Portal - WebRoles Access Page
        await portalaccesspage.clickCheckBox("financial-management");
        await portalaccesspage.continueButtonClick();

        //Portal- Choose Hospital Page 
        await choosehospitalpage.selectRestrictedHospitalRadioButton();      
        const checkbox = await choosehospitalpage.getCheckboxes();
        for( let i = 0; i < checkbox.length; i++){
            await choosehospitalpage.selectHospitalListCheckbox(i);
            expect.soft(await choosehospitalpage.isCheckboxChecked(i)).toBeTruthy();
        } 
                 
        await choosehospitalpage.clickContinue();

        /****Portal- Choose Diagnosis Group Page*****/         

        //Select- Radio button
        await portaldiagnosispage.selectRestrictedDiagnosisRadioButton(); 
        //Verify the results after valid and invalid search input
        await portaldiagnosispage.enterSearchText("aHUS"); 
        //Select Single checkbox after Search
        await portaldiagnosispage.selectSingleRestrictedCheckbox();
        //Click-Continue Button
        await portaldiagnosispage.clickContinue(); 

       /****Portal- Patient categories Page*****/   

         // Selectand Verify- One Radio Button 
         await patientcategoriespage.selectPatientType('Both');
         expect.soft(await patientcategoriespage.isRadioButtonChecked(patientcategoriespage.adultRadioButton)).toBe(false);
         expect.soft(await patientcategoriespage.isRadioButtonChecked(patientcategoriespage.paediatricRadioButton)).toBe(false);
         expect.soft(await patientcategoriespage.isRadioButtonChecked(patientcategoriespage.bothradioButton)).toBe(true);
       
       // Verify- Continue Button Enabled
       await patientcategoriespage.isContinueButtonEnabled();
 
       // Click- Continue Button
       await patientcategoriespage.clickContinueButton();



       /***Portal Referrer Page**********/
       //Validate the Page Heading text
       const expectHeading = "Choose the Referrers That This User Can View.";
       const headingText= await patientcategoriespage.verifyPageHeading(expectHeading);
       console.log(`Page Heading Text : ${headingText}`);
       expect.soft(headingText).toBe(true); 

       //Validate the Instruction text
       const expectedInstructionText = "Please select the Referrers for the Patients that the person will be authorised to view in the Portal. You must select at least one Referrer or choose All. Click the Continue button to proceed.";
       const normalizedInstructionText = expectedInstructionText.replace(/\s+/g, ' ').trim();
       const instructionText = await patientcategoriespage.getInstructionText();
       console.log(`Instruction Text : ${instructionText}`);
       expect.soft(instructionText).toBe(normalizedInstructionText);

       //Select- View Restricted Radio Button
       await portalreferrerpage.selectRestrictedReferralRadioButton();
       
       //referal List- Count
       const entriesCount = await portalreferrerpage.gridTablEntries();
       expect.soft(entriesCount).toBe(2);

       // Verify Prev and Next Button Enabled an Disabled
       const isPrevDisabled = await portalreferrerpage.isPreviousButtonDisabled();
       const isNextDisbaled = await portalreferrerpage.isNextButtonDisabled();
       expect.soft(isPrevDisabled).toBe(true);
       expect.soft(isNextDisbaled).toBe(true);

       //Click-Restricted Referrer CheckBox One by One
       const referrerCheckbox = await portalreferrerpage.getCheckboxes();
        for( let i = 0; i < referrerCheckbox.length; i++){
            await portalreferrerpage.selectReferralListCheckboxes(i);
            expect.soft(await portalreferrerpage.isCheckboxChecked(i)).toBeTruthy();
        }

        //sort column in descending order. By deafult = Ascending Order
        await portalreferrerpage.clickNameHeader(); // 1st sort - descending
        await portalreferrerpage.clickNameHeader(); // 2nd sort - ascending
        await portalreferrerpage.clickNameHeader(); // 3rd sort - descending
        const referrerListOrder = await portalreferrerpage.getNameHeaderSortOrder();
        expect.soft(referrerListOrder).toBe('descending');

        //Click-Continue Button
        await portalreferrerpage.clickContinueButton();

    })


})