import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ClimbingBoxLoader } from 'react-spinners';

import { ThemeProvider } from '@material-ui/styles';

import MuiTheme from './theme';

// Layout Blueprints

import { LeftSidebar, MinimalLayout } from './layout-blueprints';
import DeleteUpdateID from 'pages/DeleteUpdateID';


// Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));

const Customer = lazy(() => import('./pages/Customer'));
const CreateCustomer = lazy(() => import('./pages/CreateCustomer'));

const Designation = lazy(() => import('./pages/Designation'));
const CreateDesignation = lazy(() => import('./pages/CreateDesignation'));

const CreateUserId = lazy(() => import('./pages/UserIdSetup'));

const Login = lazy(() => import('./pages/Login'));

const Company = lazy(() => import('./pages/Company'));
const CreateCompany = lazy(() => import('./pages/CreateCompany'));

const Department = lazy(() => import('./pages/Department'));
const CreateDepartment = lazy(() => import('./pages/CreateDepartment'));

const Location = lazy(() => import('./pages/Location'));
const CreateLocation = lazy(() => import('./pages/CreateLocation'));
const Actions = lazy(() => import('./pages/Actions'));
const ActionsAndReasons = lazy(() => import('./pages/ActionsAndReasons'));
const CreateAction = lazy(() => import('./pages/CreateAction'));
const CreateActionReason = lazy(() => import('./pages/CreateActionReason'));
const AddCertificateLicense = lazy(() => import('./pages/AddCertificateLicense'));

const AutoNumberingSetup = lazy(() => import('./pages/AutoNumberingSetup'));
const Hire = lazy(() => import('./pages/HireProcess'));
const HireProcessView = lazy(() => import('./pages/HireProcessView'));
const CreateRoles = lazy(() => import('./pages/CreateRoles'));
const RolesAndPermissions = lazy(() => import('./pages/RolesAndPermissions'));
const NationalID = lazy(() => import('./pages/NationalID'));
const CreateNationalID = lazy(() => import('./pages/CreateNationalID'));
const AddWorkExperience = lazy(() => import('./pages/AddWorkExperience'));

const AddEmergencyContact = lazy(() => import('./pages/AddEmergencyContact'));
const ModuleAccess = lazy(() => import('./pages/ModuleAccess'));

const AddPhoneAndEmailAddress = lazy(() =>
  import('./pages/AddPhoneAndEmailAddress')
);
const AddAddress = lazy(() => import('./pages/AddAddress'));

const createItemcatalogue = lazy(() => import('./pages/CreateItemCatalogue'));

const CreateDependants = lazy(() => import('./pages/CreateDependants'));

const AddEducation = lazy(() => import('./pages/AddEducation'));
const UpdateEmployeeId = lazy(() => import('./pages/DeleteUpdateID'));
const createItemCatalogue = lazy(() => import('./pages/CreateItemCatalogue'));
const itemCatalogue = lazy(() => import('./pages/DashboardItemCatalogue'));
const Permissions = lazy(() => import('./pages/PermissionsAssignment'));
const uploadResults = lazy(() => import('./pages/UploadResults'));
const downloadResults = lazy(() => import('./pages/DownloadResults'))
const CreateEmployeeUserId = lazy(() => import('./pages/CreateEmployeeUserId'));
const Employees = lazy(() => import('./pages/Employees'));
const ActiveInActive = lazy(() => import('./pages/ActiveInActive'));
const ResetPasswordByAdmin = lazy(() => import('./pages/ResetPasswordByAdmin'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const CreateUserCredentials = lazy(() => import('./pages/CreateUserCredentials'));
const PasswordRules = lazy(() => import('./pages/PasswordRules'));
const EmployeeDetails = lazy(() => import('./pages/ViewEmployeeDetails'));
const OrgStructure = lazy(() => import('./pages/OrgStructure'));
const CreateBank = lazy(() => import('./pages/CreateBank'));
const Bank = lazy(() => import('./pages/Bank'));
const CreateSourceBank = lazy(() => import('./pages/CreateSourceBank'));
const DashboardSourceBank = lazy(() => import('./pages/DashboardSourceBank'));
const OrgChartSetup = lazy(() => import('./pages/OrgChartSetup'));
const CreateBankBranches = lazy(() => import('./pages/CreateBankBranches'));
const BankBranches = lazy(() => import('./pages/BankBranches'));
const UploadBulkEmployees = lazy(() => import('./pages/BulkUploadEmployees'));

const UploadLocation = lazy(() => import('./pages/UploadLocation'));
const UploadDepartment = lazy(() => import('./pages/UploadDepartment'));
const UploadDesignation = lazy(() => import('./pages/UploadDesignation'));
const UploadEmployeeNationalID = lazy(() => import('./pages/UploadEmployeeNationalID'));
const UploadEmployeeAddress = lazy(() => import('./pages/UploadEmployeeAddress'));
const UploadPhone = lazy(() => import('./pages/UploadPhone'));
const UploadEmailID = lazy(() => import('./pages/UploadEmailID'));
const UploadEmergencyContact = lazy(() => import('./pages/UploadEmergencyContact'));
const UploadDependants = lazy(() => import('./pages/UploadDependants'));
const UploadBeneficiary = lazy(() => import('./pages/UploadBeneficiary'));
const UploadWorkExperience = lazy(() => import('./pages/UploadWorkExperience'));
const UploadDocument = lazy(() => import('./pages/UploadDocument'));
const UploadCertificate = lazy(() => import('./pages/UploadCertificate'));
const UploadLicense = lazy(() => import('./pages/UploadLicense'));

const CreateJobBand = lazy(() => import('./pages/CreateJobBand'));
const JobBand = lazy(() => import('./pages/JobBand'));
const UploadJobGrade = lazy(() => import('./pages/UploadJobGrade'));
const UploadJobBands = lazy(() => import('./pages/UploadJobBands'));
const UploadCompanyPolicy = lazy(() => import('./pages/UploadCompanyPolicy'))
const CreateJobGrade = lazy(() => import('./pages/CreateJobGrade'));
const JobGrade = lazy(() => import('./pages/JobGrade'));
const EmployeeInfoHistory = lazy(() => import('./pages/EmployeeInfoHistory'));
const EmployeeDependantOrBeneficiaryDetails = lazy(() => import('./pages/EmployeeDependantOrBeneficiaryDetails'));

const NationalIDReport = lazy(() => import('./pages/NationalIDReport'));
const EmployeeDetailReports = lazy(() => import('./pages/EmployeeDetailReports'));
const EditBiographicalDetails = lazy(() => import('./pages/EditBiographicalDetails'));
const EmergencyContactReport = lazy(() => import('./pages/EmergencyContactReport'));
const DepartmentReport = lazy(() => import('./pages/DepartmentReport'));
const ProbationConfirmation = lazy(() => import('./pages/ProbationConfirmation'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const ResignationDetails = lazy(() => import('./pages/ResignationDetails'));
const MyPeers = lazy(() => import('./pages/MyPeers'));
const PublishAnnouncement = lazy(() => import('./pages/PublishAnnouncement'));
const EmployeeCertificateOrLicenseReports = lazy(() => import('./pages/EmployeeCertificateOrLicenseReports'));
const EmployeeRolesReport = lazy(() => import('./pages/EmployeeRolesReport'));
const EmployeeTimeline = lazy(() => import('./pages/EmployeeTimeline'));
const MyTeam = lazy(() => import('./pages/MyTeam'));
const InitiateActions = lazy(() => import('./pages/InitiateActions'));
const CreateLetters = lazy(() => import('./pages/CreateLetters'));
const Letters = lazy(() => import('./pages/LettersDashboard'));
const HolidayCalendarMaster = lazy(() => import('./pages/HolidayCalendarMaster'));
const GenetateLetter = lazy(() => import('./pages/GenerateLetter'));
const HolidayCalendar = lazy(() => import('./pages/HolidayCalendar'));
const HolidayCalendarConfiguration = lazy(() => import('./pages/HolidayCalendarConfiguration'));
const TransactionSummary = lazy(() => import('./pages/TransactionSummary'))
const CreateLeaveAccrualPolicy = lazy(() => import('./pages/LeaveAccrualPolicy'))
const AccrualPolicy = lazy(() => import('./pages/AccrualPolicy'))

const ManagerChangeUpload = lazy(() => import('./pages/ManagerChangeUpload'));
const EmployeeHireSeparation = lazy(() => import('./pages/HireSeparation'));
const EmployeeMissingInfoReport = lazy(() => import('./pages/EmployeeMissingInfoReport'));
const EmployeeBloodGroup = lazy(() => import('./pages/EmployeeBloodGroup'))
const ExitControl = lazy(() => import('./pages/ExitControls'))
const ProbationPeriodSetup = lazy(() => import('./pages/ProbationPeriodSetup'))
const PendingApprovals = lazy(() => import('./pages/PendingApprovals'));
const PendingProbationConfirmation = lazy(() => import('./pages/PendingProbationConfirmation'));
const EmployeePriorWorkExperienceReport = lazy(() => import('./pages/EmployeePriorWorkExperienceReport'))
const NotificationTemplate = lazy(() => import('./pages/NotificationTemplate'))
const CreateNotificationTemplate = lazy(() => import('./pages/CreateNotificationTemplate'))
const UserMapping = lazy(() => import('./pages/UserMapping'))
const ProbationControls = lazy(() => import('./pages/ProbationControls'))

const LeaveTypes = lazy(() => import('./pages/LeaveTypes'))
const CreateLeaveAccumulation = lazy(() => import('./pages/CreateLeaveAccumulation'))
const LeaveAccumulation = lazy(() => import('./pages/LeaveAccumulation'))

const Routes = () => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    },
    out: {
      opacity: 0
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'linear',
    duration: 0.3
  };

  const SuspenseLoading = () => {
    const [show, setShow] = useState(false);
    useEffect(() => {
      let timeout = setTimeout(() => setShow(true), 300);
      return () => {
        clearTimeout(timeout);
      };
    }, []);

    return (
      <>
        <AnimatePresence>
          {show && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}>
              <div className="d-flex align-items-center flex-column vh-100 justify-content-center text-center py-3">
                <div className="d-flex align-items-center flex-column px-4">
                  <ClimbingBoxLoader color={'#3c44b1'} loading={true} />
                </div>
                <div className="text-muted font-size-xl text-center pt-3">
                  Please wait while we load the live preview examples
                  <span className="font-size-lg d-block text-dark">
                    This live preview instance can be slower than a real
                    production build!
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };
  return (
    <ThemeProvider theme={MuiTheme}>
      <AnimatePresence>
        <Suspense fallback={<SuspenseLoading />}>
          <Switch>
            <Redirect exact from="/" to="/login" />

            <Route
              path={[
                '/createcompany',
                '/designation',
                '/createDesignation',
                '/department',
                '/createDepartment',
                '/createLocation',
                '/locations',
                '/createUserId',
                '/department',
                '/createDepartment',
                '/createLocation',
                '/locations',
                '/createUserIdSetup',
                '/autoNumberingSetup',
                '/addEmergencyContact',
                '/addPhoneAndEmailAddress',
                '/addAddress',
                '/nationalIDs',
                '/createNationalID',
                '/hireProcess',
                '/hireProcessView',
                '/actions',
                '/actionsAndReasons',
                '/createAction',
                '/createActionReason',
                '/addWorkExperience',
                '/createDependants',
                '/educationalDetails',
                '/itemCatalogue',
                '/createItemCatalogue',
                '/addCertificateLicense',
                '/moduleAccess',
                '/createEmployeeUserId',
                '/employees',
                '/uploadResults',
                '/activeInActive',
                '/resetPasswordByAdmin',
                '/createUserCredentials',
                '/passwordRules',
                '/employeeDetails',
                '/orgStructure',
                '/bank',
                '/createBank',
                '/createSourceBank',
                '/sourceBank',
                '/orgChartSetup',
                '/bankBranches',
                '/createBankBranches',
                '/uploadEmployees',
                '/uploadDepartment',
                '/uploadLocation',
                '/uploadDesignation',
                '/uploadNationalID',
                '/uploadAddress',
                '/uploadDesignation',
                '/uploadPhone',
                '/uploadEmailID',
                '/uploadEmergencyContact',
                '/uploadDependants',
                '/uploadBeneficiary',
                '/uploadWorkExperience',
                '/uploadDocument',
                '/uploadCertificate',
                '/uploadLicense',
                '/createJobBand',
                '/jobBand',
                '/uploadJobGrade',
                '/uploadJobBands',
                '/uploadCompanyPolicy',
                '/createJobGrade',
                '/JobGrade',
                '/employeeInfoHistory',
                '/nationalIDReport',
                '/employeeDependantOrBeneficiaryDetails',
                '/downloadResults',
                '/editBiographicalDetails',
                '/emergencyContactReport',
                '/employeeDetailsReport',
                '/departmentReport',
                '/publishAnnouncement',
                '/employeeCertificateOrLicenseReports',
                '/employeeRolesReport',
                '/myPeers',
                '/resignationDetails',
                '/employeeTimeline',
                '/letters',
                '/createLetters',
                '/generateLetter',
                '/managerChangeUpload',
                '/employeeHireSeparation',
                '/probationConfirmation',
                '/EmployeeMissingInfoReport',
                '/exitControl',
                '/employeeBloodGroup',
                '/holidayCalendarMaster',
                '/holidayCalendar',
                '/holidayCalendarConfiguration',
                '/employeePriorWorkExperienceReport',
                '/pendingProbationConfirmation',
                '/CreateNotificationTemplate',
                '/probationPeriodSetup',
                '/UserMapping',
                '/probationControl',
                '/createRoles',
                '/transactionSummary',
                '/leaveTypes',
                '/createLeaveAccumulation' , 
                '/leaveAccumulation',
                '/createLeaveAccrualPolicy',
                '/accrualPolicy'
              ]}>
              <LeftSidebar
                companyId={
                  location.pathname.toLowerCase() ===
                    '/CreateCompany'.toLowerCase()
                    ? new URLSearchParams(location.search).get('id')
                    : null
                }
                showHeader={true}>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/createCompany" component={CreateCompany} />
                    <Route path="/designation" component={Designation} />
                    <Route
                      path="/createDesignation"
                      component={CreateDesignation}
                    />
                    <Route path="/department" component={Department} />
                    <Route
                      path="/createDepartment"
                      component={CreateDepartment}
                    />
                    <Route path="/locations" component={Location} />
                    <Route path="/createLocation" component={CreateLocation} />
                    <Route path="/createUserIdSetup" component={CreateUserId} />
                    <Route
                      path="/autoNumberingSetup"
                      component={AutoNumberingSetup}
                    />
                    <Route
                      path="/addEmergencyContact"
                      component={AddEmergencyContact}
                    />
                    <Route
                      path="/addPhoneAndEmailAddress"
                      component={AddPhoneAndEmailAddress}
                    />
                    <Route
                      path="/addCertificateLicense"
                      component={AddCertificateLicense}
                    />
                    <Route path="/addAddress" component={AddAddress} />
                    <Route path="/hireProcess" component={Hire} />
                    <Route
                      path="/hireProcessView"
                      component={HireProcessView}
                    />
                    <Route
                      path="/actions"
                      component={Actions}
                    />
                    <Route
                      path="/actionsAndReasons"
                      component={ActionsAndReasons}
                    />
                    <Route path="/createAction" component={CreateAction} />
                    <Route
                      path="/createActionReason"
                      component={CreateActionReason}
                    />
                    <Route path="/nationalIDs" component={NationalID} />
                    <Route
                      path="/createNationalID"
                      component={CreateNationalID}
                    />
                    <Route
                      path="/addWorkExperience"
                      component={AddWorkExperience}
                    />
                    <Route
                      path="/createItemCatalogue"
                      component={createItemcatalogue}
                    />
                    <Route
                      path="/createDependants"
                      component={CreateDependants}
                    />
                    <Route
                      path="/educationalDetails"
                      component={AddEducation}
                    />
                    <Route
                      path="/itemCatalogue"
                      component={itemCatalogue}
                    />
                    <Route
                      path="/moduleAccess"
                      component={ModuleAccess}
                    />
                    <Route path="/bank" component={Bank} />
                    <Route
                      path="/createBank"
                      component={CreateBank}
                    />
                    <Route
                      path="/uploadLocation"
                      component={UploadLocation}
                    />
                    <Route
                      path="/uploadResults"
                      component={uploadResults}
                    />
                    <Route
                      path="/createEmployeeUserId"
                      component={CreateEmployeeUserId}
                    />
                    <Route
                      path="/employees"
                      component={Employees}
                    />
                    <Route
                      path="/activeInActive"
                      component={ActiveInActive}
                    />
                    <Route
                      path="/resetPasswordByAdmin"
                      component={ResetPasswordByAdmin}
                    />
                    <Route
                      path="/createUserCredentials"
                      component={CreateUserCredentials}
                    />
                    <Route
                      path="/passwordRules"
                      component={PasswordRules}
                    />
                    <Route
                      path="/employeeDetails"
                      component={EmployeeDetails}
                    />
                    <Route
                      path="/orgStructure"
                      component={OrgStructure}
                    />
                    <Route
                      path="/createSourceBank"
                      component={CreateSourceBank}
                    />
                    <Route
                      path="/sourceBank"
                      component={DashboardSourceBank}
                    />
                    <Route
                      path="/orgChartSetup"
                      component={OrgChartSetup}
                    />
                    <Route path="/bankBranches" component={BankBranches} />
                    <Route path="/createBankBranches" component={CreateBankBranches} />
                    <Route path="/uploadEmployees" component={UploadBulkEmployees} />
                    <Route path="/uploadDepartment" component={UploadDepartment} />
                    <Route path="/uploadDesignation" component={UploadDesignation} />
                    <Route path="/uploadNationalID" component={UploadEmployeeNationalID} />
                    <Route path="/uploadAddress" component={UploadEmployeeAddress} />
                    <Route path="/uploadPhone" component={UploadPhone} />
                    <Route path="/uploadEmailID" component={UploadEmailID} />
                    <Route path="/uploadEmergencyContact" component={UploadEmergencyContact} />
                    <Route path="/uploadDependants" component={UploadDependants} />
                    <Route path="/uploadBeneficiary" component={UploadBeneficiary} />
                    <Route path="/uploadWorkExperience" component={UploadWorkExperience} />
                    <Route path="/uploadDocument" component={UploadDocument} />
                    <Route path="/uploadCertificate" component={UploadCertificate} />
                    <Route path="/uploadLicense" component={UploadLicense} />
                    <Route path="/createJobBand" component={CreateJobBand} />
                    <Route path="/jobBand" component={JobBand} />
                    <Route path="/uploadJobGrade" component={UploadJobGrade} />
                    <Route path="/uploadJobBands" component={UploadJobBands} />
                    <Route path="/managerChangeUpload" component={ManagerChangeUpload} />
                    <Route path="/createJobGrade" component={CreateJobGrade} />
                    <Route path="/jobGrade" component={JobGrade} />
                    <Route path="/employeeInfoHistory" component={EmployeeInfoHistory} />
                    <Route path="/employeeDependantOrBeneficiaryDetails" component={EmployeeDependantOrBeneficiaryDetails} />

                    <Route path="/nationalIDReport" component={NationalIDReport} />
                    <Route path="/employeeDetailsReport" component={EmployeeDetailReports} />
                    <Route path="/departmentReport" component={DepartmentReport} />
                    <Route path="/downloadResults" component={downloadResults} />
                    <Route path="/editBiographicalDetails" component={EditBiographicalDetails} />
                    <Route path="/emergencyContactReport" component={EmergencyContactReport} />
                    <Route path="/uploadCompanyPolicy" component={UploadCompanyPolicy} />
                    <Route path="/publishAnnouncement" component={PublishAnnouncement} />
                    <Route path="/employeeCertificateOrLicenseReports" component={EmployeeCertificateOrLicenseReports} />
                    <Route path="/employeeRolesReport" component={EmployeeRolesReport} />
                    <Route path="/myPeers" component={MyPeers} />
                    <Route path="/resignationDetails" component={ResignationDetails} />
                    <Route path="/employeeTimeline" component={EmployeeTimeline} />
                    <Route path="/createLetters" component={CreateLetters} />
                    <Route path="/letters" component={Letters} />
                    <Route path="/generateLetter" component={GenetateLetter} />
                    <Route path="/employeeHireSeparation" component={EmployeeHireSeparation} />
                    <Route path="/probationConfirmation" component={ProbationConfirmation} />
                    <Route path="/employeeMissingInfoReport" component={EmployeeMissingInfoReport} />
                    <Route path="/employeeBloodGroup" component={EmployeeBloodGroup} />
                    <Route path="/exitControl" component={ExitControl} />
                    <Route path="/probationPeriodSetup" component={ProbationPeriodSetup} />
                    <Route path="/holidayCalendarMaster" component={HolidayCalendarMaster} />
                    <Route path="/holidayCalendar" component={HolidayCalendar} />
                    <Route path="/holidayCalendarConfiguration" component={HolidayCalendarConfiguration} />
                    <Route path="/employeePriorWorkExperienceReport" component={EmployeePriorWorkExperienceReport} />
                    <Route path="/pendingProbationConfirmation" component={PendingProbationConfirmation} />
                    <Route path="/CreateNotificationTemplate" component={CreateNotificationTemplate} />
                    <Route path="/UserMapping" component={UserMapping} />
                    <Route path="/probationControl" component={ProbationControls} />
                    <Route path="/createRoles" component={CreateRoles} />
                    <Route path="/transactionSummary" component={TransactionSummary} />
                    <Route path="/leaveTypes" component={LeaveTypes}/>
                    <Route path="/createLeaveAccumulation" component={CreateLeaveAccumulation}/>
                    <Route path="/leaveAccumulation" component={LeaveAccumulation}/>
                    <Route path="/createLeaveAccrualPolicy" component={CreateLeaveAccrualPolicy} />
                    <Route path="/accrualPolicy" component={AccrualPolicy} />
                  </motion.div>
                </Switch>
              </LeftSidebar>
            </Route>
            <Route
              path={['/dashboard', '/customer', '/createCustomer', '/company',
                '/roles',
                '/assignedPermissions',
                '/updateEmployeeID',
                '/notificationTemplate']}>
              <LeftSidebar companyId={null} showHeader={true}>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/customer" component={Customer} />
                    <Route
                      path="/createCustomer"
                      component={CreateCustomer}
                      search={'?id=:id'}
                    />
                    <Route path="/company" component={Company} />
                    <Route path="/roles" component={RolesAndPermissions} />

                    <Route
                      path="/updateEmployeeID"
                      component={UpdateEmployeeId}
                    />
                    <Route path="/assignedPermissions" component={Permissions} />
                    <Route path="/moduleAccess" component={ModuleAccess} />
                    <Route path="/notificationTemplate" component={NotificationTemplate} />
                  </motion.div>
                </Switch>
              </LeftSidebar>
            </Route>
            <Route path={['/myProfile', '/myLeaves', '/myTimeline', 'myCompensation']}>
              <LeftSidebar showSidebar={false} showUserSidebar={true} headerType="MyProfile">
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/myProfile" component={MyProfile} />
                    {/* <Route path="/myLeaves" component={MyLeaves} />
                    <Route path="/myTimeline" component={MyTimeline} />
                    <Route path="/myCompensation" component={MyCompensation} /> */}
                  </motion.div>
                </Switch>
              </LeftSidebar>
            </Route>
            <Route path={['/my-team', '/leave', '/time', '/pendingApprovals', '/initiateActions', '/transactionSummary']}>
              <LeftSidebar showSidebar={false} showUserSidebar={true} headerType="MyTeam">
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/my-team" component={MyTeam} />
                    <Route path="/pendingApprovals" component={PendingApprovals} />
                    <Route path="/initiateActions" component={InitiateActions} />
                    <Route path="/transactionSummary" component={TransactionSummary} />
                  </motion.div>
                </Switch>
              </LeftSidebar>
            </Route>
            <Route path={['/login']}>
              <MinimalLayout>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/login" component={Login} />
                  </motion.div>
                </Switch>
              </MinimalLayout>
            </Route>
            <Route path={['/resetPassword']}>
              <MinimalLayout>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/resetPassword" component={ResetPassword} />
                  </motion.div>
                </Switch>
              </MinimalLayout>
            </Route>
            <Route path={['/forgotPassword']}>
              <MinimalLayout>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/forgotPassword" component={ForgotPassword} />
                  </motion.div>
                </Switch>
              </MinimalLayout>
            </Route>
          </Switch>
        </Suspense>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default Routes;