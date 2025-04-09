import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { faker } from '@faker-js/faker/locale/en';
import { MailSlurpHelper } from '../pages/mailSlurp';
import { testConfig } from '../testConfig';


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
        
       const mailSlurp = new MailSlurpHelper(testConfig.apiKEY);
       const { id: inboxId, emailAddress: registeredEmail } = await mailSlurp.createNewInbox();
       console.log(" NEWLY CREATED INBOX ID IS " + "------>" + inboxId);
       console.log(" NEW EMAIL IS " + "--------> "+ registeredEmail); 
            

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
        
        

        /******** Fetch Username and Password- Mailosour******/

        const credentials = await mailSlurp.extractUsernameAndPassword(inboxId);
        console.log("Sciensus Username" +"------->"+ credentials.username);
        console.log("Sciensus Password" +"------->"+ credentials.password);    
          

        //Enter Email and Password from mailslurp
        await loginPage.enterLoginEmail(credentials.username);
        await loginPage.enterLoginPassword(credentials.password);
        await loginPage.clickLoginButton();
        await loginPage.clickSendVerificationCodeButton();

        /****** Fetch OTP- Mailosaur******/
       
       const verificationCode = await mailSlurp.extractVerificationCode(inboxId);
       console.log("Sciensus verificationCode is" +"------>"+ verificationCode);

       if(verificationCode){
        await loginPage.enterVerificationCode(verificationCode);
       }else{
            throw new Error('Verification code not found');
       }
      
        
        await loginPage.clickVerifyCodeButton();

        // const emailVerified = await loginPage.getSuccessMessageText();
        // expect.soft(emailVerified).toBe('E-mail address verified. You can now continue.');

        await loginPage.clickContinueButton();

        /*  Terms and Condition */
        const headingText = await termsconditionpage.getTermsHeadingText();
        expect.soft(headingText).toBe('Terms and Conditions statement for Homecare Portal.');

        const portalMessage = await termsconditionpage.getPortalMessage();
        expect.soft(portalMessage).toBe('This Portal is intended for use by authorised users only.');

        const welcomeMessage = await termsconditionpage.getWelcomeMessage();
        expect.soft(welcomeMessage).toContain('Welcome to Sciensus Pharma Services Limited (SPSL) Homecare Portal.');



        // const expectedAgreements = [
        //     'I agree that I am accessing patient data in relation to my role within an NHS establishment',
        //     'I agree not to share my password to this platform',
        //     'I agree not to use the information I see within the portal for another purpose',
        //     'I agree I comply with Data Protection Laws and my NHS Trusts own Data Protection Policy',
        //     'I agree I have read SPSL Privacy Notice'
        // ];

        // for (let i = 0; i < expectedAgreements.length; i++) {
        //     const agreementText = await termsconditionpage.getAgreementText(i);
        //     expect.soft(agreementText).toBe(expectedAgreements[i]);
        // }

        await termsconditionpage.selectTermsConditionButtonType('Proceed');
        

    })


})
