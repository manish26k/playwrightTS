export const apiTestConfig = {

    apiKEY: `cb7bdbae3fd6b3364ca2774247377959378e3a7ae331b1a1bf775fc616f547ac`,
    serverDOMAIN: `@mailslurp.net`,
    baseUrl: `https://api.mailslurp.com`,
    createInbox: `/inboxes`,
    inboxEmails:(inboxId: string) => `/inboxes/${inboxId}/emails`,
    emailContent:(emailId: string) => `/emails/${emailId}`


};