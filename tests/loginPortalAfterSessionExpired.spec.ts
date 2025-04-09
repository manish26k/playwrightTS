import { test } from '../fixtures/testFixtures';
import { testConfig } from '../testConfig';

test.describe("Again Login To Portal - After Session Expired", () => {
    
    test("Login Back To Portal After Session Expired" , async ({ loginPage, homePage, homecareportalpage, loginsessionexpiredpage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.verifyUserNameShowsOnHeader(testConfig.username);
        await loginPage.clearStorageSession();
        await loginsessionexpiredpage.verifySessionExpired(testConfig.devSessionHeading,testConfig.devSessionMessage);
        await loginsessionexpiredpage.enterEmail(testConfig.email);
        await loginsessionexpiredpage.clickVerify();

    })
})