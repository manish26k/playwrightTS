import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { faker } from '@faker-js/faker/locale/en';



test.describe("Authorise Access to Portal Features Functionality", () => {
    
    test("Portal E2E Account SetUp Registration" , async ({ loginPage, homePage, homecareportalpage, administeraccountspage,addnewuseraccountspage,portalaccesspage, choosehospitalpage, portaldiagnosispage, patientcategoriespage, portalreferrerpage, portale2eaccountsetup }) =>{
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
        } 
        
        //Click- Continue Button
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

       //Select- View Restricted Radio Button
       await portalreferrerpage.selectRestrictedReferralRadioButton();     
  
       //Click-Restricted Referrer CheckBox One by One
       const referrerCheckbox = await portalreferrerpage.getCheckboxes();
        for( let i = 0; i < referrerCheckbox.length; i++){
            await portalreferrerpage.selectReferralListCheckboxes(i);            
        }

        //sort column in descending order. By deafult = Ascending Order
        await portalreferrerpage.clickNameHeader(); // 1st sort - descending
        await portalreferrerpage.clickNameHeader(); // 2nd sort - ascending
        await portalreferrerpage.clickNameHeader(); // 3rd sort - descending
        
        //Click-Continue Button
        await portalreferrerpage.clickContinueButton();


        /***** PORTAL E2E ACCOUNT REGISTRATION SETUP ********/
        
        //Validate- Thank You Message
        const thankYouMessageText = await portale2eaccountsetup.getRegistrationFinishMessage();
        //const expectedText = `Thank you.\nThe New Account Setup is now complete.\n\nAn automated email will now be sent to your new Portal User to invite them to Sign In`;                     
        //expect.soft(thankYouMessageText?.trim()).toBe(expectedText);
        const actualThankYouMessage= thankYouMessageText?.replace(/\s+/g, ' ').trim();

        const expectedMessage = `Thank you.
        The New Account Setup is now complete.

        An automated email will now be sent to your new Portal User to invite them to Sign In`;

        const expectedThankYouMessage = expectedMessage.replace(/\s+/g, ' ').trim();
        expect.soft(actualThankYouMessage).toBe(expectedThankYouMessage);


        //Click-Continue Button
        await portale2eaccountsetup.clickContinueButton();

        //Verify- Navigate to the Sciensus HomeCare Page
        const expectHeading = "Sciensus Portal.";
       const headingText= await portale2eaccountsetup.verifyPageHeading(expectHeading);
       console.log(`Page Heading Text : ${headingText}`);
       expect.soft(headingText).toBe(true); 

    })

    


})