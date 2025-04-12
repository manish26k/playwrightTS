import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { MailSlurpHelper } from '../pages/mailSlurp';
import { testConfig } from '../testConfig';
import { ConfigHelper } from '../utils/configHelper';
import { TestDataManager } from "../utils/testDataManager";
import * as allure from "allure-js-commons";
import { AllureHelper } from '../utils/allureHelper';

test.describe("Portal Login Features Functionality", () => {
    
    test.skip("Portal Login Functionality- Using verification Code" , async ({ loginPage, homePage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        const mailSlurp = new MailSlurpHelper(testConfig.apiKEY);
        const { inboxId, username, password } = ConfigHelper.getCredentials();
        await loginPage.enterLoginEmail(username);
        await loginPage.enterLoginPassword(password);
        await loginPage.clickLoginButton();
        await loginPage.clickSendVerificationCodeButton();
        const verificationCode = await mailSlurp.extractVerificationCode03(inboxId);
        console.log("Sciensus new verificationCode is" +"------>"+ verificationCode);
        if(verificationCode){
        await loginPage.enterVerificationCode(verificationCode);
        }else{
            throw new Error('Verification code not found');
        }    
     
        await loginPage.clickVerifyCodeButton();  
        await loginPage.clickContinueButton();   
        

    })

    test.skip("Portal Login Functionality- Using stored credentails and verification Code" , async ({ loginPage, homePage }) =>{
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

    })

    test.skip("Login Functionality" , async ({ loginpage01, homePage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        const mailSlurp = new MailSlurpHelper(testConfig.apiKEY);
        const loginData = TestDataManager.getTestData('LoginCredentials.json');
        await loginpage01.loginWithEmailPassword(loginData.email, loginData.password);
        await loginpage01.clickSendVerificationCodeButton();
        const verificationCode = await mailSlurp.extractVerificationCode03(loginData.inboxId);
        console.log("Sciensus new verificationCode is" +"------>"+ verificationCode);
        if(verificationCode){
        await loginpage01.enterVerificationCode(verificationCode);
        }else{
            throw new Error('Verification code not found');
        }      
        await loginpage01.clickVerifyCodeButton();  
        await loginpage01.clickContinueButton();       

    })

    test.describe('Automation Login testcase', () => {
    
    //using as global variable
    const mailSlurp = new MailSlurpHelper(testConfig.apiKEY);
    const loginData = TestDataManager.getTestData('LoginCredentials.json');

    test('Automating Sciensus Login functionlaity', async ({ loginPage, homePage,page }) => {
      // --- Allure metadata ---
    await allure.label('Portal', 'UI');
    await allure.owner('Manish Rana');
    await allure.epic('Portal Login');
    await allure.feature('Login');
    await allure.story('Login with valid credentials using JSON');
    await allure.severity('critical');
    await allure.tag('@login');
    await allure.description('Login into the Sciensus Portal using credentials from JSON file');
    await allure.parentSuite('Sciensus Portal Login');
    await allure.suite('Login Functionality');
    await allure.subSuite('Postive Test Case for Login Functionality');



      await test.step('Attach login credentials (JSON)', async () => {
        await AllureHelper.attachJson('Login Data', loginData);
      });
      
      await test.step('Navigate to Sciensus Homepage and click on Sign In', async () => {
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await AllureHelper.attachScreenshot('Sciensus Homepage', page);
      });

      await test.step('Reterive login credentials and Perform login', async () => {
        //const mailSlurp = new MailSlurpHelper(testConfig.apiKEY);
        //const loginData = TestDataManager.getTestData('LoginCredentials.json');
        await loginPage.loginWithEmailPassword(loginData.email, loginData.password);
        await AllureHelper.attachScreenshot('Sciensus LoginPage', page);
      });

      await test.step('Request and Reterive verification code', async () => {
        await loginPage.clickSendVerificationCodeButton();
        const verificationCode = await mailSlurp.extractVerificationCode03(loginData.inboxId);
        console.log("Sciensus new verificationCode is" +"------>"+ verificationCode);
        if(verificationCode){
        await AllureHelper.attachText('Verification Code', verificationCode);  
        await loginPage.enterVerificationCode(verificationCode);
        }else{
            throw new Error('Verification code not found');
        }      
      });

      await test.step('verify Code and Login Successfully', async () => {
        await loginPage.clickVerifyCodeButton();  
        await loginPage.clickContinueButton();
        await AllureHelper.attachScreenshot('Sciensus LoggedIn UserPage', page);
      });
     
    });
  });

})