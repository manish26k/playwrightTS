import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { faker } from '@faker-js/faker/locale/en';
import { MailService } from '../pages/mailService';
import { testConfig } from '../testConfig';


function getRandomEmail(serverDomain: string): string{
    return `user${Date.now()}${serverDomain}`;
}



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
        

        const mailService = new MailService(testConfig.apiKey, testConfig.serverId);
        // Generate a random email for registration
        const registrationEmail = getRandomEmail(testConfig.serverDomain);
        


        //Portal- Add New User Page
        await addnewuseraccountspage.enterFirstName(fName);
        await addnewuseraccountspage.enterLasteName(lName);
        await addnewuseraccountspage.enterEmail(registrationEmail);
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
       
        //Click-Continue Button
        await portale2eaccountsetup.clickContinueButton();

        //Click- Login User dropdown
        await homecareportalpage.dropDownClick();
        //Click- Signout Button
        await homecareportalpage.portalLogout();
        

        /******** Fetch Username and Password- Mailosour******/
        
               
        const credentails = await mailService.getCredentials(registrationEmail);
        console.log("Sciensus Registered Username" +"-----"+ credentails.username);
        console.log("Sciensus Registered Password" +"-----"+ credentails.password);

        //Click Again- SignIn Button
        await homePage.clickSignInButton();

        //Enter Email and Password
        await loginPage.enterLoginEmail(credentails.username);
        await loginPage.enterLoginPassword(credentails.password);
        await loginPage.clickLoginButton();
        await loginPage.clickSendVerificationCodeButton();

        /****** Fetch OTP- Mailosaur******/

        const verificationCode = await mailService.getVerificationCode(registrationEmail);
        
         
        
        
        await loginPage.enterVerificationCode(verificationCode);
        await loginPage.clickVerifyCodeButton();

        const emailVerified = await loginPage.getSuccessMessageText();
        expect.soft(emailVerified).toBe('E-mail address verified. You can now continue.');

        await loginPage.clickContinueButton();

        /*  Terms and Condition */
        const headingText = await termsconditionpage.getTermsHeadingText();
        expect.soft(headingText).toBe('Terms and Conditions statement for Homecare Portal.');

        const portalMessage = await termsconditionpage.getPortalMessage();
        expect.soft(portalMessage).toBe('This Portal is intended for use by authorised users only.');

        const welcomeMessage = await termsconditionpage.getWelcomeMessage();
        expect.soft(welcomeMessage).toContain('Welcome to Sciensus Pharma Services Limited (SPSL) Homecare Portal.');



        const expectedAgreements = [
            'I agree that I am accessing patient data in relation to my role within an NHS establishment',
            'I agree not to share my password to this platform',
            'I agree not to use the information I see within the portal for another purpose',
            'I agree I comply with Data Protection Laws and my NHS Trusts own Data Protection Policy',
            'I agree I have read SPSL Privacy Notice'
        ];

        for (let i = 0; i < expectedAgreements.length; i++) {
            const agreementText = await termsconditionpage.getAgreementText(i);
            expect.soft(agreementText).toBe(expectedAgreements[i]);
        }

        await termsconditionpage.selectTermsConditionButtonType('Proceed');
        

        



         

    })

    


})