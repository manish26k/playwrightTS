import { expect, Page, Locator } from '@playwright/test';
import { TestDataManager } from '../utils/testDataManager';

export class ForgotPasswordPage {
    readonly page: Page;
    readonly forgotPassword: Locator;
    readonly emailIdInput: Locator;
    readonly VerificationCodeButton: Locator;
    readonly verificationCodeInputbox: Locator;
    readonly verifyCodeButton: Locator;
    readonly continueButton: Locator;
    readonly newPasswordInputbox: Locator;
    readonly confirmPasswordInputbox: Locator;
    readonly passwordContinueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.forgotPassword = this.page.locator('a#forgotPassword');
        this.emailIdInput = this.page.locator('input#email');
        this.VerificationCodeButton = this.page.locator('button#emailVerificationControl_but_send_code');
        this.verificationCodeInputbox = this.page.locator('input#emailVerificationCode');
        this.verifyCodeButton = this.page.locator('button#emailVerificationControl_but_verify_code');
        this.continueButton = this.page.locator('button[type="submit"]');
        this.newPasswordInputbox = this.page.locator('input#newPassword');
        this.confirmPasswordInputbox = this.page.locator('input#reenterPassword');
        this.passwordContinueButton = this.page.locator('button[type="submit"]');
}

    async clickForgotPasswordLink() {
        await this.forgotPassword.click();
    }


    async enterEmailAddress(email: string) {
        await this.emailIdInput.fill(email);
    }

    async clickSendVerificationCodeButton() {
        await this.VerificationCodeButton.click();
    }

    async enterVerificationCode(verificationCode: string) {
        await this.verificationCodeInputbox.fill(verificationCode);
    }

    async clickVerifyCodeButton() {
        await this.verifyCodeButton.click();
    }

    async clickContinueButton() {
        await this.continueButton.click();
    }

    async enterNewPassword(password: string){
        await this.newPasswordInputbox.pressSequentially(password);
        const existingData = TestDataManager.getTestData("NewLoginCredentials.json");
        if (existingData) {
            existingData.password = password;
            TestDataManager.saveTestData("NewLoginCredentials.json", existingData);
        }
        await expect(this.passwordContinueButton).toBeVisible({ timeout: 5000 });
    }

    async enterConfirmPassword(password: string){
        await this.confirmPasswordInputbox.fill(password); 
    }

    async clickPasswordContinueButton(){
        await this.passwordContinueButton.click();
    }
         
}
