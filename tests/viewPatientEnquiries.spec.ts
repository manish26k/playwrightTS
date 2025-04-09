import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { generateRandomString }   from "../utils/stringUtils"
import { faker } from '@faker-js/faker/locale/en';
//import { sharedContext } from '../utils/shared-context';

let sharedContext: { searchText: string } = { searchText: '' };

const dropdownOptions = [
    'New Patient Registration Enquiry', 
    'Change Patient Account Details', 
    'Change Patient Delivery Details', 
    'Prescription Showing as Expired but is Still Valid', 
    'Prescription Not Showing in Portal but Confirmed as Received', 
    'Prescription Renewal Request Enquiry', 
    'Patient Medication Delivery Enquiry', 
    'Clinical Visit Enquiry', 
    'Place Patient On Hold (Give Reason)', 
    'Take Patient Off Hold (Give Reason)', 
    'Finish Patient Service (Give Reason)', 
    'Missed Dose Enquiry', 
    'Complaint or Incident', 
    'Other Patient Enquiry'
];

test.describe("Sciensus Portal- View Patients Enquiries Page Functionality", () => {

    test.beforeEach(async ({ homePage, loginPage}) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton();     
 
    });

    test.afterEach(async ({ page}) =>{
        await page.close();
    });

    

    test.only("Create and View  Patient Enquiry Functionality", async ({ page, homecareportalpage,searchpatientpage, createandviewenquirypage }) => {
        await homecareportalpage.clickOnHomeScreenButton('Search for a Patient'); // for creation enquiry
        await searchpatientpage.enterValue("nhschinumber","6543215");
        await searchpatientpage.clickSearchButton();
        await searchpatientpage.clickShowMoreButton();
        await createandviewenquirypage.clickContactUs();
        await createandviewenquirypage.clickEnquiryCategory();

        const selectOption = dropdownOptions[9]; 
        await createandviewenquirypage.selectEnquiryType(selectOption);

        // const enquiry_subject = "Subject_" + generateRandomString(8);
        // const enquiry_details = "Details_" + generateRandomString(10);

        const enquiry_subject = "Enq_SUBJECT_" + faker.lorem.sentence();
        const enquiry_details = "Enq_DETAILS_" + faker.lorem.sentence();     
   
        await createandviewenquirypage.enterSubject(enquiry_subject);
        await createandviewenquirypage.enterDetails(enquiry_details); 
        await createandviewenquirypage.clickSubmitButton();
        await createandviewenquirypage.clickContinueButton();        
        await createandviewenquirypage.clickSciensusLogo();

        await homecareportalpage.clickOnHomeScreenButton('View Patient Enquiries'); // for view enquiries
        const enquirySelectOption = dropdownOptions[9]; 
        await createandviewenquirypage.selectEnquiryType(enquirySelectOption);
        await createandviewenquirypage.enterEnquiryPatientHospitalNumber("5241254");
        await createandviewenquirypage.enterEnquirySearchText(enquiry_subject);

        const subjectText = await createandviewenquirypage.getEnquirySubjectText();
        expect.soft(subjectText).toContain(enquiry_subject);
        
        

    });

    test("Create Patient Enquiry Functionality", async ({ homecareportalpage,searchpatientpage, createandviewenquirypage }) => {
        await homecareportalpage.clickOnHomeScreenButton('Search for a Patient'); // for creation enquiry
        await searchpatientpage.enterValue("nhschinumber","6543215");
        await searchpatientpage.clickSearchButton();
        await searchpatientpage.clickShowMoreButton();
        await createandviewenquirypage.clickContactUs();
        await createandviewenquirypage.clickEnquiryCategory();

        const selectOption = dropdownOptions[7]; 
        await createandviewenquirypage.selectEnquiryType(selectOption);        

        const enquiry_subject = "Enq_SUBJECT_" + faker.lorem.sentence();
        const enquiry_details = "Enq_DETAILS_" + faker.lorem.sentence(); 
        
        // Save data in shared context
        sharedContext.searchText = enquiry_subject;
        // Log the saved subject for debugging
        console.log('Saved enquiry_subject to context:', sharedContext.searchText);
   
        await createandviewenquirypage.enterSubject(sharedContext.searchText);
        await createandviewenquirypage.enterDetails(enquiry_details); 
        await createandviewenquirypage.clickSubmitButton();
    });
    
    
    test("View Patient Enquiry Functionality", async ({ homecareportalpage,createandviewenquirypage }) => {

        await homecareportalpage.clickOnHomeScreenButton('View Patient Enquiries'); // for view enquiries
        const enquirySelectOption = dropdownOptions[7]; 
        await createandviewenquirypage.selectEnquiryType(enquirySelectOption);
        await createandviewenquirypage.enterEnquiryPatientHospitalNumber("5241254");
       

        await createandviewenquirypage.enterEnquirySearchText(sharedContext.searchText);

        const subjectText = await createandviewenquirypage.getEnquirySubjectText();
        expect.soft(subjectText).toContain(sharedContext.searchText);                  

    });

    

    

    



    
    

    


})