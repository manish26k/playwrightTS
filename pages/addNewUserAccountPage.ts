import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { extractCredentials, extractVerificationCode, waitForEmailLatest } from '../utils/mailslurp';

export class AddNewUserAccountPage{
    private page: Page;
    private fillFirstName: Locator;
    private fillLastName: Locator;
    private fillEmail: Locator;
    private clickVerifyEmailButton: Locator;
    private clickContinueButton: Locator;
    private verifyPageHeadingName: string;
    private requiredFirstNameValidator: string;
    private requiredLastNameValidator: string;
    private instructionText: string;
    private emailVerifiedButton: Locator;


    constructor(page: Page){
        this.page = page;
        this.fillFirstName = this.page.locator("//input[@id='firstname']");
        this.fillLastName = this.page.locator("//input[@id='lastname']");
        this.fillEmail = this.page.locator("//input[@id='emailaddress1']");
        this.clickVerifyEmailButton = this.page.locator("//input[@id='VerifyButton']");
        this.clickContinueButton = this.page.locator("//input[@id='InsertButton']");
        this.verifyPageHeadingName = 'h1.portHeading';
        this.requiredFirstNameValidator = '#RequiredFieldValidatorfirstname';
        this.requiredLastNameValidator = '#RequiredFieldValidatorlastname';
        this.instructionText = '.portal-desc';
        this.emailVerifiedButton = this.page.locator('//*[@id="VerifyButton"]');
    }


    /* Veify the Page Heading Name */
    async getHeadingText(){
        return await this.page.textContent(this.verifyPageHeadingName);
        logger.info("Validate the Add New User Account Page Heading");
    }

    /*Validate Email Button intially Disabled */
    async isVerifyEmailButtonDisabled(){
        return await this.clickVerifyEmailButton.isDisabled();
        logger.info("Validate the Verify Email Button is disabled");
    }

    /*Validate Email Button Enabled */
    async isVerifyEmailButtonEnabled(){
        return await this.clickVerifyEmailButton.isEnabled();
    }

    async isVerifyContinueButtonDisabled(){
        return await this.clickContinueButton.isDisabled();
        logger.info("Validate the Continue Button is disbaled");
    }

    async isVerifyContinueButtonEnabled(){
        return await this.clickContinueButton.isEnabled();
    }

    async hoverOverFirstNameField(){
        await this.fillFirstName.hover();
    }

    async getFirstNameFieldToolTip(){
        return await this.fillFirstName.getAttribute('title');
    }

    async isRequiredFirstNameFieldValidator(){
        //return await this.page.isVisible(this.requiredFirstNameValidator);
        return await this.fillFirstName.getAttribute('aria-required') === 'true';
    }

    async getInstructionText(){
        return this.page.textContent(this.instructionText);
        logger.info("Validate the New Portal User Page Instruction Text");
    }

    async isInstructionTextVisible(){
        return this.page.isVisible(this.instructionText);
    }

    async enterFirstName(firstname: string){
        await this.fillFirstName.fill(firstname);
    }

    async enterLasteName(lastname: string){
        await this.fillLastName.fill(lastname);
    }

    async enterEmail(email: string){
        await this.fillEmail.fill(email);
    }

    async clickVerifyEmail(){
        await this.clickVerifyEmailButton.click();        
    }    

    async getVerifiedButtonText(){
        //return await this.page.textContent(this.emailVerifiedButton);
        return await this.emailVerifiedButton.inputValue();
    }

    async waitForEmailVerifiedText(){
        //await this.page.waitForSelector(this.emailVerifiedButton, { state: 'visible'});
        await this.clickVerifyEmailButton.waitFor();
    }

    async clickContinue(){
        await this.page.waitForLoadState("networkidle");
        await this.clickContinueButton.click();
    }




    /***********************************Using MailSlurp API MEthods*******************************************************/
  
  async extractCredentialsFromEmail(inboxId: string) {
    const emailContent = await waitForEmailLatest(inboxId, 'Your Sciensus Portal Sign In Information');
    const credentials = extractCredentials(emailContent.body);    
    if (!credentials.username || !credentials.password) {
      throw new Error('Failed to extract credentials from email');
    }
    return credentials;
  }


  async extractVerificationCodeFromEmail(inboxId: string) {
    const emailContent = await waitForEmailLatest(inboxId, 'Sciensus account email verification code');
    const verificationCode = extractVerificationCode(emailContent.body);
    if (!verificationCode) {
      throw new Error('Failed to extract verification code from email');
    }
    return verificationCode;
  }


}