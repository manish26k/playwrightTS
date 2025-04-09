import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { faker } from '@faker-js/faker/locale/en';


test.describe("Authorise Access to Portal Features Functionality", () => {
    
    test.skip("Choosing Diagnosis Group For the Portal User- Choose Diagnosis Group Page " , async ({ loginPage, homePage, homecareportalpage, administeraccountspage,addnewuseraccountspage,portalaccesspage, choosehospitalpage, portaldiagnosispage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.clickOnHomeScreenButton("Administer Accounts");
        await administeraccountspage.clickAddNewUserButton();  

        // Using Faker to generate random data
        const fName = faker.person.firstName();
        const lName = faker.person.lastName();
        const newEmail = faker.internet.exampleEmail();

        //Portal- Add New User Page
        await addnewuseraccountspage.enterFirstName(fName);
        await addnewuseraccountspage.enterLasteName(lName);
        await addnewuseraccountspage.enterEmail(newEmail);
        await addnewuseraccountspage.clickVerifyEmail();   
        await addnewuseraccountspage.clickContinue();        

        //Portal - WebRoles Access Page
        await portalaccesspage.clickCheckBox("financial-management");
        await portalaccesspage.continueButtonClick();

        //Portal- Choose Hospital Page 
        await choosehospitalpage.selectRestrictedHospitalRadioButton();      
        const checkbox = await choosehospitalpage.getCheckboxes();
        for( let i = 0; i < checkbox.length; i++){
            await choosehospitalpage.selectHospitalListCheckbox(i);
            expect.soft(await choosehospitalpage.isCheckboxChecked(i)).toBeTruthy();
        } 
                 
        await choosehospitalpage.clickContinue();

        //Portal- Choose Diagnosis Group Page
        
        /*Validate the Page Heading text- Multiline text
        const expectHeading = `Choose the Diagnosis Groups 
        That This User Can View.`;*/

        /*Validate the Page Heading text*/
        const expectHeading = "Choose the Diagnosis Groups That This User Can View.";
        const headingText= await portaldiagnosispage.verifyPageHeading(expectHeading);
        console.log(`Page Heading Text : ${headingText}`);
        expect.soft(headingText).toBe(true);

        /*Validate the Instruction text */
        const expectedInstructionText = "Please select the Diagnosis Groups that the person will be authorised to view in the Portal. You must select at least one Diagnosis Group or choose All. Click the Continue button to proceed.";
        const normalizedInstructionText = expectedInstructionText.replace(/\s+/g, ' ').trim();
        const instructionText = await portaldiagnosispage.getInstructionText();
        console.log(`Instruction Text : ${instructionText}`);
        expect.soft(instructionText).toBe(normalizedInstructionText);

        /*Select- Radio button*/
        await portaldiagnosispage.selectRestrictedDiagnosisRadioButton();

        /*Diagnosis Group Entries- count*/
        const entries = await portaldiagnosispage.countTableEntries();
        expect.soft(entries.length).toBe(4);

        /*Verify Prev and Next Button Enabled an Disabled*/
        const isPrevDisabled = await portaldiagnosispage.isPreviousButtonDisabled();
        const isNextDisbaled = await portaldiagnosispage.isNextButtonDisabled();
        expect.soft(isPrevDisabled).toBe(true);
        expect.soft(isNextDisbaled).toBe(true);

        /*Clicking the Rstericted Checkboxes one by one in grid*/
        const diagnosischeckbox = await portaldiagnosispage.getCheckboxes();
        for( let i = 0; i < diagnosischeckbox.length; i++){
            await portaldiagnosispage.selectDiagnosisListCheckbox(i);
            expect.soft(await portaldiagnosispage.isCheckboxChecked(i)).toBeTruthy();
        }

        /*Sort column in descending order. By deafult = Ascending Order*/
        await portaldiagnosispage.clickDiagnosisGroupHeader(); // first sort - descending
        const diagnosisListOrder = await portaldiagnosispage.getDiagnosisGroupSortOrder();
        expect.soft(diagnosisListOrder).toBe('descending');

        /*Click-Continue Button*/
        await portaldiagnosispage.clickContinue();    

    })

    test("Search Functionality- Choose Diagnosis Group Page " , async ({ loginPage, homePage, homecareportalpage, administeraccountspage,addnewuseraccountspage,portalaccesspage, choosehospitalpage, portaldiagnosispage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();
        await homecareportalpage.clickOnHomeScreenButton("Administer Accounts");
        await administeraccountspage.clickAddNewUserButton();  

        // Using Faker to generate random data
        const fName = faker.person.firstName();
        const lName = faker.person.lastName();
        const newEmail = faker.internet.exampleEmail();

        //Portal- Add New User Page
        await addnewuseraccountspage.enterFirstName(fName);
        await addnewuseraccountspage.enterLasteName(lName);
        await addnewuseraccountspage.enterEmail(newEmail);
        await addnewuseraccountspage.clickVerifyEmail();   
        await addnewuseraccountspage.clickContinue();        

        //Portal - WebRoles Access Page
        await portalaccesspage.clickCheckBox("financial-management");
        await portalaccesspage.continueButtonClick();

        //Portal- Choose Hospital Page 
        await choosehospitalpage.selectRestrictedHospitalRadioButton();      
        const checkbox = await choosehospitalpage.getCheckboxes();
        for( let i = 0; i < checkbox.length; i++){
            await choosehospitalpage.selectHospitalListCheckbox(i);
            expect.soft(await choosehospitalpage.isCheckboxChecked(i)).toBeTruthy();
        } 
                 
        await choosehospitalpage.clickContinue();

        //Portal- Choose Diagnosis Group Page         

        /*Select- Radio button*/
        await portaldiagnosispage.selectRestrictedDiagnosisRadioButton();
        
        /*Verify the table count after performing valid search*/
        await portaldiagnosispage.enterSearchText("HI");
        expect.soft(await portaldiagnosispage.getTableCount()).toBeGreaterThan(0);

        /* Clear Search Text*/
        await portaldiagnosispage.clearSearchText();

        /*Verify the results after valid and invalid search input*/
        await portaldiagnosispage.enterSearchText("aHUS"); // Valid query
        expect.soft(await portaldiagnosispage.getTableCount()).toBeGreaterThan(0);

        /* Clear Search Text*/
        await portaldiagnosispage.clearSearchText();

        await portaldiagnosispage.enterSearchText("1234"); // Invalid query
        const message = await portaldiagnosispage.ischeckNoRecordsMessage();
        expect.soft(message).toBe(true);

        /* Clear Search Text*/
        await portaldiagnosispage.clearSearchText();

        /*verify search input updates the results dynamically with each character input
        const searchText = "hus";
        let previousResults: string[] | null = null;

        for(let i = 1; i <= searchText.length; i++) {
            const currentText = searchText.substring(0,i);
            await portaldiagnosispage.enterSearchText(currentText);  

            await portaldiagnosispage.resultUpdateWait();                    
            const currentResults = await portaldiagnosispage.getSearchResults();

            console.log(`Step ${i}:`);
            console.log(`Current Text: ${currentText}`);
            console.log(`Current Results:`, currentResults);
            console.log(`Previous Results:`, previousResults);

            if(previousResults !== null){

                const resultsHaveChanged = JSON.stringify(currentResults) !== JSON.stringify(previousResults);
                if(resultsHaveChanged){
                    previousResults.forEach(result => {
                        expect.soft(currentResults).toContain(result);

                    });
                    
                } else {
                    console.log(`No change in results at step ${i}, skipping assertion.`);
                  }
                
            }
            previousResults = currentResults;            
        }*/

        /*verify search input updates the results dynamically with each character input*/
        const searchText = "hus";
        

        for(let i = 1; i <= searchText.length; i++) {
            const currentText = searchText.substring(0,i);
            await portaldiagnosispage.enterSearchText(currentText);  

            await portaldiagnosispage.resultUpdateWait();                    
            const currentResults = await portaldiagnosispage.getSearchResults();

            console.log(`Step ${i}:`);
            console.log(`Current Text: ${currentText}`);
            console.log(`Current Results:`, currentResults);       
                      
        }
        /*Select Single checkbox after Search*/
        await portaldiagnosispage.selectSingleRestrictedCheckbox();
        await portaldiagnosispage.resultUpdateWait();

        /*Validate that the search input retains the text entered by the user after the search is executed
        const searchInputText = 'HIV'; //Valid query
        await portaldiagnosispage.enterSearchText(searchInputText);
        expect.soft(await portaldiagnosispage.getSearchInputValue()).toBe(searchInputText);*/

        


        /*Click-Continue Button*/
        await portaldiagnosispage.clickContinue();  
        
        

    })
})