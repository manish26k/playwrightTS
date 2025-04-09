import axios from 'axios';
import { testConfig } from '../testConfig';
import { apiTestConfig } from '../utils/mailSlurpEndpoints';

const mailSlurpApi = axios.create({
    baseURL: apiTestConfig.baseUrl,
    headers: { 'x-api-key': apiTestConfig.apiKEY }
});

export async function postCreateInbox(){
    const response = await mailSlurpApi.post(apiTestConfig.createInbox);
    return response.data;
}

export async function getInboxEmails(inboxId: string): Promise<any[]> {
    const respone = await mailSlurpApi.get(apiTestConfig.inboxEmails(inboxId));
    return respone.data;
    
}

export async function getEmailContent(emailId: string) {
    const response = await mailSlurpApi.get(apiTestConfig.emailContent(emailId));
    return response.data;
  }

export async function waitForLatestEmail(inboxId: string, timeout = 60000){
    const pollInterval = 3000;
    const endTime = Date.now() + timeout;
    
  
    while (Date.now() < endTime) {
      const emails = await getInboxEmails(inboxId);
      if (emails.length > 0) {
        const email = await getEmailContent(emails[0].id);
        const credentials = extractCredentials(email.body);
        return credentials;
        
      }
      await new Promise(res => setTimeout(res, pollInterval));
    }
  
    throw new Error('No email received within the timeout period');
}

export async function waitForEmailLatest(inboxId: string, subject: string, timeout = 60000) {
    const pollInterval = 3000;
    const endTime = Date.now() + timeout;
  
    while (Date.now() < endTime) {
      const emails = await getInboxEmails(inboxId);
  
      // Check for specific subject email
      const emailWithSubject = emails.find((email: any) => email.subject === subject);
      if(emailWithSubject){
        return getEmailContent(emailWithSubject.id);
      }     
  
      await new Promise(res => setTimeout(res, pollInterval));
    }
  
    throw new Error('No email with the required subject or credentials received within the timeout period');
  }

  export function extractCredentials(emailBody: string){

    const usernameMatch = cleanHtmlTags(emailBody).match(/Username:\s*([^\s]+)/);
    const passwordMatch = cleanHtmlTags(emailBody).match(/Password:\s*([^\s]+)/);
  
    return {
      username: usernameMatch ? usernameMatch[1] : null,
      password: passwordMatch ? passwordMatch[1] : null,
    };
  }

export function extractVerificationCode(emailBody: string): string|null {
    const verificationCodeMatch = cleanHtmlTags(emailBody).match(/Your code is:\s(\d+)/);
    return verificationCodeMatch ? verificationCodeMatch[1] : null;
}







/*****************************cleanHtmlTags*************************************/ 

function cleanHtmlTags(input: string): string {
    return input.replace(/<br>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
}
  