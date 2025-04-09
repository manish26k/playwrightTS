import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import path from 'path';
import { formatDateToExpected } from '../utils/dateUtils';


const prescriptionTrackerOptions = [
    'Show me Prescriptions that I need to send to Sciensus immediately',
    'Show me Prescriptions that I need to send to Sciensus in the next 2 – 5 weeks',
    'Show me the Prescriptions that Sciensus have received in the past 7 days',
    'Show me the Prescriptions that I have confirmed as sent and Sciensus have received.',
    'Show me the Prescriptions that I have confirmed as sent that Sciensus have not been received.',
    'Show me received Prescriptions that are not yet ready to dispense',
    'Show me the latest prescriptions held by Sciensus',
    'Show me Attached Prescriptions awaiting Submittal',
    'Show me Paper Copy Prescriptions that I need to send'
  ];

test.describe("Sciensus Portal- Prescription Tracker Page Functionality", () => {

    test.beforeEach(async ({ homePage, loginPage,homecareportalpage}) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        await loginPage.loginToPortal(true);
        await loginPage.clickLoginButton(); 
        await homecareportalpage.clickOnHomeScreenButton('Prescription Tracker');    
 
    });

    test.afterEach(async ({ page}) =>{
        await page.close();
    });

    

    test("Prescription Tracker- selecting Prescriptions Options", async ({ prescriptiontrackerpage }) => {
         
        await prescriptiontrackerpage.clickPT_prescription();
        const selectOption = prescriptionTrackerOptions[6];
        await prescriptiontrackerpage.selectPT_prescriptionType(selectOption);
        await prescriptiontrackerpage.click_closePT_statuFlowDiagram();       

    });

    test("Prescription Tracker- Back + Status Flow Diagram functionality", async ({ homecareportalpage,prescriptiontrackerpage }) => {
         
        await prescriptiontrackerpage.click_closePT_statuFlowDiagram(); 
        await prescriptiontrackerpage.clickPT_backButton(); 
        await homecareportalpage.clickOnHomeScreenButton('Prescription Tracker');   

    });

    test("Prescription Tracker- Click Edit Tracker", async ({ prescriptiontrackerpage }) => {
         
        await prescriptiontrackerpage.clickPT_prescription();
        const selectOption = prescriptionTrackerOptions[6];
        await prescriptiontrackerpage.selectPT_prescriptionType(selectOption);
        await prescriptiontrackerpage.clickPT_editTrackerButton(2);

               

    });

    test("Update Prescription Tracker- Retain Disable Input Field Values after Refresh", async ({ page,prescriptiontrackerpage }) => {
         
        await prescriptiontrackerpage.clickPT_prescription();
        const selectOption = prescriptionTrackerOptions[6];
        await prescriptiontrackerpage.selectPT_prescriptionType(selectOption);
        await prescriptiontrackerpage.clickPT_editTrackerButton(2);

        const initialValue = await prescriptiontrackerpage.editTracker_getInputFieldValue();
        expect.soft(initialValue).toBe('Katie Perry');

        await page.reload();
        const refreshedValue = await prescriptiontrackerpage.editTracker_getInputFieldValue();
        expect.soft(refreshedValue).toBe('Katie Perry');
               

    });

    test("Update Prescription Tracker- Verify Disbale Input and Dates Field", async ({ prescriptiontrackerpage }) => {
         
        await prescriptiontrackerpage.clickPT_prescription();
        const selectOption = prescriptionTrackerOptions[6];
        await prescriptiontrackerpage.selectPT_prescriptionType(selectOption);
        await prescriptiontrackerpage.clickPT_editTrackerButton(2);

        const isEditablePatientName = await prescriptiontrackerpage.isInputFielReadOnly();
        expect.soft(isEditablePatientName).toBe(false);

        const isEditableTrackerStatus = await prescriptiontrackerpage.isTrackerStatusReadOnly();
        expect.soft(isEditableTrackerStatus).toBe(false);

        const isEditablePrescriptionAttachedDate = await prescriptiontrackerpage.isPrescriptionAttachedDateReadOnly();
        expect.soft(isEditablePrescriptionAttachedDate).toBe(true);

        const isEditablePrescriptionAttachmentSubmittedDate = await prescriptiontrackerpage.isPrescriptionAttachmentSubmittedDateReadOnly();
        expect.soft(isEditablePrescriptionAttachmentSubmittedDate).toBe(true);

        const isEditablePaperPrescriptionSenttoSciensusDate = await prescriptiontrackerpage.isPaperPrescriptionSenttoSciensusDateReadOnly();
        expect.soft(isEditablePaperPrescriptionSenttoSciensusDate).toBe(true);

        const isEditablePrescriptionEmailSenttoSciensusDate = await prescriptiontrackerpage.isPrescriptionEmailSenttoSciensusDateReadOnly();
        expect.soft(isEditablePrescriptionEmailSenttoSciensusDate).toBe(true);

        
               

    });

    test("Update Prescription Tracker- When NO PDF Uploaded + 2 Button Disbaled", async ({ prescriptiontrackerpage }) => {
         
        await prescriptiontrackerpage.clickPT_prescription();
        const selectOption = prescriptionTrackerOptions[6];
        await prescriptiontrackerpage.selectPT_prescriptionType(selectOption);
        await prescriptiontrackerpage.clickPT_editTrackerButton(0);

        const messageText = await prescriptiontrackerpage.getNoPdfMessageText();
        expect.soft(messageText).toBe('There is no PDF record available for this Prescription'); 
        
        const submitRxButtonDisabled = await prescriptiontrackerpage.isSubmitRxButtonDisbaled();
        expect.soft(submitRxButtonDisabled).toBeTruthy();

        const removeAttachmentButtonDisabled = await prescriptiontrackerpage.isRemoveAttachmentButtonDisabled();
        expect.soft(removeAttachmentButtonDisabled).toBeTruthy();
          

    });

    test("Update Prescription Tracker- Already PDF Uploadeded-not Submitted + 4 Button Disabled + Tracking Status Text", async ({ prescriptiontrackerpage }) => {
         
        await prescriptiontrackerpage.clickPT_prescription();
        const selectOption = prescriptionTrackerOptions[6];
        await prescriptiontrackerpage.selectPT_prescriptionType(selectOption);
        await prescriptiontrackerpage.clickPT_editTrackerButton(1);
        const instructionText = await prescriptiontrackerpage.getInstructionText();
        expect.soft(instructionText).toBe('You are viewing the Patient’s Prescription Attachment'); 

        const trackingStatusValue = await prescriptiontrackerpage.getTrackingStatusFieldValue();
        console.log("the tracking Status in Update Tracker Page: " +"-------->"+  trackingStatusValue)
        expect.soft(trackingStatusValue).toContain('Rx Attached - Not Submitted');

        const isUpdateButtonDisabled = await prescriptiontrackerpage.isButtonDisbaled(prescriptiontrackerpage.updatePT_disbaleUpdateButton);
        expect.soft(isUpdateButtonDisabled).toBe(true);

        const isConfirmEmailRXDisabled = await prescriptiontrackerpage.isButtonDisbaled(prescriptiontrackerpage.updatePT_disableConfirmEmailRXSentButton);
        expect.soft(isConfirmEmailRXDisabled).toBe(true);

        const isAttachRXDisabled = await prescriptiontrackerpage.isButtonDisbaled(prescriptiontrackerpage.updatePT_disableAttachRXButton);
        expect.soft(isAttachRXDisabled).toBe(true);

        const isClearAllDatesDisabled = await prescriptiontrackerpage.isButtonDisbaled(prescriptiontrackerpage.updatePT_disableClearAllDatesButton);
        expect.soft(isClearAllDatesDisabled).toBe(true);

        

        


          

    });

    test("Update Prescription Tracker- Verify already PDF Uploadeded ", async ({ prescriptiontrackerpage }) => {
         
        await prescriptiontrackerpage.clickPT_prescription();
        const selectOption = prescriptionTrackerOptions[6];
        await prescriptiontrackerpage.selectPT_prescriptionType(selectOption);
        await prescriptiontrackerpage.clickPT_editTrackerButton(1);
        await prescriptiontrackerpage.isPdfLoaded();    
     

    });

    test("Update Prescription Tracker- Remove PDF Attachment", async ({ prescriptiontrackerpage }) => {
         
        await prescriptiontrackerpage.clickPT_prescription();
        const selectOption = prescriptionTrackerOptions[6];
        await prescriptiontrackerpage.selectPT_prescriptionType(selectOption);
        await prescriptiontrackerpage.clickPT_editTrackerButton(1);

        await prescriptiontrackerpage.click_removeAttachment();
        await prescriptiontrackerpage.click_yesRemoveAttachment();
        await prescriptiontrackerpage.click_continueAfterClickYes();

        const isrxAttachedDate = await prescriptiontrackerpage.isPrescriptionCreatedByHospitalDateEnabled();
        expect.soft(isrxAttachedDate).toBe(true);      

    });

    test("Update Prescription Tracker- Already PDF Uploaded then Submite RX Attachment", async ({ prescriptiontrackerpage }) => {         
        await prescriptiontrackerpage.clickPT_prescription();
        const selectOption = prescriptionTrackerOptions[6];
        await prescriptiontrackerpage.selectPT_prescriptionType(selectOption);
        await prescriptiontrackerpage.clickPT_editTrackerButton(1);

        await prescriptiontrackerpage.click_submitRX();
        await prescriptiontrackerpage.click_yesSubmitRX();
        await prescriptiontrackerpage.click_continueSubmitRX();              

    });

    test("Update Prescription Tracker- Already PDF submitted then Confirm Paper RX Sent", async ({ prescriptiontrackerpage }) => {         
        await prescriptiontrackerpage.clickPT_prescription();
        const selectOption = prescriptionTrackerOptions[6];
        await prescriptiontrackerpage.selectPT_prescriptionType(selectOption);
        await prescriptiontrackerpage.clickPT_editTrackerButton(1);

        await prescriptiontrackerpage.click_ConfirmPaperRXSent();
        await prescriptiontrackerpage.click_yesConfirmPaperRXSent();
        await prescriptiontrackerpage.click_continueConfirmPaperRXSent();
       
    });

    test.only("Update Prescription Tracker- Enter Date input when NO PDF is uploaded", async ({ prescriptiontrackerpage }) => {         
        await prescriptiontrackerpage.clickPT_prescription();
        const selectOption = prescriptionTrackerOptions[6];
        await prescriptiontrackerpage.selectPT_prescriptionType(selectOption);
        await prescriptiontrackerpage.clickPT_editTrackerButton(4);

        //await prescriptiontrackerpage.clickClearAllDates();

        const generatedDate  = await prescriptiontrackerpage.clickPrescriptionCreated_Date();
        console.log("PrescriptionCreatedDate is :"+"------->"+ generatedDate );
            
        await prescriptiontrackerpage.clickPrescriberSignature_Date();
        await prescriptiontrackerpage.clickHospitalClinicalCheck_Date();
        await prescriptiontrackerpage.clickHospitalHomecareTeamApproved_Date();
        await prescriptiontrackerpage.clickUpdate_and_Continue(); 
        await prescriptiontrackerpage.clickBackButton();
        
        await prescriptiontrackerpage.enterPTSearch("Rachel");        
        
        const expectedFormattedDate = formatDateToExpected(generatedDate);
        console.log("ExpectedFormattedDate is: " +"-------->"+ expectedFormattedDate);
        
        await prescriptiontrackerpage.verifyDateInTable(expectedFormattedDate,prescriptiontrackerpage.PT_rxCreatedDate);
    
    });


    

})




