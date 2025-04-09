import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { testConfig } from '../testConfig';
import { TestDataManager } from "../utils/testDataManager";

export class LoginPage {
  private page: Page;
  private fillEmailAddress: Locator;
  private fillPassword: Locator;
  private loginButton: Locator;
  private viewPasswordButton: Locator;
  private passwordHidden: Locator;
  private passwordVisible: Locator;
  private resetPasswordLink: Locator;
  private resetPasswordDetails: Locator;
  private emailIdInput: Locator;
  private sendVerificationCodeButton: Locator;
  private verifyCodeButton: Locator;
  private verifyInputTextBox: Locator;
  private continueButton: Locator;
  private successMessagePopup: string;

  constructor(page: Page) {
    this.page = page;
    this.fillEmailAddress = this.page.locator("input#email");
    this.fillPassword = this.page.locator("input#password");
    this.loginButton = this.page.locator("button#next");
    this.viewPasswordButton = this.page.locator('[toggle="#password-field"]');
    this.passwordHidden = this.page.locator('input[type="password"]');
    this.passwordVisible = this.page.locator('input[type="text"]');
    this.resetPasswordLink = this.page.locator("a#forgotPassword");
    this.resetPasswordDetails = this.page.locator("div.panel.panel-default");
    this.emailIdInput = this.page.locator("input#email");
    this.sendVerificationCodeButton = this.page.locator("div.buttons.verify");
    this.verifyInputTextBox = this.page.locator("//*[@class='verifyInput']");
    this.verifyCodeButton = this.page.locator("//*[@class='verifyButton']");
    this.continueButton = this.page.locator("[aria-label='Continue']");
    this.successMessagePopup = '#readOnlyEmail_success';

  }

  
  /**
   * function to bypass the email authentication in dev env
   */
  async bypassEmailAuthentication() {
    const getUrl = await this.page.url();
    logger.info("Gets the URL of the Page");
    await this.page.goto(getUrl.replace("_emailmfa", ""));
    logger.info("Replacing the string from the URL");
  }

  async loginToPortal(authentication: boolean) {
    if (authentication) {
      this.bypassEmailAuthentication();
      logger.info("Calling the bypassEmailAuthentication function");
    }
    await this.fillEmailAddress.fill(testConfig.email);
    logger.info("Enter the Valid Email");
    await this.fillPassword.fill(testConfig.password);
    logger.info("Enter the Valid Password");
  }

  // /**
  //  *
  //  * @param {object} userInfo
  //  * @param {boolean} authentication
  //  */
  // async enterUserInfo(userInfo: { email: string; password: string }, authentication: boolean) {
  //   if (authentication) {
  //     this.bypassEmailAuthentication();
  //   }
  //   await this.fillEmailAddress.fill(userInfo.email);
  //   await this.fillPassword.fill(userInfo.password);
  // }



  async isLoggedIn() {
    // Check if some element exists on the logged-in page to verify successful login
    return await this.page.isVisible('a[aria-label="Sign out"]');
    logger.info("Verify User is logged into the Sciensus Portal");
  }
  async validateAuthencationCodePage() {
    await this.page.getByText('Please provide the following').isVisible();
    await this.page.getByLabel('Send verification code').click();
    await this.page.getByPlaceholder('Verification code').click();
    await this.page.getByLabel('Verify code').click();
    await this.page.getByLabel('Send new code').click();
    await this.page.getByLabel('Continue').click();  
  }

  async clickLoginButton() {
    await this.loginButton.click();
    logger.info("Click on the SignIN button");
  }

  async clearStorageSession() {
    await this.page.evaluate(() => window.localStorage.setItem('session','expired'));
    await this.page.evaluate(() => window.localStorage.setItem('resumePage',window.location.href));
    await this.page.evaluate(() => window.location.replace("/session-logout"));
  }
  
  async clickViewPasswordButton() {
    expect(await this.viewPasswordButton.isVisible()).toBeTruthy();
    await this.viewPasswordButton.click();
  }

  async verifyPassowrdIsHidden() {
    await expect(this.passwordHidden).toBeVisible();
    await expect(this.passwordHidden).toHaveAttribute('type', 'password');
  }

  async verifyPasswordIsVisible() {
    await expect(this.passwordVisible).toBeVisible();
    await expect(this.passwordVisible).toHaveAttribute('type', 'text');
  }

  async clickResetPasswordLink() {
    await this.resetPasswordLink.click();
    await expect(this.resetPasswordDetails).toBeVisible();
  }
  
  //For password reset 
  async enterEmailForPasswordReset(email: string) {
    await this.emailIdInput.fill(email);
  }

  async enterLoginEmail(email: string){
    await this.fillEmailAddress.fill(email);
  }

  async enterLoginPassword(password: string){
    await this.fillPassword.fill(password);
  }

  async clickSendVerificationCodeButton() {
    await this.sendVerificationCodeButton.click();
  }

  async enterVerificationCode(code: string){
    await this.verifyInputTextBox.fill(code);
  }

  async clickVerifyCodeButton(){
    await this.verifyCodeButton.click();
  }

  async clickContinueButton() {
    await this.continueButton.click();
  }

  async getSuccessMessageText() {
    return this.page.isVisible(this.successMessagePopup);
    return this.page.textContent(this.successMessagePopup);
}

/*** Login with Email and Password*** */
async loginWithEmailPassword(email: string, password: string) {
  //const { email, password } = TestDataManager.getTestData('User.json');
  await this.fillEmailAddress.fill(email);
  await this.fillPassword.fill(password);
  await this.clickLoginButton();  
}

}


