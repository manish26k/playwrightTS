import { expect, Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { BasePage } from './basePage';
import { generateDynamicDate, formatDateToExpected } from '../utils/dateUtils';


export class PrescriptionTracker extends BasePage {

    readonly PT_backbutton: string = 'backbtn';
    readonly PT_statusflowdiagram: string = 'workorderpopup';
    readonly PT_closestatusflowdiagram: Locator = this.page.locator("//*[@class='close']");
    readonly PT_prescriptionfilterstatus: string  = 'mzk_status';
    readonly PT_searchTextBox: string = 'search';
    readonly PT_prescriptionoOption: string = 'showPrescriptions';
    readonly PT_prescriptiondropdown: string = '#showPrescriptions';
    readonly PT_edittracker: string = 'td:nth-child(2)';

    // Update Prescription Tracker Page
    readonly updatePT_viewRXRecord: string = 'viewrx';
    readonly updatePT_attachRX: string = 'AttachRX';

    readonly updatePT_SubmitRX: string = 'SubmitRx';
    readonly updatePT_yesSubmitRX: string = '#SubmitRxclickd #yesrx';
    readonly updatePT_noSubmitRX: string = '#SubmitRxclickd #norx';
    readonly updatePT_continueSubmitRX: string = '#SubmitRXyesclickd #yes';


    readonly updatePT_removePDFAttachmentButton: string  = 'remvattchmnt';
    readonly updatePT_yesRemovePDFAttachmentButton: string  = '#Remvbtnclickd #yes';
    readonly updatePT_noRemovePDFAttachmentButton: string  = '#Remvbtnclickd #no';
    readonly updatePT_continueButton: string = '#prescontnueclikd #yes';
    

    readonly updatePT_updateButton: string = 'Update';
    readonly updatePT_continueUpdateButton: string = '#updateclick #Continue';
    readonly updatePT_cancelUpdateButton: string = 'cancel';
    readonly updatePT_afterContinueUpdatedButton: string = '#updated #Continue';

    readonly updatePT_backButton: string = 'backbtn';
    readonly updatePT_clearAllDates: string = 'clear';

    readonly updatePT_confirmPaperRXSent: string = 'PaperRxSent';
    readonly updatePT_yesConfirmPaperRXSent: string = '#paperRxclickd #yespaperx';
    readonly updatePT_noConfirmPaperRXSent: string = '#paperRxclickd #nopaperx';
    readonly updatePT_continueConfirmPaperRXSent: string = '#PaperRXyesclickd .btn';

    readonly updatePT_confirmEmailRxSent: string = 'EmailRxSent';
    readonly updatePT_yesConfirmEmailRxSent: string = 'yesmailrx';
    readonly updatePT_noConfirmEmailRxSent: string = 'noemailrx';

    //Disable Four Date Fields
    readonly updatePT_prescriptionAttachedDate: string = 'tr:nth-child(7) > td:nth-child(2)';
    readonly updatePT_prescriptionAttachmentSubmittedDate: string = 'tr:nth-child(8) > td:nth-child(2)';
    readonly updatePT_paperPrescriptionSentToSciensusDate: string = 'tr:nth-child(9) > td:nth-child(2)';
    readonly updatePT_prescriptionEmailSentToSciensusDate: string = 'tr:nth-child(10) > td:nth-child(2)';

    //Disbale first 2 fields
    readonly updatePT_patientName: string = 'tr:nth-child(1) .form-control';
    readonly updatePT_trackingStatus: string = '#stsTracker';

    //Enable Four Date Fields
    readonly updatePT_Prescription_Created_By_Hospital_Date: string = 'input#prchosDt.form-control.hasDatepicker.dmy'; 
    readonly updatePT_Prescriber_Signature_Date: string = 'input#prsignDt.form-control.hasDatepicker.dmy';
    readonly updatePT_Hospital_Clinical_Check_Date: string = 'input#hosclnDt.form-control.hasDatepicker.dmy';
    readonly updatePT_Hospital_Homecare_Team_Approved_Date: string = 'input#hosappDt.form-control.hasDatepicker.dmy';

    readonly prescriptionInformationBackButton: string = 'aBack';


    //PDF- no pdf + pdf upload but not submitted + pdf submitted
    readonly updatePT_noPDFMessage: string = 'div#prescriptiondoc h4 strong';
    readonly updatePT_pdfMessageNotSubmitted: string = '#instructionText';
    readonly updatePT_pdfUploadedIframe: string = '#iframe';


    //Disable 2 button when no pdf uploaded
    readonly updatePT_submitRXButton: string = '[id=SubmitRx]';
    readonly updatePT_removeAttachmentButton: string = '[id=remvattchmnt]';

    //Disable 4 buttons when pdf already uploaded , but not submitted
    readonly updatePT_disbaleUpdateButton: string = 'input#Update';
    readonly updatePT_disableConfirmEmailRXSentButton: string = 'input#EmailRxSent';
    readonly updatePT_disableAttachRXButton: string = 'input#AttachRX';
    readonly updatePT_disableClearAllDatesButton: string = 'input#clear';


    //Verify Added/Updated dates in the Prescription Tracker Table
    readonly PT_rxCreatedDate: string = 'td.dtePresCreatedByHos';
    readonly PT_signedByPrescriberDate: string = 'td.dtePresSign';
    readonly PT_hospitalClinicalCheckdateDate: string = 'td.dteClinicalChk';
    readonly PT_hospitalHomeCareApprovedDate: string = 'td.dteHomeCareApp';





    


    async clickPT_backButton(): Promise<void>{
        await this.clickElementOnPage(this.PT_backbutton);
    }

    async click_closePT_statuFlowDiagram(): Promise<void>{
        await this.clickElementOnPage(this.PT_statusflowdiagram);
        await this.PT_closestatusflowdiagram.click();
    }

    async clickPT_prescription(): Promise<void>{
        await this.clickElementOnPage(this.PT_prescriptionoOption);
    }

    async selectPT_prescriptionType(options: string): Promise<void>{
        await this.selectDropdownOption(this.PT_prescriptiondropdown,options);
        await this.page.waitForTimeout(2000);

    }

    async clickPT_editTrackerButton(index: number){
        await this.page.locator(this.PT_edittracker).nth(index).click();
        await this.page.waitForTimeout(6000);

    }



    async click_removeAttachment(){
        await this.clickElementOnPage(this.updatePT_removePDFAttachmentButton);
    }

    async click_yesRemoveAttachment(){
        await this.page.click(this.updatePT_yesRemovePDFAttachmentButton);
    }

    async click_continueAfterClickYes(){
        await this.page.click(this.updatePT_continueButton);
        await this.page.waitForLoadState();
    }



    async click_submitRX(){
        await this.clickElementOnPage(this.updatePT_SubmitRX);
    }

    async click_yesSubmitRX(){
        await this.page.click(this.updatePT_yesSubmitRX);
    }

    async click_continueSubmitRX(){       
        await this.page.click(this.updatePT_continueSubmitRX);
        await this.page.waitForLoadState();        
    }


    async click_ConfirmPaperRXSent(){
        await this.clickElementOnPage(this.updatePT_confirmPaperRXSent);
    }

    async click_yesConfirmPaperRXSent(){
        await this.page.click(this.updatePT_yesConfirmPaperRXSent);
    }

    async click_continueConfirmPaperRXSent(){
        await this.page.click(this.updatePT_continueConfirmPaperRXSent);
        await this.page.waitForLoadState();
    }


    async editTracker_getInputFieldValue(){
        return this.page.locator(this.updatePT_patientName).inputValue();

    }

    async getTrackingStatusFieldValue(){
        return this.page.locator(this.updatePT_trackingStatus).inputValue();
    }

    

    async isInputFielReadOnly(){
        return await this.page.isEditable(this.updatePT_patientName);
    }

    async isTrackerStatusReadOnly(){
        return await this.page.isEditable(this.updatePT_trackingStatus);
    }

    async isPrescriptionCreatedByHospitalDateEnabled(){
        const dateField = await this.page.$(this.updatePT_Prescription_Created_By_Hospital_Date);
        return dateField?.isEnabled();
    }

    async  isPrescriptionAttachedDateReadOnly(){
        return await this.page.isEditable(this.updatePT_prescriptionAttachedDate);
    }

    async  isPrescriptionAttachmentSubmittedDateReadOnly(){
        return await this.page.isEditable(this.updatePT_prescriptionAttachmentSubmittedDate);
    }

    async  isPaperPrescriptionSenttoSciensusDateReadOnly(){
        return await this.page.isEditable(this.updatePT_paperPrescriptionSentToSciensusDate);
    }

    async  isPrescriptionEmailSenttoSciensusDateReadOnly(){
        return await this.page.isEditable(this.updatePT_prescriptionEmailSentToSciensusDate);
    }


   
    async getNoPdfMessageText(){
        return await this.page.textContent(this.updatePT_noPDFMessage);
    }

    async getInstructionText(){
        return await this.page.textContent(this.updatePT_pdfMessageNotSubmitted);
    }

    async verifyPDFUpLoaded(){
        const src = await this.page.getAttribute(this.updatePT_pdfUploadedIframe, 'src');
        if (!src || !src.endsWith('/pdf')) {
            throw new Error('PDF is not uploaded or iframe src attribute is incorrect.');
        }

        expect.soft(src).toContain('data:application/pdf;base64');
    }


    async isPdfLoaded(){
        await this.page.waitForSelector(this.updatePT_pdfUploadedIframe, { state: 'attached'});
        const iframeElement = await this.page.$(this.updatePT_pdfUploadedIframe);        
        // Ensure the iframe element exists
        if (!iframeElement) {
        throw new Error('Iframe element not found');
        }

        const iframeId = await iframeElement.getAttribute('id') as string | undefined;;
        const iframePdf = await this.page.frame({ name: iframeId });
        return iframePdf !== null;
    }


    //when pdf not uploaded- button disabled
    async isSubmitRxButtonDisbaled(){
        const button = await this.page.$(this.updatePT_submitRXButton);
        return (await button?.getAttribute('disabled')) == 'true';
    }

    async isRemoveAttachmentButtonDisabled(){
        const button = await this.page.$(this.updatePT_removeAttachmentButton);
        return (await button?.getAttribute('disabled')) == 'true';
    }

    //When pdf upload but not submitted- button disabled
    async isButtonDisbaled(locator: string): Promise<boolean> {
        return this.page.$eval(locator,(btn) => btn.hasAttribute('disabled'));
        
        
    }


    async enterPTSearch(text: string){
        await this.enterSearchText(this.PT_searchTextBox,text);
    }

    async clickBackButton(){
        await this.clickElementOnPage(this.updatePT_backButton);
    }


    //Entering the date in the Enable Date field- when no pdf uploaded
    async clickPrescriptionCreated_Date(): Promise<string> {
       const rxCreatedDate= await this.setDateInput(this.updatePT_Prescription_Created_By_Hospital_Date);
       await this.page.waitForTimeout(2000);
       return rxCreatedDate;
     
    }

    async clickPrescriberSignature_Date(): Promise<string>{
        return await this.setDateInput(this.updatePT_Prescriber_Signature_Date);
        
    }

    async clickHospitalClinicalCheck_Date(): Promise<string>{
        return await this.setDateInput(this.updatePT_Hospital_Clinical_Check_Date);
        
    }

    async clickHospitalHomecareTeamApproved_Date(): Promise<string>{
        return await this.setDateInput(this.updatePT_Hospital_Homecare_Team_Approved_Date);
    }

    async clickUpdate_and_Continue(){
        await this.clickElementOnPage(this.updatePT_updateButton);
        await this.page.click(this.updatePT_continueUpdateButton);
        await this.page.click(this.updatePT_afterContinueUpdatedButton);
        await this.page.waitForTimeout(2000);
    } 
    
    
    async clickClearAllDates(){
        await this.clickElementOnPage(this.updatePT_clearAllDates);
    }

    async setDateInput(locator: string): Promise<string>{
       const dynamicDate = generateDynamicDate();            
        await this.page.click(locator)
        await this.page.fill(locator, dynamicDate);
        return dynamicDate;
    }


    async getDateFromTable(locator: string): Promise<string> {
        // Get the text content of the table cell containing the date
        const dateText = await this.page.textContent(locator);
        if (!dateText) {
            throw new Error('Date text not found');
        }
        return dateText.trim();
    }

    async verifyDateInTable(expectedDate: string, locator: string): Promise<void> {
        const actualDate = await this.getDateFromTable(locator);
        if (actualDate !== expectedDate) {
            throw new Error(`Expected date: ${expectedDate}, but found: ${actualDate}`);
        }
    }

    


}


