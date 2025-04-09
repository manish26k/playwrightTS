import { expect, Page} from '@playwright/test';
import { LoginPageLocators } from '../utils/locators';

export class LoginPage01 {
    readonly page: Page;    
    constructor(page: Page) {
        this.page = page;        
    }

    async loginWithEmailPassword(email: string, password: string) {
        await this.page.fill(LoginPageLocators.EmailAddress, email);
        await this.page.fill(LoginPageLocators.Password, password);
        await this.page.click(LoginPageLocators.LoginButton);          
    }

    async clickSendVerificationCodeButton() {
        await this.page.click(LoginPageLocators.SendVerificationCodeButton);
    }

    async enterVerificationCode(code: string){
        await this.page.fill(LoginPageLocators.VerificationCodeInputBox, code);
      }

    async clickVerifyCodeButton(){
        await this.page.click(LoginPageLocators.VerifyCodeButton);
      }
    
      async clickContinueButton() {
        await this.page.click(LoginPageLocators.ContinueButton);
      }
}    