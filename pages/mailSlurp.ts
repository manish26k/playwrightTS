import { MailSlurp, MatchOptionFieldEnum, MatchOptionShouldEnum } from 'mailslurp-client';
import { ConfigHelper } from '../utils/configHelper';




interface EmailContent {
  username: string;
  password: string;
}

interface VerificationCode {
  code: string;
}

export class MailSlurpHelper {
  private mailslurp: MailSlurp;
  private apiKey: string;
  

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.mailslurp = new MailSlurp({apiKey});
  }
  
  /******************************createNewInbox***************************************/
  async createNewInbox(): Promise<{ id: string, emailAddress: string }> {
    const inbox = await this.mailslurp.createInbox();
    return { id: inbox.id, emailAddress: inbox.emailAddress };
  }
  
  /******************************extractUsernameAndPassword****************************/
  async extractUsernameAndPassword(inboxId: string): Promise<EmailContent> {
    const email = await this.retry(async () =>{
      const emails = await this.mailslurp.getEmails(inboxId);
      const emailPreview = emails[0];
      //const email = await this.mailslurp.getEmail(emailPreview.id);
      return this.mailslurp.getEmail(emailPreview.id);
    });    

    if (email.body) {
      const usernameMatch = email.body.match(/Username:\s([^\s]+)/);
      const passwordMatch = email.body.match(/Password:\s([^\s]+)/);

      const username = cleanHtmlTags(usernameMatch ? usernameMatch[1] : '');
      const password = cleanHtmlTags(passwordMatch ? passwordMatch[1] : '');

      ConfigHelper.saveCredentials({ inboxId, username, password });

      return { username, password };
    } else {
      return { username: '', password: '' };
    }
  } 
  
  /************************extractVerificationCode**************************************/ 
  async extractVerificationCode(inboxId: string): Promise<string | null> {
    const email = await this.retry(async () => {
      const emails = await this.mailslurp.waitController.waitForMatchingEmails({
        inboxId: inboxId,
        count: 1,
        matchOptions: {
          matches: [{ field: MatchOptionFieldEnum.SUBJECT, should: MatchOptionShouldEnum.CONTAIN, value: "Sciensus account email verification code" }]
        }
      });
      
      
  
      const emailPreview = emails[0];
      return this.mailslurp.getEmail(emailPreview.id);
    });

    if (email.body) {
      const codeMatch = cleanHtmlTags(email.body).match(/Your code is:\s(\d+)/);
      return codeMatch ? codeMatch[1] : null;
    } else {
      return null;
    }
  }


  /************************extractVerificationCode01**************************************/ 

  async extractVerificationCode01(inboxId: string): Promise<string | null> {
      const emails = await this.mailslurp.waitController.waitForMatchingEmails({
       
        inboxId: inboxId,
        count: 1,
        matchOptions: {
          matches: [{ field: MatchOptionFieldEnum.SUBJECT, should: MatchOptionShouldEnum.CONTAIN, value: "Sciensus account email verification code" }]
        }
      });

      if (emails.length === 0) {
        return null;
      }
      
      const emailPreview = emails[0];
      const email = await this.mailslurp.getEmail(emailPreview.id);
   

    if (email.body) {
      const codeMatch = cleanHtmlTags(email.body).match(/Your code is:\s(\d+)/);
      return codeMatch ? codeMatch[1] : null;
    } else {
      return null;
    }
  }

  /************************extractVerificationCode02**************************************/ 

  async extractVerificationCode02(inboxId: string): Promise<string | null> {
    const email = await this.mailslurp.waitController.waitForLatestEmail({
      inboxId: inboxId,
      timeout: 60000,  // 60 seconds timeout
      unreadOnly: true
    });

    if (!email || !email?.subject || !email?.subject.includes("Sciensus account email verification code")) {
      return null;
    }

    if (email?.body) {
      const codeMatch = cleanHtmlTags(email.body).match(/Your code is:\s(\d+)/);
      return codeMatch ? codeMatch[1] : null;
    } else {
      return null;
    }
  }


  /************************extractVerificationCode03**************************************/
  async extractVerificationCode03(inboxId: string): Promise<string | null> {
    const emails = await this.mailslurp.waitController.waitForMatchingEmails({
      inboxId: inboxId,
      count: 1,
      timeout: 60000,  // 60 seconds timeout
      unreadOnly: true,
      matchOptions: {
        matches: [{ field: MatchOptionFieldEnum.SUBJECT, should: MatchOptionShouldEnum.CONTAIN, value: 'Sciensus account email verification code' }]
      }
    });

    if (emails.length === 0) {
      return null;
    }

    for (const emailPreview of emails) {
      const email = await this.mailslurp.emailController.getEmail({emailId: emailPreview.id});
      if (email.subject && email.subject.includes('Sciensus account email verification code') && email.body) {
        const codeMatch = cleanHtmlTags(email.body).match(/Your code is:\s(\d+)/);
        return codeMatch ? codeMatch[1] : null;
      }
    }
    return null;
  }


   /******extractVerificationCode03- from 2 EMAILS ************/
   async extractVerificationCodes(inboxId: string | null | undefined): Promise<string[] | null> {
    if (!inboxId) {
      console.error("Error: Received null or undefined inboxId in extractVerificationCodes.");
      throw new Error("Inbox ID is required but received null or undefined.");
    }

    console.log(`Fetching OTPs from inboxId: ${inboxId}`);

    const emails = await this.mailslurp.waitController.waitForMatchingEmails({
        inboxId: inboxId,
        count: 2, // Fetch 2 emails
        timeout: 80000,  // 80 seconds timeout
        unreadOnly: true,
        matchOptions: {
            matches: [{ 
                field: MatchOptionFieldEnum.SUBJECT, 
                should: MatchOptionShouldEnum.CONTAIN, 
                value: 'Sciensus account email verification code' 
            }]
        }
    });

    if (!emails || emails.length === 0) {
      console.warn(`No emails found in inboxId: ${inboxId}`);
      return null;
  }

    let otpCodes: string[] = [];

    for (const emailPreview of emails) {
        const email = await this.mailslurp.emailController.getEmail({ emailId: emailPreview.id });

        if (email.subject?.includes('Sciensus account email verification code') && email.body) {
            const codeMatch = cleanHtmlTags(email.body).match(/Your code is:\s(\d+)/);
            if (codeMatch) {
                otpCodes.push(codeMatch[1]);
            }
        }
    }

    if (otpCodes.length === 0) {
      console.warn(`No OTPs extracted from emails in inboxId: ${inboxId}`);
  }

    return otpCodes.length > 0 ? otpCodes : null;
}

/******extractVerificationCode04- from 2 EMAILS ************/
async extractVerificationCodes01(inboxId: string | null | undefined): Promise<string[] | null> {
  if (!inboxId) {
      console.error("Error: Received null or undefined inboxId in extractVerificationCodes.");
      throw new Error("Inbox ID is required but received null or undefined.");
  }

  console.log(`Fetching OTPs from inboxId: ${inboxId}`);

  // ✅ Step 1: Wait for two emails with a longer timeout (90s)
  const emails = await this.mailslurp.waitController.waitForMatchingEmails({
      inboxId: inboxId,
      count: 2, // Fetch 2 emails
      timeout: 90000, // Increased timeout to 90s
      matchOptions: {
          matches: [{
              field: MatchOptionFieldEnum.SUBJECT,
              should: MatchOptionShouldEnum.CONTAIN,
              value: 'Sciensus account email verification code'
          }]
      }
  });

  if (!emails || emails.length === 0) {
      console.warn(`No emails found in inboxId: ${inboxId}`);
      return null;
  }

  // ✅ Step 2: Sort emails by creation time (earliest first)
  emails.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  console.log(`Received ${emails.length} OTP emails.`);

  let otpCodes: string[] = [];

  for (const email of emails) {
      const fullEmail = await this.mailslurp.emailController.getEmail({ emailId: email.id });

      if (fullEmail.body) {
          const codeMatch = cleanHtmlTags(fullEmail.body).match(/Your code is:\s(\d+)/);
          if (codeMatch) {
              otpCodes.push(codeMatch[1]);
          }
      }
  }

  console.log(`Extracted OTPs: ${otpCodes.join(", ")}`);

  return otpCodes.length > 0 ? otpCodes : null;
}


/******extractVerificationCode05- from 2 EMAILS ************/
async fetchOTPs(inboxId: string): Promise<{ firstOTP: string; secondOTP: string } | null> {
  if (!inboxId) throw new Error("Inbox ID is required but received null or undefined.");

  console.log(`Fetching unread OTP emails from inboxId: ${inboxId}`);

  // ✅ Fetch 2 unread emails
  const unreadEmails = await this.mailslurp.waitController.waitForMatchingEmails({
      inboxId,
      count: 2,
      timeout: 120000,
      unreadOnly: true,
      matchOptions: {
          matches: [{
              field: MatchOptionFieldEnum.SUBJECT,
              should: MatchOptionShouldEnum.CONTAIN,
              value: "Sciensus account email verification code"
          }]
      }
  });

  if (unreadEmails.length < 2) {
      console.warn(`Less than 2 unread OTP emails found.`);
      return null;
  }

  console.log(`Fetched ${unreadEmails.length} unread OTP emails.`);

  // ✅ Sort emails by ID (ensures different OTPs are used)
  unreadEmails.sort((a, b) => a.id.localeCompare(b.id));

  const firstEmail = unreadEmails[0];  // First email based on ID
  const secondEmail = unreadEmails[1]; // Second email based on ID

  console.log(`First Email ID: ${firstEmail.id}`);
  console.log(`Second Email ID: ${secondEmail.id}`);

  // ✅ Extract OTPs with error handling
  const extractOTP = async (emailId: string): Promise<string | null> => {
      try {
          const email = await this.mailslurp.emailController.getEmail({ emailId });
          return email.body?.match(/Your code is:\s(\d+)/)?.[1] ?? null;
      } catch (error) {
          console.error(`Failed to extract OTP from email ${emailId}:`, error);
          return null;
      }
  };

  const [firstOTP, secondOTP] = await Promise.all([
      extractOTP(firstEmail.id),
      extractOTP(secondEmail.id)
  ]);

  return {
      firstOTP: firstOTP ?? "N/A",
      secondOTP: secondOTP ?? "N/A"
  };
}





/******extractVerificationCode07- from 2 EMAILS ************/
async fetchLatestOTPs(inboxId: string, expectedCount = 2): Promise<string[]> {
  console.log(`🔄 Waiting for ${expectedCount} OTP emails in inbox: ${inboxId}`);

  const receivedOTPs: string[] = [];
  const seenIds = new Set<string>();

  while (receivedOTPs.length < expectedCount) {
    const email = await this.mailslurp.waitController.waitForLatestEmail({
      inboxId,
      timeout: 60000,
    });

    if (email && !seenIds.has(email.id)) {
      seenIds.add(email.id);
      console.log(`📨 New Email ID: ${email.id} | Time: ${email.createdAt}`);

      const body = email.body ?? "";
      const otp = body.match(/\b\d{6}\b/)?.[0] ?? "N/A";
      receivedOTPs.push(otp);
    }

    // Wait a little before checking again to avoid rapid looping
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`✅ Extracted OTPs:`, receivedOTPs);
  return receivedOTPs;
}










  




  











  
  /***************************retry********************************************/ 
  private async retry<T>(fn: () => Promise<T>, retries: number = 3): Promise<T> {
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        await this.delay(1000); // Wait 1 second before retrying
      }
    }
    throw lastError;
  }
  /******************************delay****************************************/ 

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


} 

/*****************************cleanHtmlTags*************************************/ 

function cleanHtmlTags(input: string): string {
  return input.replace(/<br>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
}






