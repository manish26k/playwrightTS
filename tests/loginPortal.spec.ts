import { test } from '../fixtures/testFixtures';


test.describe("Login functionality - bypass authentication", () => {
    
    test.skip("Login with Valid Credentails" , async ({ loginPage, homePage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await loginPage.isLoggedIn();

    })

    test("Login with Valid Credentails and Click on the Administer Accounts Button" , async ({ loginPage, homePage, homecareportalpage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.clickOnHomeScreenButton("Administer Accounts");

    })
})