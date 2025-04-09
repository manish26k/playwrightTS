import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { faker } from '@faker-js/faker/locale/en';


test.describe("Authorise Access to Portal Features Functionality", () => {
    
    test("Portal Patients Category - Patients Categories Page " , async ({ loginPage, homePage, homecareportalpage, administeraccountspage,addnewuseraccountspage,portalaccesspage, choosehospitalpage, portaldiagnosispage, patientcategoriespage }) =>{
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

       //Validate the Page Heading text
       const expectHeading = "Choose the Types of Patient That This User Can View.";
       const headingText= await patientcategoriespage.verifyPageHeading(expectHeading);
       console.log(`Page Heading Text : ${headingText}`);
       expect.soft(headingText).toBe(true); 

       //Validate the Instruction text
       const expectedInstructionText = "Please select the Types of Patient that the person will be authorised to view in the Portal. You must select one of these options. Click the Continue button to proceed.";
       const normalizedInstructionText = expectedInstructionText.replace(/\s+/g, ' ').trim();
       const instructionText = await patientcategoriespage.getInstructionText();
       console.log(`Instruction Text : ${instructionText}`);
       expect.soft(instructionText).toBe(normalizedInstructionText);

    
     
         // Selectand Verify- One Radio Button 
         await patientcategoriespage.selectPatientType('Adult');
         expect.soft(await patientcategoriespage.isRadioButtonChecked(patientcategoriespage.adultRadioButton)).toBe(true);
         expect.soft(await patientcategoriespage.isRadioButtonChecked(patientcategoriespage.paediatricRadioButton)).toBe(false);
         expect.soft(await patientcategoriespage.isRadioButtonChecked(patientcategoriespage.bothradioButton)).toBe(false);

         await patientcategoriespage.selectPatientType('Paediatric');
         expect.soft(await patientcategoriespage.isRadioButtonChecked(patientcategoriespage.adultRadioButton)).toBe(false);
         expect.soft(await patientcategoriespage.isRadioButtonChecked(patientcategoriespage.paediatricRadioButton)).toBe(true);
         expect.soft(await patientcategoriespage.isRadioButtonChecked(patientcategoriespage.bothradioButton)).toBe(false);

         await patientcategoriespage.selectPatientType('Both');
         expect.soft(await patientcategoriespage.isRadioButtonChecked(patientcategoriespage.adultRadioButton)).toBe(false);
         expect.soft(await patientcategoriespage.isRadioButtonChecked(patientcategoriespage.paediatricRadioButton)).toBe(false);
         expect.soft(await patientcategoriespage.isRadioButtonChecked(patientcategoriespage.bothradioButton)).toBe(true);
  
       
       // Verify- Continue Button Enabled
       const isEnabled= await patientcategoriespage.isContinueButtonEnabled();
       expect.soft(isEnabled).toBe(true);

       // Click- Continue Button
       await patientcategoriespage.clickContinueButton();

    })


})