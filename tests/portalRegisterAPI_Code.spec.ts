import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { faker } from '@faker-js/faker/locale/en';
import { MailSlurpHelper } from '../pages/mailSlurp';
import { testConfig } from '../testConfig';
import { postCreateInbox, waitForLatestEmail, extractCredentials, extractVerificationCode, waitForEmailLatest } from '../utils/mailslurp';


test.describe("Authorise Access to Portal Features Functionality", () => {
    
    test("Portal E2E Account SetUp Registration" , async ({ loginPage, homePage, homecareportalpage, administeraccountspage,addnewuseraccountspage,portalaccesspage, choosehospitalpage, portaldiagnosispage, patientcategoriespage, portalreferrerpage, portale2eaccountsetup,termsconditionpage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.clickOnHomeScreenButton("Administer Accounts");
        await administeraccountspage.clickAddNewUserButton();  

        //Using Faker to generate random data
        const fName = faker.person.firstName();
        const lName = faker.person.lastName();
        
       //Create Inbox
       const inbox = await postCreateInbox();
       const inboxId = inbox.id;
       const emailAddress = inbox.emailAddress; 
       console.log(`Inbox created with ID: ${inboxId} and Email Address: ${emailAddress}`);     

        //Portal- Add New User Page
        await addnewuseraccountspage.enterFirstName(fName);
        await addnewuseraccountspage.enterLasteName(lName);
        await addnewuseraccountspage.enterEmail(emailAddress);
        await addnewuseraccountspage.clickVerifyEmail();   
        await addnewuseraccountspage.clickContinue();        

        //Portal - WebRoles Access Page
        await portalaccesspage.clickCheckBox("financial-management");
        await portalaccesspage.continueButtonClick();

        //Portal- Choose Hospital Page 
        //await choosehospitalpage.selectRestrictedHospitalRadioButton();      
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
        
        //Click-Continue Button
        await portalreferrerpage.clickContinueButton();


        /***** PORTAL E2E ACCOUNT REGISTRATION SETUP ********/
       
        //Click-Continue Button
        await portale2eaccountsetup.clickContinueButton();

        //Click- Login User dropdown
        await homecareportalpage.dropDownClick();
        //Click- Signout Button
        await homecareportalpage.portalLogout();

        //Click Again- SignIn Button
        await homePage.clickSignInButton();
        
        

        /******** Extract Username and Password- Mailslurp******/         

        const credentials = await addnewuseraccountspage.extractCredentialsFromEmail(inboxId);        

        console.log('Extracted Credentials- username:', credentials.username);
        console.log('Extracted Credentials- password:', credentials.password);
        if (!credentials.username || !credentials.password) {
            throw new Error('Failed to extract credentials from email');
        }
          

        //Enter Email and Password from mailslurp
        await loginPage.enterLoginEmail(credentials.username);
        await loginPage.enterLoginPassword(credentials.password);
        await loginPage.clickLoginButton();
        await loginPage.clickSendVerificationCodeButton();

        /****** Extract OTP- Mailslurp******/
       
        const verificationCode = await addnewuseraccountspage.extractVerificationCodeFromEmail(inboxId);
        console.log("Sciensus verificationCode is" +"------>"+ verificationCode);

       if(verificationCode){
        await loginPage.enterVerificationCode(verificationCode);
       }else{
            throw new Error('Verification code not found');
       }
              
        await loginPage.clickVerifyCodeButton();      
        await loginPage.clickContinueButton();

        /*  Terms and Condition */
        await termsconditionpage.selectTermsConditionButtonType('Proceed');
        

    })


})