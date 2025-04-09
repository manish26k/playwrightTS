import { test } from '../fixtures/testFixtures';
import { MailSlurpHelper } from '../pages/mailSlurp';
import { TestDataReader } from "../utils/testDataReader";
import { testConfig } from '../testConfig';


// Define data source (change to "json" for JSON test data)
const dataSource = "excel"; 
// Read test data once before execution
const testData = TestDataReader.readTestData(dataSource);

// Initialize MailSlurpHelper once for efficiency
const mailSlurp = new MailSlurpHelper(testConfig.apiKEY);

// Define test suite for Portal Login
test.describe.skip("Login with same email and password with different OTPs", () => {
    testData.forEach((data, index) => { // Add index for uniqueness
        test(`DDT Positive Login Testing - ${data.email} [${index + 1}]`, async ({ page,loginPage, homePage }) => {
            console.log("Starting test for ${data.email}");            
            
            if (!data.inboxId) {
                throw new Error("Inbox ID is missing for ${data.email}");
            }
            await homePage.navigateToURL();
            await homePage.clickSignInButton();

            //step1: first user login with email and password
            console.log("Logging in with ${data.email}");
            await loginPage.loginWithEmailPassword(data.email, data.password);
            await loginPage.clickSendVerificationCodeButton();
            
            console.log("Waiting for OTP for User ${index + 1}");
            console.log(`Fetching OTPs for inboxId: ${data.inboxId}`);

            //const [firstOTP,secondOTP]= await mailSlurp.fetchTwoLatestOTPs(data.inboxId);
            console.log("First OTP: ${firstOTP}");

            

            //Enter the first OTP
            //await loginPage.enterVerificationCode(firstOTP);
            await loginPage.clickVerifyCodeButton();
            await loginPage.clickContinueButton();

            await page.waitForTimeout(90000); // Wait for 90 seconds before entering the second OTP
            
            //step2: second user login with same email and password
            console.log("Logging in with ${data.email}");
            await loginPage.loginWithEmailPassword(data.email, data.password);
            await loginPage.clickSendVerificationCodeButton();
            
                     

            //Enter the second OTP
            //await loginPage.enterVerificationCode(secondOTP);
            await loginPage.clickVerifyCodeButton();
            await loginPage.clickContinueButton();

          
        });
    });
});

test.describe.skip("Data Driven- Portal Login", () => {
    testData.forEach(({ email, password, inboxId }, index) => { // Add index for uniqueness
        test(`Sciensus Login Testing - ${email} [${index + 1}]`, async ({ loginPage, homePage }) => {
            await homePage.navigateToURL();
            await homePage.clickSignInButton();
            console.log(`Logging in with -----> ${email}`);
            await loginPage.loginWithEmailPassword(email, password);
            await loginPage.clickSendVerificationCodeButton();
            const verificationCode = await mailSlurp.extractVerificationCode03(inboxId);
            if (!verificationCode) {
                throw new Error(`Verification code not received for ${email}`);
            }
            await loginPage.enterVerificationCode(verificationCode);
            await loginPage.clickVerifyCodeButton();  
            await loginPage.clickContinueButton();
        });
    });
});

test.describe("Login with different OTPs", () => {
    testData.forEach((data, index) => { // Add index for uniqueness
        test(`DDT Login Testing - ${data.email} [${index + 1}]`, async ({ page,loginPage, homePage }) => {
            console.log("Starting test for ${data.email}");            
            
            if (!data.inboxId) {
                throw new Error("Inbox ID is missing for ${data.email}");
            }
            await homePage.navigateToURL();
            await homePage.clickSignInButton();

            //step1: first user login with email and password
            console.log("Logging in with ${data.email}");
            await loginPage.loginWithEmailPassword(data.email, data.password);
            await loginPage.clickSendVerificationCodeButton();
            
            console.log("Waiting for OTP for User ${index + 1}");
            console.log(`Fetching OTPs for inboxId: ${data.inboxId}`);

            const otps= await mailSlurp.fetchLatestOTPs(data.inboxId);
            const otpToUse = otps[index];
                    

            //Enter the first OTP
            await loginPage.enterVerificationCode(otpToUse);
            await loginPage.clickVerifyCodeButton();
            await loginPage.clickContinueButton();

           

          
        });
    });
});

