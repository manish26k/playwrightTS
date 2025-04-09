export class CommonLocators{
    
    // Portal User Page- Page heading and instruction text
    static verifyPageHeadingName = 'h1.portHeading';
    static instructionText = '.portal-desc';  
    
    //Portal User Page- select: Radio button, checkbox,sorting,pagination,tableEntriesCount
    static restrictedRadioButton = 'input[id="prescription"]';
    static previousButton = '#records_previous';
    static nextButton = '//*[@id="records_next"]';
    static continueButton = '//*[@id="ContinueButton"]';
    static tableEntries = '#records tbody tr';
    static tableHeader = '//*[@id="records"]/thead/tr/th[1]';
    static restrictedcheckboxes = 'input[type="checkbox"]';

}