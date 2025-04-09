import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { MailSlurpHelper } from '../pages/mailSlurp';
import { testConfig } from '../testConfig';
import { TestDataManager } from "../utils/testDataManager";
import { setMetadata } from 'monocart-reporter';

/**
 * @owner QA Team
 * @feature Portal Login Functionality Test
 * @module Login
 * @priority High
 * @styleTag critical
 * @description This test suite verifies the login functionality using a verification code.
 *              It covers user authentication flow, including login, verification code retrieval, 
 *              and successful portal access.
 */

test.describe("Portal Login Features Functionality", () => {

   // Tagging the test suite
   tag: ['@login']

   /**
    * @owner Kevin
    * @testcase User can log in using a verification code
    * @description This test ensures that users can authenticate by receiving a verification 
    *              code via email and entering it into the system.
    *              The test validates UI elements, backend email communication, 
    *              and form validation logic.
    */
  test("✅ Portal Login - Verification Code @Positive", async ({ loginPage, homePage }, testInfo) => {
    
    const TEST_METADATA = {
      owner: "QA Team",
      assignee: "Ashok",
      module: "Authentication",
      priority: "High",
      testEnvironment: "dev"      
    };

    //set custom metadata
    setMetadata(TEST_METADATA, testInfo);

    
    
    test.info().annotations.push({ type: "owner", description: TEST_METADATA.owner });
    test.info().annotations.push({ type: "owner", description: TEST_METADATA.assignee });
    test.info().annotations.push({ type: "module", description: TEST_METADATA.module });
    test.info().annotations.push({ type: "priority", description: TEST_METADATA.priority });
    test.info().annotations.push({ type: "priority", description: TEST_METADATA.testEnvironment });

    

    // 🔹 Step 1: Navigate to Login Page
    /**
     * @step Navigate to the portal
     * @expected The user should be successfully redirected to the login page.
     */
    await homePage.navigateToURL();

    // 🔹 Step 2: Click on the Sign-In button
    /**
     * @step Click on Sign-In button
     * @expected The login form should appear on the screen.
     */
    await homePage.clickSignInButton();

    // 🔹 Step 3: Retrieve Credentials
    /**
     * @step Enter login email and password, then submit the form
     * @input {string} username - The user's email address.
     * @input {string} password - The user's password.
     * @styleTag important
     * @expected The system should validate credentials and prompt for a verification code.
     */
    const mailSlurp = new MailSlurpHelper(testConfig.apiKEY);
    const loginData = TestDataManager.getTestData('LoginCredentials.json');
    await loginPage.loginWithEmailPassword(loginData.email, loginData.password);
      
    

    // 🔹 Step 4: Request Verification Code
    /**
     * @step Click on 'Send Verification Code' button
     * @expected A verification code should be sent to the registered email address.
     */
    await loginPage.clickSendVerificationCodeButton();

    // 🔹 Step 5: Fetch Verification Code from MailSlurp
    /**
     * @step Retrieve verification code from email inbox
     * @expected The system should extract the latest verification code.
     * @error If the verification code is not found, the test should fail with an appropriate message.
     */
    const verificationCode = await mailSlurp.extractVerificationCode03(loginData.inboxId);
    console.log(`📧 Sciensus Verification Code: ${verificationCode}`);

    await testInfo.attach("login flow-diagram", {
      contentType: 'text/mermaid',
      body: `
        sequenceDiagram
          autonumber
          actor User as 🧑‍💻 User
          participant Test as Playwright Test
          participant HomePage as 🏠 Home Page
          participant LoginPage as 🔐 Login Page
          participant MailSlurp as 📧 MailSlurp API
          participant TestData as 📂 Test Data Manager
    
          User->>Test: Start Test Execution 🚀
          
          Test->>HomePage: Navigate to URL
          Test->>HomePage: Click Sign-In Button 🖱️
          
          Test->>MailSlurp: Initialize MailSlurpHelper(apiKEY)
          Test->>TestData: Retrieve Login Credentials (LoginCredentials.json)
          TestData-->>Test: Return { email, password, inboxId }
    
          Test->>LoginPage: Enter Email 📩
          Test->>LoginPage: Enter Password 🔑
          Test->>LoginPage: Click Login Button 🖱️
          Test->>LoginPage: Click Send Verification Code Button 🔘
    
          Test->>MailSlurp: Fetch Verification Code from inboxId
          MailSlurp-->>Test: Return Verification Code 📧
    
          Test->>Console: Log "Sciensus new verificationCode is ---> verificationCode" 📝
    
          alt Verification Code Found ✅
              Test->>LoginPage: Enter Verification Code 🔢
              Test->>LoginPage: Click Verify Code Button ✔
              Test->>LoginPage: Click Continue Button ➡
          else Verification Code Not Found ❌
              Test->>Test: Throw Error "Verification code not found" ⚠️
          end
    
          User->>Test: Test Completed 🎉
      `,
    });






    if (!verificationCode) {
      throw new Error('❌ Verification code not found');
    }

    // 🔹 Step 6: Enter and Verify the Code
     /**
     * @step Enter the verification code in the input field
     * @input {string} verificationCode - The received one-time verification code.
     * @expected The system should accept the code and enable the 'Verify' button.
     */
    await loginPage.enterVerificationCode(verificationCode);

    // 🔹 Step 7: Verify the entered code
    /**
     * @step Click on the 'Verify' button to validate the entered verification code
     * @expected If the code is correct, the system should proceed to the next step.
     * @error If the verification code is incorrect, the system should display an error message.
     */
    await loginPage.clickVerifyCodeButton();

     // 🔹 Step 8: Click on Continue button after successful verification
    /**
     * @step Click on 'Continue' button after successful verification
     * @expected The user should be logged in and redirected to the homepage.
     */
    await loginPage.clickContinueButton();

    // ✅ Attach Mermaid Diagram for Better Visualization in Monocart Reports
    // await testInfo.attach("login flow-diagram", {
    //   contentType: "text/mermaid",
    //   body: `
    //     sequenceDiagram
    //       autonumber
    //       actor User as 🧑‍💻 User
    //       participant Test as Playwright Test
    //       participant HomePage as 🏠 Home Page
    //       participant LoginPage as 🔐 Login Page
    //       participant MailSlurp as 📧 MailSlurp API
    //       participant TestData as 📂 Test Data Manager
    
    //       User->>Test: Start Test Execution 🚀
          
    //       Test->>HomePage: Navigate to URL
    //       Test->>HomePage: Click Sign-In Button 🖱️
          
    //       Test->>MailSlurp: Initialize MailSlurpHelper(apiKEY)
    //       Test->>TestData: Retrieve Login Credentials (LoginCredentials.json)
    //       TestData-->>Test: Return { email, password, inboxId }
    
    //       Test->>LoginPage: Enter Email 📩
    //       Test->>LoginPage: Enter Password 🔑
    //       Test->>LoginPage: Click Login Button 🖱️
    //       Test->>LoginPage: Click Send Verification Code Button 🔘
    
    //       Test->>MailSlurp: Fetch Verification Code from inboxId
    //       MailSlurp-->>Test: Return Verification Code 📧
    
    //       Test->>Console: Log "Sciensus new verificationCode is ---> verificationCode" 📝
    
    //       alt Verification Code Found ✅
    //           Test->>LoginPage: Enter Verification Code 🔢
    //           Test->>LoginPage: Click Verify Code Button ✔
    //           Test->>LoginPage: Click Continue Button ➡
    //       else Verification Code Not Found ❌
    //           Test->>Test: Throw Error "Verification code not found" ⚠️
    //       end
    
    //       User->>Test: Test Completed 🎉
    //   `,
    // });
    

  });

});