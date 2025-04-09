import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { LoginPage01 } from '../pages/loginPage01';
import { HomePage } from '../pages/homePage';
import { HomeCarePortalPage } from '../pages/homeCarePortalPage';
import { LoginSessionExpiredPage } from '../pages/loginSessionExpiredPage';
import { AdministerAccountsPage } from '../pages/administerAccountsPage';
import { AddNewUserAccountPage } from '../pages/addNewUserAccountPage';
import { PortalAccessPage } from '../pages/portalFeatureAccessPage';
import { ChooseHospitalPage } from '../pages/chooseHospitalPage';
import { PortalDiagnosisPage } from '../pages/portalDiagnosisPage';
import { PatientCategoryPage } from '../pages/patientTypesPage';
import { PortalReferrerPage} from '../pages/portalReferrersPage';
import { E2EPortalAccountRegistration } from '../pages/portalE2EAccountSetupPage';
import { TermsAndConditionPage } from '../pages/termsAndConditionPage';
import { EditUserPage } from '../pages/editUserPage';
import { PatientsListPage } from '../pages/patientsListPage';
import { SearchPortalPatient } from '../pages/searchPatient';
import { ViewPatientEnquiries} from '../pages/createAndViewEnquiriesPage';
import { PrescriptionTracker } from '../pages/prescriptionTrackerPage';
import { ForgotPasswordPage } from '../pages/forgotPasswordPage';

type MyPomFixtures = {
    loginPage: LoginPage;
    loginpage01: LoginPage01;
    homePage: HomePage;
    homecareportalpage: HomeCarePortalPage;
    loginsessionexpiredpage: LoginSessionExpiredPage;
    administeraccountspage: AdministerAccountsPage;
    addnewuseraccountspage: AddNewUserAccountPage;
    portalaccesspage: PortalAccessPage;
    choosehospitalpage: ChooseHospitalPage;
    portaldiagnosispage: PortalDiagnosisPage;
    patientcategoriespage: PatientCategoryPage;
    portalreferrerpage: PortalReferrerPage;
    portale2eaccountsetup: E2EPortalAccountRegistration;
    termsconditionpage: TermsAndConditionPage;
    edituserpage: EditUserPage;
    patientslistpage: PatientsListPage;
    searchpatientpage: SearchPortalPatient;
    createandviewenquirypage: ViewPatientEnquiries;
    prescriptiontrackerpage: PrescriptionTracker;
    forgotpasswordpage: ForgotPasswordPage;
}    
    

export const test = baseTest.extend<MyPomFixtures>({
    loginPage : async ({page}, use)=>{
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    loginpage01 : async ({page}, use)=>{
        const loginPage01 = new LoginPage01(page);
        await use(loginPage01);
    },

    homePage : async ({page}, use)=>{
        const homePage = new HomePage(page);
        await use(homePage);
    },

    homecareportalpage : async ({page}, use)=>{
        const homecareportalpage = new HomeCarePortalPage(page);
        await use(homecareportalpage);
    },

    loginsessionexpiredpage : async ({page}, use)=>{
        const loginsessionexpiredpage = new LoginSessionExpiredPage(page);
        await use(loginsessionexpiredpage);
    },

    administeraccountspage : async ({page}, use)=>{
        const administerAccountsPage = new AdministerAccountsPage(page);
        await use(administerAccountsPage);
    },

    addnewuseraccountspage : async ({page}, use)=>{
        const addnewuseraccountspage = new AddNewUserAccountPage(page);
        await use(addnewuseraccountspage);
    },

    portalaccesspage : async ({page}, use)=>{
        const portalaccesspage = new PortalAccessPage(page);
        await use(portalaccesspage);
    },

    choosehospitalpage : async ({page}, use)=>{
        const choosehospitalpage = new ChooseHospitalPage(page);
        await use(choosehospitalpage);
    },

    portaldiagnosispage : async ({page}, use)=>{
        const portaldiagnosispage = new PortalDiagnosisPage(page);
        await use(portaldiagnosispage);
    },

    patientcategoriespage : async ({page}, use)=>{
        const patientcategoriespage = new PatientCategoryPage(page);
        await use(patientcategoriespage);
    },

    portalreferrerpage : async ({page}, use)=>{
        const portalreferrerpage = new PortalReferrerPage(page);
        await use(portalreferrerpage);
    },

    portale2eaccountsetup : async ({page}, use)=>{
        const portale2eaccountsetup = new E2EPortalAccountRegistration(page);
        await use(portale2eaccountsetup);
    },

    termsconditionpage : async ({page}, use)=>{
        const termsconditionpage = new TermsAndConditionPage(page);
        await use(termsconditionpage);
    },

    edituserpage : async ({page}, use)=>{
        const edituserpage = new EditUserPage(page);
        await use(edituserpage);
    },

    patientslistpage : async ({page}, use)=>{
        const patientslistpage = new PatientsListPage(page);
        await use(patientslistpage);
    },

    searchpatientpage : async ({page}, use)=>{
        const searchpatientpage = new SearchPortalPatient(page);
        await use(searchpatientpage);
    },

    createandviewenquirypage : async ({page}, use)=>{
        const createandviewenquirypage = new ViewPatientEnquiries(page);
        await use(createandviewenquirypage);
    },

    prescriptiontrackerpage : async ({page}, use)=>{
        const prescriptiontrackerpage = new PrescriptionTracker(page);
        await use(prescriptiontrackerpage);
    },

    forgotpasswordpage : async ({page}, use)=>{
        const forgotpasswordpage = new ForgotPasswordPage(page);
        await use(forgotpasswordpage);
    },


    
    
    

    
})
