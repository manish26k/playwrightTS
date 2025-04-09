import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { faker } from '@faker-js/faker/locale/en';
import { MailSlurpHelper } from '../pages/mailSlurp';
import { testConfig } from '../testConfig';
import { TestDataManager } from '../utils/testDataManager';


test.describe("Registration Functionality- E2E Registration into Portal ", () => {
    
    test.skip("Portal E2E Account SetUp Registration" , async ({ loginPage, homePage, homecareportalpage, administeraccountspage,addnewuseraccountspage,portalaccesspage, choosehospitalpage, portaldiagnosispage, patientcategoriespage, portalreferrerpage, portale2eaccountsetup,termsconditionpage,forgotpasswordpage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.clickOnHomeScreenButton("Administer Accounts");
        await administeraccountspage.clickAddNewUserButton();  

        //Using Faker to generate random data
        const fName = faker.person.firstName();
        const lName = faker.person.lastName();
        
       const mailSlurp = new MailSlurpHelper(testConfig.apiKEY);
       const { id: inboxId, emailAddress: registeredEmail } = await mailSlurp.createNewInbox();
       console.log(" NEWLY CREATED INBOX ID IS " + "------>" + inboxId);
       console.log(" NEW EMAIL IS " + "--------> "+ registeredEmail);  
       
       //saving- login credentails in json file i.e new inbox id and new email
       TestDataManager.saveTestData("NewLoginCredentials.json", { inboxId, email: registeredEmail, password: "" });           

        //Portal- Add New User Page
        await addnewuseraccountspage.enterFirstName(fName);
        await addnewuseraccountspage.enterLasteName(lName);
        await addnewuseraccountspage.enterEmail(registeredEmail);
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
        

        // /******** Fetch Username and Password- Mailosour******/

        // const credentials = await mailSlurp.extractUsernameAndPassword(inboxId);
        // console.log("Sciensus Username" +"------->"+ credentials.username);
        // console.log("Sciensus Password" +"------->"+ credentials.password);    
          

        // //Enter Email and Password from mailslurp
        // await loginPage.enterLoginEmail(credentials.username);
        // await loginPage.enterLoginPassword(credentials.password);
        // await loginPage.clickLoginButton();
        // await loginPage.clickSendVerificationCodeButton();
         
            /*****Set New Password for the Portal*****/
        await homePage.clickSignInButton();    
        await forgotpasswordpage.clickForgotPasswordLink();
        const { email } = TestDataManager.getTestData("NewLoginCredentials.json")
        await forgotpasswordpage.enterEmailAddress(email);
        await forgotpasswordpage.clickVerificationCodeButton();
        const { newCredentails } = TestDataManager.getTestData("NewLoginCredentials.json")
        const verificationCode = await mailSlurp.extractVerificationCode03(newCredentails.inboxId);
        console.log("Sciensus new verificationCode is" +"------>"+ verificationCode);
        if(verificationCode){
        await forgotpasswordpage.enterVerificationCode(verificationCode);
        }else{
            throw new Error('Verification code not found');
        } 
        await forgotpasswordpage.clickVerifyCodeButton();  
        await forgotpasswordpage.clickContinueButton();
        await forgotpasswordpage.enterNewPassword("Testing@1234");
        await forgotpasswordpage.enterConfirmPassword("Testing@1234");
        await forgotpasswordpage.clickPasswordContinueButton();
        await termsconditionpage.selectTermsConditionButtonType('Proceed');       


         /****** Fetch OTP- Mailosaur******/
       
   
        

    })

    test("Portal E2E Account SetUp Registration" , async ({ loginPage, homePage, homecareportalpage, administeraccountspage,addnewuseraccountspage,portalaccesspage, choosehospitalpage, portaldiagnosispage, patientcategoriespage, portalreferrerpage, portale2eaccountsetup,termsconditionpage,forgotpasswordpage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        const mailSlurp = new MailSlurpHelper(testConfig.apiKEY);

        const loginData = TestDataManager.getTestData('LoginCredentials.json');
        await loginPage.loginWithEmailPassword(loginData.email, loginData.password);
        await loginPage.clickSendVerificationCodeButton();
        const verificationCode = await mailSlurp.extractVerificationCode03(loginData.inboxId);
        console.log("Sciensus new verificationCode is" +"------>"+ verificationCode);
        if(verificationCode){
        await loginPage.enterVerificationCode(verificationCode);
        }else{
            throw new Error('Verification code not found');
        }      
        await loginPage.clickVerifyCodeButton();  
        await loginPage.clickContinueButton(); 

        await homecareportalpage.clickOnHomeScreenButton("Administer Accounts");
        await administeraccountspage.clickAddNewUserButton();  

        //Using Faker to generate random data
        const fName = faker.person.firstName();
        const lName = faker.person.lastName();
        
       //const mailSlurp = new MailSlurpHelper(testConfig.apiKEY);
       const { id: inboxId, emailAddress: registeredEmail } = await mailSlurp.createNewInbox();
       console.log(" NEWLY CREATED INBOX ID IS " + "------>" + inboxId);
       console.log(" NEW EMAIL IS " + "--------> "+ registeredEmail);  
       
       //saving- login credentails in json file i.e new inbox id and new email
       TestDataManager.saveTestData("NewLoginCredentials.json", { inboxId, email: registeredEmail, password: "" });           

        //Portal- Add New User Page
        await addnewuseraccountspage.enterFirstName(fName);
        await addnewuseraccountspage.enterLasteName(lName);
        await addnewuseraccountspage.enterEmail(registeredEmail);
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
         
         
        /*****Set New Password for the Portal*****/
        await homePage.clickSignInButton();    
        await forgotpasswordpage.clickForgotPasswordLink();
        const { email } = TestDataManager.getTestData("NewLoginCredentials.json")
        await forgotpasswordpage.enterEmailAddress(email);
        await forgotpasswordpage.clickVerificationCodeButton();
        const { newCredentails } = TestDataManager.getTestData("NewLoginCredentials.json")
        const verificationCode = await mailSlurp.extractVerificationCode03(newCredentails.inboxId);
        console.log("Sciensus new verificationCode is" +"------>"+ verificationCode);
        if(verificationCode){
        await forgotpasswordpage.enterVerificationCode(verificationCode);
        }else{
            throw new Error('Verification code not found');
        } 
        await forgotpasswordpage.clickVerifyCodeButton();  
        await forgotpasswordpage.clickContinueButton();
        await forgotpasswordpage.enterNewPassword("Testing@1234");
        await forgotpasswordpage.enterConfirmPassword("Testing@1234");
        await forgotpasswordpage.clickPasswordContinueButton();
        await termsconditionpage.selectTermsConditionButtonType('Proceed');       


    
        

    })


})
