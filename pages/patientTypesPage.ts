import { Page, Locator } from '@playwright/test';
import logger from '../utils/loggerUtils';
import { CommonLocators } from './CommonLocators';

export class PatientCategoryPage{
    private page: Page;
    readonly adultRadioButton: Locator;
    readonly paediatricRadioButton: Locator;
    readonly bothradioButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.adultRadioButton = this.page.locator('#Adult');
        this.paediatricRadioButton = this.page.locator('#Paediatric');
        this.bothradioButton = this.page.locator('#Both');
    }

    /* verify the Page Heading */
    async verifyPageHeading(expectedHeading: string){
        const heading = await this.page.textContent(CommonLocators.verifyPageHeadingName);
        return heading === expectedHeading;
        //return heading ? heading.replace(/\s+/g, ' ').trim() : '';
    }

     /* verify the Page Instruction Text */
      async getInstructionText(){
         const text = await this.page.textContent(CommonLocators.instructionText);
         return text?.replace(/\s+/g, ' ').trim(); //Normalize whitespace        
    }


   /*Select- Adult Patients*/
    async selectAdultPatients(){
        await this.adultRadioButton.click();
    }

    /*Select- Paediatric  Patients*/
    async selectPaediatricPatients(){
        await this.paediatricRadioButton.click();
    }

    /*Select- Both*/
    async selectBothPatients(){
        await this.bothradioButton.click();
    }

    /*Uncheck All- Radio button*/
    async uncheckAll(){
        await this.adultRadioButton.uncheck();
        await this.paediatricRadioButton.uncheck();
        await this.bothradioButton.uncheck();
    }

    /*Continue Button- Enabled*/
    async isContinueButtonEnabled(){
        return await this.page.isEnabled(CommonLocators.continueButton);
    }
    
    /* Click- Continue button*/
    async clickContinueButton(){
        await this.page.click(CommonLocators.continueButton);
    }

    /*Radio Button- Checked*/
    async isRadioButtonChecked(radioButton: Locator){
        return await radioButton.isChecked();
    }

    /* Verify Only One Radio Button Selected*/
    async selectPatientType(patientType: 'Adult' | 'Paediatric' | 'Both'){
        switch(patientType){
            case 'Adult':
                await this.adultRadioButton.check();
                await this.page.waitForTimeout(500);
                break;
            case 'Paediatric':                
               await this.paediatricRadioButton.check();              
               await this.page.waitForTimeout(500);
               break;
            case 'Both':                    
               await this.bothradioButton.check();
               await this.page.waitForTimeout(500);
               break;  
        }
    }



    
}