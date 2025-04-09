import { test } from '../fixtures/testFixtures';

test.describe("Sciensus HomePage Functionality", () => {
    
    test("Sciensus- Homepage functionlaity" , async ({ homePage }) =>{

        await homePage.navigateToURL();
        await homePage.clickSignInButton();


        // await test.step('Sciensus HomePage displayed', async () =>{
        //     await homePage.navigateToURL();
        // })
        // await test.step('After click user navigate to the LoginPage', async () =>{
        //     await homePage.clickSignInButton();
        // })
        
    })
})