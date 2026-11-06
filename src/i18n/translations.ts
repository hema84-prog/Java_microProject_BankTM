import { Language, LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

export interface TranslationDictionary {
  // Brand
  bankName: string;
  tagline: string;
  welcomeDesc: string;

  // Roles & Auth
  customerLogin: string;
  adminLogin: string;
  registerNewCustomer: string;
  loginTitle: string;
  registerTitle: string;
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  loginButton: string;
  registerButton: string;
  logout: string;
  forgotPassword: string;
  alreadyHaveAccount: string;
  noAccountYet: string;
  adminPortalTitle: string;
  demoCredentialsNote: string;
  
  // Navigation
  navOverview: string;
  navDashboard: string;
  navMyBanking: string;
  navMyProfile: string;
  navOpenNewAccount: string;
  navMyAccounts: string;
  navDeposit: string;
  navWithdraw: string;
  navTransfer: string;
  navBalanceEnquiry: string;
  navTransactionHistory: string;
  navCardServices: string;
  navApplyDebitCard: string;
  navApplyCreditCard: string;
  navMyCards: string;
  navFinancialAssistance: string;
  navGovernmentSchemes: string;
  navSmartLoanFinder: string;
  navOthers: string;
  navSettings: string;
  navHelpSupport: string;

  // Dashboard Stats
  welcomeCustomer: string;
  customerId: string;
  totalAccounts: string;
  availableBalance: string;
  totalDeposits: string;
  totalWithdrawals: string;
  quickActions: string;
  recentTransactions: string;
  accountOverview: string;
  cardStatus: string;
  viewAll: string;
  noRecentTransactions: string;

  // Account Types
  savingsAccount: string;
  currentAccount: string;
  accountNumber: string;
  accountType: string;
  ifscCode: string;
  branch: string;
  minBalanceNote: string;
  overdraftNote: string;
  statusActive: string;
  statusPending: string;
  statusDormant: string;

  // Transactions Form
  amount: string;
  selectAccount: string;
  depositHeading: string;
  withdrawHeading: string;
  transferHeading: string;
  beneficiaryAccount: string;
  beneficiaryName: string;
  description: string;
  confirmTransaction: string;
  cancel: string;
  submit: string;
  transactionSuccess: string;
  transactionId: string;
  downloadReceipt: string;
  printReceipt: string;
  date: string;
  type: string;
  status: string;
  filterBy: string;
  allTypes: string;

  // Card Management
  cardNetwork: string;
  deliveryAddress: string;
  applyDebitHeading: string;
  applyCreditHeading: string;
  employmentCategory: string;
  monthlyIncome: string;
  requestedLimit: string;
  employerName: string;
  simulatedEligibilityScore: string;
  trackApplications: string;
  debitCards: string;
  creditCards: string;
  applicationReference: string;
  submittedOn: string;
  remarks: string;

  // Card Statuses
  statusSubmitted: string;
  statusUnderReview: string;
  statusAdditionalInfo: string;
  statusApproved: string;
  statusRejected: string;
  statusDispatched: string;
  statusDelivered: string;

  // Government Schemes
  schemesHeading: string;
  schemesSubheading: string;
  catAll: string;
  catAgriculture: string;
  catEducation: string;
  catBusiness: string;
  catWomen: string;
  catKarnataka: string;
  targetBeneficiaries: string;
  eligibility: string;
  benefits: string;
  documentsRequired: string;
  applyOnOfficialPortal: string;
  lastVerified: string;
  disclaimerGovernment: string;

  // Smart Loan Finder
  loanFinderTitle: string;
  loanFinderSubtitle: string;
  whoAreYou: string;
  farmer: string;
  student: string;
  womanEntrepreneur: string;
  smallBusiness: string;
  selfEmployed: string;
  generalCitizen: string;
  loanPurpose: string;
  purposeFarming: string;
  purposeEducation: string;
  purposeBusiness: string;
  purposeHousing: string;
  purposePersonal: string;
  findMatchingSchemes: string;
  matchingSchemesFound: string;
  noSchemesMatched: string;

  // Settings & Profile
  settingsTitle: string;
  changePassword: string;
  newPassword: string;
  updatePassword: string;
  languagePreference: string;
  customerSupport: string;
  branchLocator: string;
  tollFreeHelpline: string;
  simulatedNotice: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    bankName: 'BankTM',
    tagline: 'BankTM – Banking Made Simple for Everyone.',
    welcomeDesc: 'Manage your accounts, transfer money, explore financial services and discover government assistance opportunities—all in one place.',
    customerLogin: 'Customer Login',
    adminLogin: 'Bank Admin Login',
    registerNewCustomer: 'New Customer Registration',
    loginTitle: 'Customer Portal Login',
    registerTitle: 'Create Your BankTM Account',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    email: 'Email Address',
    mobile: 'Mobile Number',
    address: 'Residential Address',
    loginButton: 'Sign In to Banking',
    registerButton: 'Complete Registration',
    logout: 'Secure Logout',
    forgotPassword: 'Forgot Password?',
    alreadyHaveAccount: 'Already registered? Sign in here',
    noAccountYet: "Don't have an account? Register now",
    adminPortalTitle: 'Authorized Bank Administration',
    demoCredentialsNote: 'Default Demo Admin: admin / BankTM@2026',
    
    navOverview: 'OVERVIEW',
    navDashboard: 'Dashboard',
    navMyBanking: 'MY BANKING',
    navMyProfile: 'My Profile',
    navOpenNewAccount: 'Open New Account',
    navMyAccounts: 'My Accounts',
    navDeposit: 'Deposit Money',
    navWithdraw: 'Withdraw Money',
    navTransfer: 'Transfer Money',
    navBalanceEnquiry: 'Balance Enquiry',
    navTransactionHistory: 'Transaction History',
    navCardServices: 'CARD SERVICES',
    navApplyDebitCard: 'Apply for Debit Card',
    navApplyCreditCard: 'Apply for Credit Card',
    navMyCards: 'My Cards',
    navFinancialAssistance: 'FINANCIAL ASSISTANCE',
    navGovernmentSchemes: 'Government Schemes',
    navSmartLoanFinder: 'Smart Loan Finder',
    navOthers: 'OTHERS',
    navSettings: 'Settings',
    navHelpSupport: 'Help & Support',

    welcomeCustomer: 'Welcome back',
    customerId: 'Customer ID',
    totalAccounts: 'Total Accounts',
    availableBalance: 'Available Balance',
    totalDeposits: 'Total Deposits',
    totalWithdrawals: 'Total Withdrawals',
    quickActions: 'Quick Banking Actions',
    recentTransactions: 'Recent Transactions',
    accountOverview: 'Account Overview',
    cardStatus: 'Card Status',
    viewAll: 'View All',
    noRecentTransactions: 'No recent transactions recorded for this account.',

    savingsAccount: 'Savings Account',
    currentAccount: 'Current Account',
    accountNumber: 'Account Number',
    accountType: 'Account Type',
    ifscCode: 'IFSC Code',
    branch: 'Branch',
    minBalanceNote: 'Minimum balance requirement: ₹1,000 for regular savings',
    overdraftNote: 'Predefined overdraft facility available',
    statusActive: 'Active',
    statusPending: 'Pending Approval',
    statusDormant: 'Dormant',

    amount: 'Amount (₹)',
    selectAccount: 'Select Account',
    depositHeading: 'Deposit Funds to Account',
    withdrawHeading: 'Withdraw Funds from Account',
    transferHeading: 'Direct Bank Transfer (NEFT/RTGS/IMPS)',
    beneficiaryAccount: 'Beneficiary Account Number',
    beneficiaryName: 'Beneficiary Account Name',
    description: 'Transaction Remarks',
    confirmTransaction: 'Confirm & Authorize Transaction',
    cancel: 'Cancel',
    submit: 'Submit Application',
    transactionSuccess: 'Transaction Processed Successfully',
    transactionId: 'Transaction ID',
    downloadReceipt: 'Download Official Receipt',
    printReceipt: 'Print Receipt',
    date: 'Date & Time',
    type: 'Type',
    status: 'Status',
    filterBy: 'Filter by',
    allTypes: 'All Transaction Types',

    cardNetwork: 'Card Network Preference',
    deliveryAddress: 'Card Delivery Address',
    applyDebitHeading: 'Apply for Personalized Debit Card',
    applyCreditHeading: 'Apply for BankTM Credit Card',
    employmentCategory: 'Employment Category',
    monthlyIncome: 'Monthly Income (₹)',
    requestedLimit: 'Requested Credit Limit (₹)',
    employerName: 'Employer / Business Name',
    simulatedEligibilityScore: 'Estimated Eligibility Score',
    trackApplications: 'Application Lifecycle Tracker',
    debitCards: 'Debit Cards',
    creditCards: 'Credit Cards',
    applicationReference: 'Application Reference',
    submittedOn: 'Submitted On',
    remarks: 'Administrator Remarks',

    statusSubmitted: 'Submitted',
    statusUnderReview: 'Under Review',
    statusAdditionalInfo: 'Additional Information Required',
    statusApproved: 'Approved',
    statusRejected: 'Rejected',
    statusDispatched: 'Dispatched',
    statusDelivered: 'Delivered',

    schemesHeading: 'Government Schemes & Financial Assistance',
    schemesSubheading: 'Explore verified Indian government subsidies, farmer support, education scholarships, and entrepreneur loans.',
    catAll: 'All Schemes',
    catAgriculture: 'Agriculture & Farmer',
    catEducation: 'Education & Scholarships',
    catBusiness: 'Business & Micro-Enterprise',
    catWomen: 'Women Empowerment',
    catKarnataka: 'Karnataka State Schemes',
    targetBeneficiaries: 'Target Beneficiaries',
    eligibility: 'Eligibility Criteria',
    benefits: 'Financial Benefits & Support',
    documentsRequired: 'Required Documents',
    applyOnOfficialPortal: 'Apply on Official Portal',
    lastVerified: 'Last Verified Date',
    disclaimerGovernment: 'Disclaimer: BankTM provides scheme discovery and direct links to official Indian Government portals. Eligibility and disbursement are determined solely by respective government bodies.',

    loanFinderTitle: 'Smart Loan & Assistance Finder',
    loanFinderSubtitle: 'Answer two simple questions to uncover personalized government subsidies, student grants, and micro-loans.',
    whoAreYou: 'Which profile best describes you?',
    farmer: 'Farmer / Cultivator',
    student: 'Student / Scholar',
    womanEntrepreneur: 'Woman Entrepreneur',
    smallBusiness: 'Small Business / MSME Owner',
    selfEmployed: 'Self-Employed / Street Vendor',
    generalCitizen: 'General Citizen',
    loanPurpose: 'What is your primary financial requirement?',
    purposeFarming: 'Agricultural Equipment, Seeds & Crop Support',
    purposeEducation: 'Higher Education & Scholarship Grants',
    purposeBusiness: 'Business Working Capital & Expansion',
    purposeHousing: 'Home Renovation & Construction',
    purposePersonal: 'General Financial Support & Healthcare',
    findMatchingSchemes: 'Discover Eligible Schemes',
    matchingSchemesFound: 'Verified Government Schemes Found for You',
    noSchemesMatched: 'No exact matches found. Browse our full directory of Government Schemes.',

    settingsTitle: 'Security & Preferences',
    changePassword: 'Change Account Password',
    newPassword: 'New Password',
    updatePassword: 'Update Password',
    languagePreference: 'Preferred Customer Interface Language',
    customerSupport: '24x7 Customer Care & Assistance',
    branchLocator: 'Branch & ATM Locator',
    tollFreeHelpline: 'Toll-Free Banking Helpline: 1800-425-2026',
    simulatedNotice: 'BankTM is a simulated financial platform demonstrating full-stack banking workflows and Indian government financial schemes.',
  },

  kn: {
    bankName: 'ಬ್ಯಾಂಕ್ TM',
    tagline: 'ಬ್ಯಾಂಕ್ TM – ಎಲ್ಲರಿಗೂ ಸುಲಭವಾದ ಬ್ಯಾಂಕಿಂಗ್.',
    welcomeDesc: 'ನಿಮ್ಮ ಖಾತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ, ಹಣ ವರ್ಗಾವಣೆ ಮಾಡಿ, ಹಣಕಾಸು ಸೇವೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ ಮತ್ತು ಸರ್ಕಾರದ ನೆರವಿನ ಯೋಜನೆಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಪಡೆಯಿರಿ.',
    customerLogin: 'ಗ್ರಾಹಕರ ಲಾಗಿನ್',
    adminLogin: 'ಬ್ಯಾಂಕ್ ಅಡ್ಮಿನ್ ಲಾಗಿನ್',
    registerNewCustomer: 'ಹೊಸ ಗ್ರಾಹಕರ ನೋಂದಣಿ',
    loginTitle: 'ಗ್ರಾಹಕರ ಪೋರ್ಟಲ್ ಪ್ರವೇಶ',
    registerTitle: 'ನಿಮ್ಮ ಬ್ಯಾಂಕ್ TM ಖಾತೆಯನ್ನು ರಚಿಸಿ',
    username: 'ಬಳಕೆದಾರ ಹೆಸರು',
    password: 'ಗುಪ್ತಪದ (ಪಾಸ್‌ವರ್ಡ್)',
    confirmPassword: 'ಗುಪ್ತಪದ ದೃಢೀಕರಿಸಿ',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    email: 'ಇಮೇಲ್ ವಿಳಾಸ',
    mobile: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    address: 'ವಾಸದ ವಿಳಾಸ',
    loginButton: 'ಲಾಗಿನ್ ಮಾಡಿ',
    registerButton: 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ',
    logout: 'ಸುರಕ್ಷಿತ ನಿರ್ಗಮನ',
    forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರುವಿರಾ?',
    alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ? ಲಾಗಿನ್ ಮಾಡಿ',
    noAccountYet: 'ಖಾತೆ ಇಲ್ಲವೇ? ಈಗಲೇ ನೋಂದಾಯಿಸಿ',
    adminPortalTitle: 'ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ನಿರ್ವಾಹಕರು',
    demoCredentialsNote: 'ನಿರ್ವಾಹಕರ ಲಾಗಿನ್: admin / BankTM@2026',

    navOverview: 'ಅವಲೋಕನ',
    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navMyBanking: 'ನನ್ನ ಬ್ಯಾಂಕಿಂಗ್',
    navMyProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    navOpenNewAccount: 'ಹೊಸ ಖಾತೆ ತೆರೆಯಿರಿ',
    navMyAccounts: 'ನನ್ನ ಖಾತೆಗಳು',
    navDeposit: 'ಹಣ ಠೇವಣಿ',
    navWithdraw: 'ಹಣ ಹಿಂಪಡೆಯುವಿಕೆ',
    navTransfer: 'ಹಣ ವರ್ಗಾವಣೆ',
    navBalanceEnquiry: 'ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲನೆ',
    navTransactionHistory: 'ವಹಿವಾಟು ಇತಿಹಾಸ',
    navCardServices: 'ಕಾರ್ಡ್ ಸೇವೆಗಳು',
    navApplyDebitCard: 'ಡೆಬಿಟ್ ಕಾರ್ಡ್‌ಗೆ ಅರ್ಜಿ',
    navApplyCreditCard: 'ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್‌ಗೆ ಅರ್ಜಿ',
    navMyCards: 'ನನ್ನ ಕಾರ್ಡ್‌ಗಳು',
    navFinancialAssistance: 'ಹಣಕಾಸು ನೆರವು',
    navGovernmentSchemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    navSmartLoanFinder: 'ಸ್ಮಾರ್ಟ್ ಸಾಲ ಶೋಧಕ',
    navOthers: 'ಇತರ ಸೇವೆಗಳು',
    navSettings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    navHelpSupport: 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ',

    welcomeCustomer: 'ಸುಸ್ವಾಗತ',
    customerId: 'ಗ್ರಾಹಕ ಐಡಿ',
    totalAccounts: 'ಒಟ್ಟು ಖಾತೆಗಳು',
    availableBalance: 'ಲಭ್ಯವಿರುವ ಬ್ಯಾಲೆನ್ಸ್',
    totalDeposits: 'ಒಟ್ಟು ಠೇವಣಿ',
    totalWithdrawals: 'ಒಟ್ಟು ಹಿಂಪಡೆಯುವಿಕೆ',
    quickActions: 'ತ್ವರಿತ ಬ್ಯಾಂಕಿಂಗ್ ಕ್ರಿಯೆಗಳು',
    recentTransactions: 'ಇತ್ತೀಚಿನ ವಹಿವಾಟುಗಳು',
    accountOverview: 'ಖಾತೆಯ ವಿವರ',
    cardStatus: 'ಕಾರ್ಡ್ ಸ್ಥಿತಿ',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
    noRecentTransactions: 'ಯಾವುದೇ ಇತ್ತೀಚಿನ ವಹಿವಾಟುಗಳು ದಾಖಲಾಗಿಲ್ಲ.',

    savingsAccount: 'ಉಳಿತಾಯ ಖಾತೆ',
    currentAccount: 'ಚಾಲ್ತಿ ಖಾತೆ',
    accountNumber: 'ಖಾತೆ ಸಂಖ್ಯೆ',
    accountType: 'ಖಾತೆಯ ಮಾದರಿ',
    ifscCode: 'IFSC ಕೋಡ್',
    branch: 'ಶಾಖೆ',
    minBalanceNote: 'ಕನಿಷ್ಠ ಬ್ಯಾಲೆನ್ಸ್ ಅಗತ್ಯತೆ: ₹1,000',
    overdraftNote: 'ಓವರ್‌ಡ್ರಾಫ್ಟ್ ಸೌಲಭ್ಯ ಲಭ್ಯವಿದೆ',
    statusActive: 'ಸಕ್ರಿಯವಾಗಿದೆ',
    statusPending: 'ಅನುಮೋದನೆ ಬಾಕಿ',
    statusDormant: 'ಸ್ಥಗಿತಗೊಂಡಿದೆ',

    amount: 'ಮೊತ್ತ (₹)',
    selectAccount: 'ಖಾತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    depositHeading: 'ಖಾತೆಗೆ ಹಣ ಠೇವಣಿ ಮಾಡಿ',
    withdrawHeading: 'ಖಾತೆಯಿಂದ ಹಣ ಹಿಂಪಡೆಯಿರಿ',
    transferHeading: 'ನೇರ ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ',
    beneficiaryAccount: 'ಸ್ವೀಕರಿಸುವವರ ಖಾತೆ ಸಂಖ್ಯೆ',
    beneficiaryName: 'ಸ್ವೀಕರಿಸುವವರ ಹೆಸರು',
    description: 'ಟಿಪ್ಪಣಿ / ವಿವರ',
    confirmTransaction: 'ವಹಿವಾಟು ದೃಢೀಕರಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    submit: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    transactionSuccess: 'ವಹಿವಾಟು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ',
    transactionId: 'ವಹಿವಾಟು ಐಡಿ',
    downloadReceipt: 'ರಸೀದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    printReceipt: 'ರಸೀದಿ ಮುದ್ರಿಸಿ',
    date: 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯ',
    type: 'ಮಾದರಿ',
    status: 'ಸ್ಥಿತಿ',
    filterBy: 'ಫಿಲ್ಟರ್ ಮಾಡಿ',
    allTypes: 'ಎಲ್ಲಾ ವಹಿವಾಟು ಮಾದರಿಗಳು',

    cardNetwork: 'ಕಾರ್ಡ್ ನೆಟ್‌ವರ್ಕ್ ಆಯ್ಕೆ',
    deliveryAddress: 'ವಿತರಣಾ ವಿಳಾಸ',
    applyDebitHeading: 'ಡೆಬಿಟ್ ಕಾರ್ಡ್‌ಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    applyCreditHeading: 'ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್‌ಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    employmentCategory: 'ಉದ್ಯೋಗ ವರ್ಗ',
    monthlyIncome: 'ಮಾಸಿಕ ಆದಾಯ (₹)',
    requestedLimit: 'ಅಪೇಕ್ಷಿತ ಮಿತಿ (₹)',
    employerName: 'ಉದ್ಯೋಗದಾತ / ವ್ಯವಹಾರ ಹೆಸರು',
    simulatedEligibilityScore: 'ಅರ್ಹತಾ ಅಂಕ',
    trackApplications: 'ಅರ್ಜಿ ಪ್ರಗತಿ ಟ್ರ್ಯಾಕರ್',
    debitCards: 'ಡೆಬಿಟ್ ಕಾರ್ಡ್‌ಗಳು',
    creditCards: 'ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್‌ಗಳು',
    applicationReference: 'ಅರ್ಜಿ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ',
    submittedOn: 'ಸಲ್ಲಿಸಿದ ದಿನಾಂಕ',
    remarks: 'ಅಡ್ಮಿನ್ ಟಿಪ್ಪಣಿ',

    statusSubmitted: 'ಸಲ್ಲಿಸಲಾಗಿದೆ',
    statusUnderReview: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    statusAdditionalInfo: 'ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ ಅಗತ್ಯವಿದೆ',
    statusApproved: 'ಅನುಮೋದಿಸಲಾಗಿದೆ',
    statusRejected: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
    statusDispatched: 'ರವಾನಿಸಲಾಗಿದೆ',
    statusDelivered: 'ತಲುಪಿಸಲಾಗಿದೆ',

    schemesHeading: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಹಣಕಾಸು ನೆರವು',
    schemesSubheading: 'ಕೃಷಿಕರ ಯೋಜನೆಗಳು, ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು ಮತ್ತು ವ್ಯಾಪಾರ ಸಾಲ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.',
    catAll: 'ಎಲ್ಲಾ ಯೋಜನೆಗಳು',
    catAgriculture: 'ಕೃಷಿ ಮತ್ತು ರೈತ ಯೋಜನೆಗಳು',
    catEducation: 'ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ',
    catBusiness: 'ವ್ಯವಹಾರ ಮತ್ತು ಉದ್ಯಮಶೀಲತೆ',
    catWomen: 'ಮಹಿಳಾ ಸಬಲೀಕರಣ',
    catKarnataka: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    targetBeneficiaries: 'ಫಲಾನುಭವಿಗಳು',
    eligibility: 'ಅರ್ಹತಾ ಮಾನದಂಡಗಳು',
    benefits: 'ಆರ್ಥಿಕ ಪ್ರಯೋಜನಗಳು',
    documentsRequired: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು',
    applyOnOfficialPortal: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    lastVerified: 'ಕೊನೆಯ ಪರಿಶೀಲನೆ ದಿನಾಂಕ',
    disclaimerGovernment: 'ಗಮನಿಸಿ: ಬ್ಯಾಂಕ್ TM ಸರ್ಕಾರದ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳಿಗೆ ನೇರ ಸಂಪರ್ಕವನ್ನು ಒದಗಿಸುತ್ತದೆ.',

    loanFinderTitle: 'ಸ್ಮಾರ್ಟ್ ಸಾಲ ಮತ್ತು ನೆರವು ಶೋಧಕ',
    loanFinderSubtitle: 'ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನಗಳನ್ನು ಸುಲಭವಾಗಿ ಕಂಡುಕೊಳ್ಳಿ.',
    whoAreYou: 'ನಿಮ್ಮ ವಿವರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    farmer: 'ರೈತರು / ಕೃಷಿಕರು',
    student: 'ವಿದ್ಯಾರ್ಥಿ / ಸಂಶೋಧಕರು',
    womanEntrepreneur: 'ಮಹಿಳಾ ಉದ್ಯಮಿ',
    smallBusiness: 'ಸಣ್ಣ ವ್ಯಾಪಾರಿ / MSME',
    selfEmployed: 'ಸ್ವಯಂ ಉದ್ಯೋಗಿ',
    generalCitizen: 'ಸಾಮಾನ್ಯ ನಾಗರಿಕರು',
    loanPurpose: 'ನಿಮ್ಮ ಮುಖ್ಯ ಆರ್ಥಿಕ ಅಗತ್ಯವೇನು?',
    purposeFarming: 'ಕೃಷಿ ಉಪಕರಣಗಳು ಮತ್ತು ಬೆಳೆ ಸಾಲ',
    purposeEducation: 'ಉನ್ನತ ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ',
    purposeBusiness: 'ವ್ಯವಹಾರ ವಿಸ್ತರಣೆ ಮತ್ತು ಬಂಡವಾಳ',
    purposeHousing: 'ಮನೆ ನಿರ್ಮಾಣ ಮತ್ತು ನವೀಕರಣ',
    purposePersonal: 'ಸಾಮಾನ್ಯ ಆರ್ಥಿಕ ನೆರವು',
    findMatchingSchemes: 'ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ',
    matchingSchemesFound: 'ನಿಮಗಾಗಿ ಸೂಕ್ತ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    noSchemesMatched: 'ಯಾವುದೇ ಫಲಿತಾಂಶ ದೊರೆತಿಲ್ಲ. ಎಲ್ಲಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ.',

    settingsTitle: 'ಭದ್ರತೆ ಮತ್ತು ಆದ್ಯತೆಗಳು',
    changePassword: 'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ',
    newPassword: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್',
    updatePassword: 'ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಿ',
    languagePreference: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
    customerSupport: '24x7 ಗ್ರಾಹಕ ಸೇವಾ ಬೆಂಬಲ',
    branchLocator: 'ಶಾಖೆ ಮತ್ತು ಎಟಿಎಂ ಹುಡುಕಿ',
    tollFreeHelpline: 'ಉಚಿತ ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆ: 1800-425-2026',
    simulatedNotice: 'ಬ್ಯಾಂಕ್ TM ಒಂದು ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಅನುಕರಣೆ ವೇದಿಕೆಯಾಗಿದೆ.',
  },

  hi: {
    bankName: 'बैंक TM',
    tagline: 'बैंक TM – सभी के लिए सरल बैंकिंग।',
    welcomeDesc: 'अपने खातों का प्रबंधन करें, पैसे ट्रांसफर करें, वित्तीय सेवाओं का अन्वेषण करें और सरकारी सहायता योजनाओं की जानकारी पाएं—सब एक ही स्थान पर।',
    customerLogin: 'ग्राहक लॉगिन',
    adminLogin: 'बैंक एडमिन लॉगिन',
    registerNewCustomer: 'नया ग्राहक पंजीकरण',
    loginTitle: 'ग्राहक पोर्टल लॉगिन',
    registerTitle: 'बैंक TM खाता खोलें',
    username: 'यूज़रनेम',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    fullName: 'पूरा नाम',
    email: 'ईमेल पता',
    mobile: 'मोबाइल नंबर',
    address: 'निवास का पता',
    loginButton: 'लॉगिन करें',
    registerButton: 'पंजीकरण पूरा करें',
    logout: 'सुरक्षित लॉगआउट',
    forgotPassword: 'पासवर्ड भूल गए?',
    alreadyHaveAccount: 'पहले से खाता है? लॉगिन करें',
    noAccountYet: 'खाता नहीं है? अभी रजिस्टर करें',
    adminPortalTitle: 'अधिकृत बैंक प्रशासन',
    demoCredentialsNote: 'एडमिन लॉगिन: admin / BankTM@2026',

    navOverview: 'अवलोकन',
    navDashboard: 'डैशबोर्ड',
    navMyBanking: 'मेरी बैंकिंग',
    navMyProfile: 'मेरा प्रोफ़ाइल',
    navOpenNewAccount: 'नया खाता खोलें',
    navMyAccounts: 'मेरे खाते',
    navDeposit: 'राशि जमा करें',
    navWithdraw: 'राशि निकालें',
    navTransfer: 'धन अंतरण',
    navBalanceEnquiry: 'शेष राशि जांचें',
    navTransactionHistory: 'लेनदेन इतिहास',
    navCardServices: 'कार्ड सेवाएं',
    navApplyDebitCard: 'डेबिट कार्ड हेतु आवेदन',
    navApplyCreditCard: 'क्रेडिट कार्ड हेतु आवेदन',
    navMyCards: 'मेरे कार्ड',
    navFinancialAssistance: 'वित्तीय सहायता',
    navGovernmentSchemes: 'सरकारी योजनाएं',
    navSmartLoanFinder: 'स्मार्ट ऋण खोजक',
    navOthers: 'अन्य सेवाएं',
    navSettings: 'सेटिंग्स',
    navHelpSupport: 'सहायता एवं संपर्क',

    welcomeCustomer: 'स्वागत है',
    customerId: 'ग्राहक आईडी',
    totalAccounts: 'कुल खाते',
    availableBalance: 'उपलब्ध शेष राशि',
    totalDeposits: 'कुल जमा',
    totalWithdrawals: 'कुल निकासी',
    quickActions: 'त्वरित बैंकिंग क्रियाएं',
    recentTransactions: 'हाल के लेनदेन',
    accountOverview: 'खाता विवरण',
    cardStatus: 'कार्ड स्थिति',
    viewAll: 'सभी देखें',
    noRecentTransactions: 'कोई हालिया लेनदेन उपलब्ध नहीं है।',

    savingsAccount: 'बचत खाता',
    currentAccount: 'चालू खाता',
    accountNumber: 'खाता संख्या',
    accountType: 'खाता प्रकार',
    ifscCode: 'IFSC कोड',
    branch: 'शाखा',
    minBalanceNote: 'न्यूनतम शेष आवश्यकता: ₹1,000',
    overdraftNote: 'ओवरड्राफ्ट सुविधा उपलब्ध',
    statusActive: 'सक्रिय',
    statusPending: 'स्वीकृति लंबित',
    statusDormant: 'निष्क्रिय',

    amount: 'राशि (₹)',
    selectAccount: 'खाता चुनें',
    depositHeading: 'खाते में राशि जमा करें',
    withdrawHeading: 'खाते से राशि निकालें',
    transferHeading: 'सीधा बैंक अंतरण',
    beneficiaryAccount: 'लाभार्थी खाता संख्या',
    beneficiaryName: 'लाभार्थी का नाम',
    description: 'लेनदेन विवरण / टिप्पणी',
    confirmTransaction: 'लेनदेन अधिकृत करें',
    cancel: 'रद्द करें',
    submit: 'आवेदन जमा करें',
    transactionSuccess: 'लेनदेन सफलतापूर्वक पूर्ण हुआ',
    transactionId: 'लेनदेन आईडी',
    downloadReceipt: 'रसीद डाउनलोड करें',
    printReceipt: 'रसीद प्रिंट करें',
    date: 'दिनांक एवं समय',
    type: 'प्रकार',
    status: 'स्थिति',
    filterBy: 'फ़िल्टर करें',
    allTypes: 'सभी लेनदेन प्रकार',

    cardNetwork: 'कार्ड नेटवर्क वरीयता',
    deliveryAddress: 'कार्ड वितरण पता',
    applyDebitHeading: 'डेबिट कार्ड के लिए आवेदन करें',
    applyCreditHeading: 'क्रेडिट कार्ड के लिए आवेदन करें',
    employmentCategory: 'रोजगार श्रेणी',
    monthlyIncome: 'मासिक आय (₹)',
    requestedLimit: 'वांछित सीमा (₹)',
    employerName: 'नियोक्ता / व्यवसाय का नाम',
    simulatedEligibilityScore: 'पात्रता स्कोर',
    trackApplications: 'आवेदन प्रगति ट्रैकर',
    debitCards: 'डेबिट कार्ड',
    creditCards: 'क्रेडिट कार्ड',
    applicationReference: 'आवेदन संदर्भ संख्या',
    submittedOn: 'जमा करने की तारीख',
    remarks: 'एडमिन टिप्पणी',

    statusSubmitted: 'जमा किया गया',
    statusUnderReview: 'समीक्षाधीन',
    statusAdditionalInfo: 'अतिरिक्त जानकारी अपेक्षित',
    statusApproved: 'स्वीकृत',
    statusRejected: 'अस्वीकृत',
    statusDispatched: 'भेज दिया गया',
    statusDelivered: 'प्राप्त हुआ',

    schemesHeading: 'सरकारी योजनाएं और वित्तीय सहायता',
    schemesSubheading: 'भारत सरकार की कृषि, शिक्षा, छात्रवृत्ति एवं व्यापार सहायता योजनाओं की प्रामाणिक जानकारी।',
    catAll: 'सभी योजनाएं',
    catAgriculture: 'कृषि एवं किसान योजनाएं',
    catEducation: 'शिक्षा एवं छात्रवृत्ति',
    catBusiness: 'व्यापार एवं सूक्ष्म उद्यम',
    catWomen: 'महिला सशक्तिकरण',
    catKarnataka: 'कर्नाटक राज्य योजनाएं',
    targetBeneficiaries: 'लक्षित लाभार्थी',
    eligibility: 'पात्रता मानदंड',
    benefits: 'वित्तीय लाभ',
    documentsRequired: 'आवश्यक दस्तावेज',
    applyOnOfficialPortal: 'आधिकारिक पोर्टल पर आवेदन करें',
    lastVerified: 'सत्यापन तिथि',
    disclaimerGovernment: 'सूचना: बैंक TM केवल आधिकारिक सरकारी पोर्टलों के लिए मार्गदर्शन और सीधे लिंक प्रदान करता है।',

    loanFinderTitle: 'स्मार्ट ऋण एवं सहायता खोजक',
    loanFinderSubtitle: 'अपने लिए अनुकूलित सरकारी योजनाओं, सब्सिडी एवं छात्रवृत्तियों की खोज करें।',
    whoAreYou: 'आपकी श्रेणी कौन सी है?',
    farmer: 'किसान / काश्तकार',
    student: 'विद्यार्थी / शोधार्थी',
    womanEntrepreneur: 'महिला उद्यमी',
    smallBusiness: 'लघु व्यापारी / MSME',
    selfEmployed: 'स्वरोजगारी / विक्रेता',
    generalCitizen: 'सामान्य नागरिक',
    loanPurpose: 'आपकी वित्तीय आवश्यकता क्या है?',
    purposeFarming: 'कृषि उपकरण एवं फसल सहायता',
    purposeEducation: 'उच्च शिक्षा एवं छात्रवृत्ति',
    purposeBusiness: 'व्यापार विस्तार एवं कार्यशील पूंजी',
    purposeHousing: 'मकान निर्माण एवं सुधार',
    purposePersonal: 'सामान्य वित्तीय सहायता',
    findMatchingSchemes: 'योजनाएं खोजें',
    matchingSchemesFound: 'आपके लिए उपयुक्त सरकारी योजनाएं',
    noSchemesMatched: 'कोई सटीक मेल नहीं मिला। संपूर्ण सरकारी योजना सूची देखें।',

    settingsTitle: 'सुरक्षा एवं प्राथमिकताएं',
    changePassword: 'पासवर्ड बदलें',
    newPassword: 'नया पासवर्ड',
    updatePassword: 'पासवर्ड अपडेट करें',
    languagePreference: 'पसंदीदा भाषा',
    customerSupport: '24x7 ग्राहक सेवा सहायता',
    branchLocator: 'शाखा एवं एटीएम खोजें',
    tollFreeHelpline: 'टोल-फ्री हेल्पलाइन: 1800-425-2026',
    simulatedNotice: 'बैंक TM एक उन्नत डिजिटल बैंकिंग सिमुलेशन प्लेटफॉर्म है।',
  },

  ta: {
    bankName: 'வங்கி TM',
    tagline: 'வங்கி TM – அனைவருக்கும் எளிய வங்கிச் சேவை.',
    welcomeDesc: 'உங்கள் கணக்குகளை நிர்வகிக்கவும், பணம் மாற்றவும் மற்றும் அரசு நலத்திட்டங்களை ஒரே இடத்தில் கண்டறியவும்.',
    customerLogin: 'வாடிக்கையாளர் உள்நுழைவு',
    adminLogin: 'நிர்வாகி உள்நுழைவு',
    registerNewCustomer: 'புதிய வாடிக்கையாளர் பதிவு',
    loginTitle: 'வாடிக்கையாளர் போர்டல்',
    registerTitle: 'புதிய கணக்கு தொடங்குங்கள்',
    username: 'பயனர்பெயர்',
    password: 'கடவுச்சொல்',
    confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்துக',
    fullName: 'முழு பெயர்',
    email: 'மின்னஞ்சல் முகவரி',
    mobile: 'கைபேசி எண்',
    address: 'முகவரி',
    loginButton: 'உள்நுழையவும்',
    registerButton: 'பதிவு செய்க',
    logout: 'வெளியேறு',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்',
    noAccountYet: 'கணக்கு இல்லையா? பதிவு செய்க',
    adminPortalTitle: 'வங்கி நிர்வாக போர்டல்',
    demoCredentialsNote: 'நிர்வாகி லாகின்: admin / BankTM@2026',

    navOverview: 'கண்ணோட்டம்',
    navDashboard: 'முகப்பு பலகை',
    navMyBanking: 'எனது வங்கிச் சேவை',
    navMyProfile: 'எனது சுயவிவரம்',
    navOpenNewAccount: 'புதிய கணக்கு திறக்க',
    navMyAccounts: 'எனது கணக்குகள்',
    navDeposit: 'பணம் வைப்பு',
    navWithdraw: 'பணம் எடுத்தல்',
    navTransfer: 'பணம் மாற்றுதல்',
    navBalanceEnquiry: 'மீதி தொகை விசாரணை',
    navTransactionHistory: 'பரிவர்த்தனை வரலாறு',
    navCardServices: 'அட்டை சேவைகள்',
    navApplyDebitCard: 'டெபிட் கார்டு விண்ணப்பம்',
    navApplyCreditCard: 'கிரெடிட் கார்டு விண்ணப்பம்',
    navMyCards: 'எனது அட்டைகள்',
    navFinancialAssistance: 'நிதி உதவி',
    navGovernmentSchemes: 'அரசு நலத்திட்டங்கள்',
    navSmartLoanFinder: 'ஸ்மார்ட் கடன் கண்டறிதல்',
    navOthers: 'பிற சேவைகள்',
    navSettings: 'அமைப்புகள்',
    navHelpSupport: 'உதவி & ஆதரவு',

    welcomeCustomer: 'வணக்கம்',
    customerId: 'வாடிக்கையாளர் எண்',
    totalAccounts: 'மொத்த கணக்குகள்',
    availableBalance: 'இருப்பு தொகை',
    totalDeposits: 'மொத்த வைப்பு',
    totalWithdrawals: 'மொத்த எடுத்தல்',
    quickActions: 'விரைவு வங்கிச் சேவைகள்',
    recentTransactions: 'சமீபத்திய பரிவர்த்தனைகள்',
    accountOverview: 'கணக்கு கண்ணோட்டம்',
    cardStatus: 'அட்டை நிலை',
    viewAll: 'அனைத்தையும் பார்க்க',
    noRecentTransactions: 'சமீபத்திய பரிவர்த்தனைகள் எதுவும் இல்லை.',

    savingsAccount: 'சேமிப்பு கணக்கு',
    currentAccount: 'நடப்பு கணக்கு',
    accountNumber: 'கணக்கு எண்',
    accountType: 'கணக்கு வகை',
    ifscCode: 'IFSC குறியீடு',
    branch: 'கிளை',
    minBalanceNote: 'குறைந்தபட்ச இருப்பு தேவை: ₹1,000',
    overdraftNote: 'ஓவர் டிராஃப்ட் வசதி உண்டு',
    statusActive: 'செயலில் உள்ளது',
    statusPending: 'ஒப்புதலுக்கு காத்திருக்கிறது',
    statusDormant: 'செயலற்றது',

    amount: 'தொகை (₹)',
    selectAccount: 'கணக்கை தேர்வுசெய்க',
    depositHeading: 'கணக்கில் பணம் வைப்பு செய்க',
    withdrawHeading: 'கணக்கிலிருந்து பணம் எடுத்தல்',
    transferHeading: 'நேரடி வங்கி பரிமாற்றம்',
    beneficiaryAccount: 'பெறுநர் கணக்கு எண்',
    beneficiaryName: 'பெறுநர் பெயர்',
    description: 'விவரக்குறிப்பு',
    confirmTransaction: 'பரிவர்த்தனையை உறுதிசெய்க',
    cancel: 'ரத்து செய்',
    submit: 'விண்ணப்பிக்க',
    transactionSuccess: 'பரிவர்த்தனை வெற்றிகரமாக முடிந்தது',
    transactionId: 'பரிவர்த்தனை எண்',
    downloadReceipt: 'ரசீதை பதிவிறக்குக',
    printReceipt: 'ரசீதை அச்சிடுக',
    date: 'தேதி & நேரம்',
    type: 'வகை',
    status: 'நிலை',
    filterBy: 'வடிகட்டுதல்',
    allTypes: 'அனைத்து பரிவர்த்தனைகள்',

    cardNetwork: 'அட்டை கட்டமைப்பு விருப்பம்',
    deliveryAddress: 'அட்டை அனுப்ப வேண்டிய முகவரி',
    applyDebitHeading: 'டெபிட் கார்டு விண்ணப்பம்',
    applyCreditHeading: 'கிரெடிட் கார்டு விண்ணப்பம்',
    employmentCategory: 'தொழில் பிரிவு',
    monthlyIncome: 'மாத வருமானம் (₹)',
    requestedLimit: 'கோரப்பட்ட கடன் வரம்பு (₹)',
    employerName: 'நிறுவனத்தின் பெயர்',
    simulatedEligibilityScore: 'தகுதி மதிப்பீடு',
    trackApplications: 'விண்ணப்ப கண்காணிப்பு',
    debitCards: 'டெபிட் அட்டைகள்',
    creditCards: 'கிரெடிட் அட்டைகள்',
    applicationReference: 'விண்ணப்ப குறிப்பு எண்',
    submittedOn: 'விண்ணப்பித்த தேதி',
    remarks: 'நிர்வாகியின் கருத்து',

    statusSubmitted: 'சமர்ப்பிக்கப்பட்டது',
    statusUnderReview: 'பரிசீலனையில்',
    statusAdditionalInfo: 'கூடுதல் தகவல் தேவை',
    statusApproved: 'ஒப்புதல் அளிக்கப்பட்டது',
    statusRejected: 'நிராகரிக்கப்பட்டது',
    statusDispatched: 'அனுப்பப்பட்டது',
    statusDelivered: 'வழங்கப்பட்டது',

    schemesHeading: 'அரசு நலத்திட்டங்கள் & நிதி உதவி',
    schemesSubheading: 'இந்திய அரசின் விவசாய, கல்வி உதவித்தொகை மற்றும் வணிக கடன் திட்டங்கள்.',
    catAll: 'அனைத்து திட்டங்கள்',
    catAgriculture: 'விவசாய திட்டங்கள்',
    catEducation: 'கல்வி & உதவித்தொகை',
    catBusiness: 'வணிகம் & குறுந்தொழில்',
    catWomen: 'மகளிர் மேம்பாடு',
    catKarnataka: 'கர்நாடகா மாநில திட்டங்கள்',
    targetBeneficiaries: 'பயனாளிகள்',
    eligibility: 'தகுதி வரம்புகள்',
    benefits: 'நிதி சலுகைகள்',
    documentsRequired: 'தேவையான ஆவணங்கள்',
    applyOnOfficialPortal: 'அதிகாரப்பூர்வ தளத்தில் விண்ணப்பிக்க',
    lastVerified: 'சரிபார்க்கப்பட்ட தேதி',
    disclaimerGovernment: 'குறிப்பு: வங்கி TM அரசின் அதிகாரப்பூர்வ தளங்களுக்கான நேரடி இணைப்புகளை வழங்குகிறது.',

    loanFinderTitle: 'ஸ்மார்ட் கடன் கண்டறிதல்',
    loanFinderSubtitle: 'உங்கள் தேவைகளுக்கு ஏற்ற அரசு திட்டங்களை விரைவாக கண்டறியவும்.',
    whoAreYou: 'உங்கள் சுயவிவரம் என்ன?',
    farmer: 'விவசாயி',
    student: 'மாணவர்',
    womanEntrepreneur: 'பெண் தொழில்முனைவோர்',
    smallBusiness: 'சிறு வணிக உரிமையாளர்',
    selfEmployed: 'சுயதொழில் செய்வோர்',
    generalCitizen: 'பொது குடிமக்கள்',
    loanPurpose: 'உங்கள் நிதி தேவை என்ன?',
    purposeFarming: 'விவசாய கருவிகள் & பயிர் உதவி',
    purposeEducation: 'உயர்கல்வி & உதவித்தொகை',
    purposeBusiness: 'தொழில் விரிவாக்கம்',
    purposeHousing: 'வீட்டு வசதி',
    purposePersonal: 'பொது நிதி உதவி',
    findMatchingSchemes: 'திட்டங்களை கண்டறிக',
    matchingSchemesFound: 'உங்களுக்கான பொருத்தமான அரசு திட்டங்கள்',
    noSchemesMatched: 'பொருந்தும் திட்டங்கள் இல்லை. அனைத்து திட்டங்களையும் பார்க்கவும்.',

    settingsTitle: 'பாதுகாப்பு & விருப்பங்கள்',
    changePassword: 'கடவுச்சொல் மாற்றுதல்',
    newPassword: 'புதிய கடவுச்சொல்',
    updatePassword: 'கடவுச்சொல் புதுப்பிக்க',
    languagePreference: 'விருப்ப மொழி',
    customerSupport: '24x7 வாடிக்கையாளர் சேவை',
    branchLocator: 'கிளை & ஏடிஎம் கண்டறிதல்',
    tollFreeHelpline: 'இலவச உதவி எண்: 1800-425-2026',
    simulatedNotice: 'வங்கி TM என்பது டிஜிட்டல் வங்கி செயல்முறைகளை வெளிப்படுத்தும் தளமாகும்.',
  },

  te: {
    bankName: 'బ్యాంక్ TM',
    tagline: 'బ్యాంక్ TM – అందరికీ సులభమైన బ్యాంకింగ్.',
    welcomeDesc: 'మీ ఖాతాలను నిర్వహించండి, డబ్బును బదిలీ చేయండి, ఆర్థిక సేవలను అన్వేషించండి మరియు ప్రభుత్వ సహాయ పథకాలను ఒకే చోట పొందండి.',
    customerLogin: 'ఖాతాదారుల లాగిన్',
    adminLogin: 'బ్యాంక్ అడ్మిన్ లాగిన్',
    registerNewCustomer: 'కొత్త ఖాతాదారు నమోదు',
    loginTitle: 'కస్టమర్ పోర్టల్ లాగిన్',
    registerTitle: 'బ్యాంక్ TM ఖాతాను తెరవండి',
    username: 'వినియోగదారు పేరు',
    password: 'పాస్‌వర్డ్',
    confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
    fullName: 'పూర్తి పేరు',
    email: 'ఈమెయిల్ చిరునామా',
    mobile: 'మొబైల్ నంబర్',
    address: 'నివాస చిరునామా',
    loginButton: 'లాగిన్ చేయండి',
    registerButton: 'నమోదు పూర్తి చేయండి',
    logout: 'సురక్షిత నిష్క్రమణ',
    forgotPassword: 'పాస్‌వర్డ్ మరిచిపోయారా?',
    alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ చేయండి',
    noAccountYet: 'ఖాతా లేదా? ఇప్పుడే నమోదు చేయండి',
    adminPortalTitle: 'అధికారిక బ్యాంక్ అడ్మినిస్ట్రేషన్',
    demoCredentialsNote: 'అడ్మిన్ లాగిన్: admin / BankTM@2026',

    navOverview: 'అవలోకనం',
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navMyBanking: 'నా బ్యాంకింగ్',
    navMyProfile: 'నా ప్రొఫైల్',
    navOpenNewAccount: 'కొత్త ఖాతా తెరవండి',
    navMyAccounts: 'నా ఖాతాలు',
    navDeposit: 'డబ్బు డిపాజిట్',
    navWithdraw: 'డబ్బు ఉపసంహరణ',
    navTransfer: 'డబ్బు బదిలీ',
    navBalanceEnquiry: 'బ్యాలెన్స్ విచారణ',
    navTransactionHistory: 'లావాదేవీల చరిత్ర',
    navCardServices: 'కార్డుల సేవలు',
    navApplyDebitCard: 'డెబిట్ కార్డు కోసం దరఖాస్తు',
    navApplyCreditCard: 'క్రెడిట్ కార్డు కోసం దరఖాస్తు',
    navMyCards: 'నా కార్డులు',
    navFinancialAssistance: 'ఆర్థిక సహాయం',
    navGovernmentSchemes: 'ప్రభుత్వ పథకాలు',
    navSmartLoanFinder: 'స్మార్ట్ లోన్ ఫైండర్',
    navOthers: 'ఇతర సేవలు',
    navSettings: 'సెట్టింగ్‌లు',
    navHelpSupport: 'సహాయం & మద్దతు',

    welcomeCustomer: 'స్వాగతం',
    customerId: 'కస్టమర్ ఐడి',
    totalAccounts: 'మొత్తం ఖాతాలు',
    availableBalance: 'లభ్యమైన బ్యాలెన్స్',
    totalDeposits: 'మొత్తం డిపాజిట్లు',
    totalWithdrawals: 'మొత్తం ఉపసంహరణలు',
    quickActions: 'త్వరిత బ్యాంకింగ్ చర్యలు',
    recentTransactions: 'ఇటీవలి లావాదేవీలు',
    accountOverview: 'ఖాతా వివరాలు',
    cardStatus: 'కార్డు స్థితి',
    viewAll: 'అన్నీ చూడండి',
    noRecentTransactions: 'ఇటీవలి లావాదేవీలు లేవు.',

    savingsAccount: 'పొదుపు ఖాతా (సేవింగ్స్)',
    currentAccount: 'కరెంట్ ఖాతా',
    accountNumber: 'ఖాతా సంఖ్య',
    accountType: 'ఖాతా రకం',
    ifscCode: 'IFSC కోడ్',
    branch: 'శాఖ',
    minBalanceNote: 'కనీస బ్యాలెన్స్ అవసరం: ₹1,000',
    overdraftNote: 'ఓవర్‌డ్రాఫ్ట్ సౌకర్యం కలదు',
    statusActive: 'క్రియాశీలం',
    statusPending: 'ఆమోదం పెండింగ్',
    statusDormant: 'స్తంభించినది',

    amount: 'మొత్తం (₹)',
    selectAccount: 'ఖాతాను ఎంచుకోండి',
    depositHeading: 'ఖాతాలో డబ్బు జమ చేయండి',
    withdrawHeading: 'ఖాతా నుండి డబ్బు తీయండి',
    transferHeading: 'డైరెక్ట్ బ్యాంక్ బదిలీ',
    beneficiaryAccount: 'లబ్ధిదారుని ఖాతా సంఖ్య',
    beneficiaryName: 'లబ్ధిదారుని పేరు',
    description: 'లావాదేవీ వివరణ',
    confirmTransaction: 'లావాదేవీని ధృవీకరించండి',
    cancel: 'రద్దు చేయండి',
    submit: 'దరఖాస్తు సమర్పించండి',
    transactionSuccess: 'లావాదేవీ విజయవంతంగా పూర్తయింది',
    transactionId: 'లావాదేవీ ఐడి',
    downloadReceipt: 'రసీదు డౌన్‌లోడ్ చేయండి',
    printReceipt: 'రసీదు ముద్రించండి',
    date: 'తేదీ & సమయం',
    type: 'రకం',
    status: 'స్థితి',
    filterBy: 'ఫిల్టర్ చేయండి',
    allTypes: 'అన్ని రకాల లావాదేవీలు',

    cardNetwork: 'కార్డు నెట్‌వర్క్ ఎంపిక',
    deliveryAddress: 'డెలివరీ చిరునామా',
    applyDebitHeading: 'డెబిట్ కార్డు దరఖాస్తు',
    applyCreditHeading: 'క్రెడిట్ కార్డు దరఖాస్తు',
    employmentCategory: 'ఉద్యోగ వర్గం',
    monthlyIncome: 'నెలవారీ ఆదాయం (₹)',
    requestedLimit: 'కోరిన క్రెడిట్ పరిమితి (₹)',
    employerName: 'కంపెనీ / వ్యాపార పేరు',
    simulatedEligibilityScore: 'అర్హత స్కోరు',
    trackApplications: 'దరఖాస్తు పురోగతి ట్రాకర్',
    debitCards: 'డెబిట్ కార్డులు',
    creditCards: 'క్రెడిట్ కార్డులు',
    applicationReference: 'దరఖాస్తు రిఫరెన్స్ సంఖ్య',
    submittedOn: 'సమర్పించిన తేదీ',
    remarks: 'అడ్మిన్ వ్యాఖ్య',

    statusSubmitted: 'సమర్పించబడింది',
    statusUnderReview: 'పరిశీలనలో ఉంది',
    statusAdditionalInfo: 'అదనపు సమాచారం అవసరం',
    statusApproved: 'ఆమోదించబడింది',
    statusRejected: 'తిరస్కరించబడింది',
    statusDispatched: 'రవాణా చేయబడింది',
    statusDelivered: 'అందజేయబడింది',

    schemesHeading: 'ప్రభుత్వ పథకాలు & ఆర్థిక సహాయం',
    schemesSubheading: 'భారత ప్రభుత్వ వ్యవసాయ, విద్యా స్కాలర్‌షిప్ మరియు వ్యాపార రుణ పథకాలు.',
    catAll: 'అన్ని పథకాలు',
    catAgriculture: 'వ్యవసాయ మరియు రైతు పథకాలు',
    catEducation: 'విద్య & స్కాలర్‌షిప్‌లు',
    catBusiness: 'వ్యాపార & చిన్న పరిశ్రమలు',
    catWomen: 'మహిళా సాధికారత',
    catKarnataka: 'కర్ణాటక రాష్ట్ర పథకాలు',
    targetBeneficiaries: 'లబ్ధిదారులు',
    eligibility: 'అర్హత ప్రమాణాలు',
    benefits: 'ఆర్థిక ప్రయోజనాలు',
    documentsRequired: 'అవసరమైన పత్రాలు',
    applyOnOfficialPortal: 'అధికారిక పోర్టల్‌లో దరఖాస్తు చేయండి',
    lastVerified: 'ధృవీకరించబడిన తేదీ',
    disclaimerGovernment: 'గమనిక: బ్యాంక్ TM అధికారిక ప్రభుత్వ పోర్టల్‌లకు మార్గదర్శకత్వం మరియు నేరుగా లింక్‌లను అందిస్తుంది.',

    loanFinderTitle: 'స్మార్ట్ లోన్ & సహాయ ఫైండర్',
    loanFinderSubtitle: 'మీకు అనువైన ప్రభుత్వ రాయితీలు మరియు విద్యార్థివేతనాలను సులభంగా కనుగొనండి.',
    whoAreYou: 'మీ వివరాలను ఎంచుకోండి',
    farmer: 'రైతు / సేద్యకారుడు',
    student: 'విద్యార్థి / పరిశోధకుడు',
    womanEntrepreneur: 'మహిళా వ్యవస్థాపకురాలు',
    smallBusiness: 'చిన్న వ్యాపారి / MSME',
    selfEmployed: 'స్వయం ఉపాధిదారుడు',
    generalCitizen: 'సాధారణ పౌరుడు',
    loanPurpose: 'మీ ప్రధాన ఆర్థిక అవసరం ఏమిటి?',
    purposeFarming: 'వ్యవసాయ పరికరాలు & పంటల సహాయం',
    purposeEducation: 'ఉన్నత విద్య & స్కాలర్‌షిప్',
    purposeBusiness: 'వ్యాపార విస్తరణ & పెట్టుబడి',
    purposeHousing: 'గృహ నిర్మాణం & పునరుద్ధరణ',
    purposePersonal: 'సాధారణ ఆర్థిక సహాయం',
    findMatchingSchemes: 'పథకాలను కనుగొనండి',
    matchingSchemesFound: 'మీ కోసం సరిపోలే ప్రభుత్వ పథకాలు',
    noSchemesMatched: 'సరిపోయే పథకాలు లభించలేదు. అన్ని ప్రభుత్వ పథకాలను చూడండి.',

    settingsTitle: 'భద్రత & ప్రాధాన్యతలు',
    changePassword: 'పాస్‌వర్డ్ మార్చండి',
    newPassword: 'కొత్త పాస్‌వర్డ్',
    updatePassword: 'పాస్‌వర్డ్ అప్‌డేట్ చేయండి',
    languagePreference: 'ప్రాధాన్యత గల భాష',
    customerSupport: '24x7 కస్టమర్ కేర్ సేవలు',
    branchLocator: 'శాఖ & ఏటీఎం వివరాలు',
    tollFreeHelpline: 'ఉచిత హెల్ప్‌లైన్: 1800-425-2026',
    simulatedNotice: 'బ్యాంక్ TM ఒక డిజిటల్ బ్యాంకింగ్ అనుకరణ వేదిక.',
  },

  ml: {
    bankName: 'ബാങ്ക് TM',
    tagline: 'ബാങ്ക് TM – ഏവർക്കും ലളിതമായ ബാങ്കിംഗ്.',
    welcomeDesc: 'നിങ്ങളുടെ അക്കൗണ്ടുകൾ കൈകാര്യം ചെയ്യുക, പണം അയക്കുക, സാമ്പത്തിക സേവനങ്ങളും സർക്കാർ സഹായ പദ്ധതികളും ഒരിടത്ത് അറിയുക.',
    customerLogin: 'ഉപഭോക്തൃ ലോഗിൻ',
    adminLogin: 'ബാങ്ക് അഡ്മിൻ ലോഗിൻ',
    registerNewCustomer: 'പുതിയ ഉപഭോക്തൃ രജിസ്ട്രേഷൻ',
    loginTitle: 'കസ്റ്റമർ പോർട്ടൽ ലോഗിൻ',
    registerTitle: 'പുതിയ ബാങ്ക് TM അക്കൗണ്ട് ആരംഭിക്കുക',
    username: 'യൂസർനെയിം',
    password: 'പാസ്‌വേഡ്',
    confirmPassword: 'പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക',
    fullName: 'പൂർണ്ണ പേര്',
    email: 'ഇമെയിൽ വിലാസം',
    mobile: 'മൊബൈൽ നമ്പർ',
    address: 'താമസസ്ഥല വിലാസം',
    loginButton: 'ലോഗിൻ ചെയ്യുക',
    registerButton: 'രജിസ്ട്രേഷൻ പൂർത്തിയാക്കുക',
    logout: 'സുരക്ഷിതമായി പുറത്തുകടക്കുക',
    forgotPassword: 'പാസ്‌വേഡ് മറന്നുപോയോ?',
    alreadyHaveAccount: 'അക്കൗണ്ട് ഉണ്ടോ? ലോഗിൻ ചെയ്യുക',
    noAccountYet: 'അക്കൗണ്ട് ഇല്ലേ? ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യുക',
    adminPortalTitle: 'ബാങ്ക് അഡ്മിനിസ്ട്രേഷൻ പോർട്ടൽ',
    demoCredentialsNote: 'അഡ്മിൻ ലോഗിൻ: admin / BankTM@2026',

    navOverview: 'അവലോകനം',
    navDashboard: 'ഡാഷ്‌ബോർഡ്',
    navMyBanking: 'എന്റെ ബാങ്കിംഗ്',
    navMyProfile: 'എന്റെ പ്രൊഫൈൽ',
    navOpenNewAccount: 'പുതിയ അക്കൗണ്ട് തുറക്കുക',
    navMyAccounts: 'എന്റെ അക്കൗണ്ടുകൾ',
    navDeposit: 'പണം നിക്ഷേപിക്കുക',
    navWithdraw: 'പണം പിൻവലിക്കുക',
    navTransfer: 'പണം കൈമാറുക',
    navBalanceEnquiry: 'നീക്കിയിരുപ്പ് അറിയുക',
    navTransactionHistory: 'ഇടപാട് ചരിത്രം',
    navCardServices: 'കാർഡ് സേവനങ്ങൾ',
    navApplyDebitCard: 'ഡെബിറ്റ് കാർഡിന് അപേക്ഷിക്കുക',
    navApplyCreditCard: 'ക്രെഡിറ്റ് കാർഡിന് അപേക്ഷിക്കുക',
    navMyCards: 'എന്റെ കാർഡുകൾ',
    navFinancialAssistance: 'സാമ്പത്തിക സഹായം',
    navGovernmentSchemes: 'സർക്കാർ പദ്ധതികൾ',
    navSmartLoanFinder: 'സ്മാർട്ട് ലോൺ ഫൈൻഡർ',
    navOthers: 'മറ്റു സേവനങ്ങൾ',
    navSettings: 'ക്രമീകരണങ്ങൾ',
    navHelpSupport: 'സഹായവും പിന്തുണയും',

    welcomeCustomer: 'സ്വാഗതം',
    customerId: 'കസ്റ്റമർ ഐഡി',
    totalAccounts: 'ആകെ അക്കൗണ്ടുകൾ',
    availableBalance: 'ലഭ്യമായ ബാലൻസ്',
    totalDeposits: 'ആകെ നിക്ഷേപം',
    totalWithdrawals: 'ആകെ പിൻവലിക്കൽ',
    quickActions: 'വേഗത്തിലുള്ള സേവനങ്ങൾ',
    recentTransactions: 'സമീപകാല ഇടപാടുകൾ',
    accountOverview: 'അക്കൗണ്ട് വിവരങ്ങൾ',
    cardStatus: 'കാർഡ് നില',
    viewAll: 'എല്ലാം കാണുക',
    noRecentTransactions: 'സമീപകാല ഇടപാടുകളൊന്നും ലഭ്യമല്ല.',

    savingsAccount: 'സേവിംഗ്സ് അക്കൗണ്ട്',
    currentAccount: 'കറന്റ് അക്കൗണ്ട്',
    accountNumber: 'അക്കൗണ്ട് നമ്പർ',
    accountType: 'അക്കൗണ്ട് തരം',
    ifscCode: 'IFSC കോഡ്',
    branch: 'ബ്രാഞ്ച്',
    minBalanceNote: 'കുറഞ്ഞ ബാലൻസ് നിബന്ധന: ₹1,000',
    overdraftNote: 'ഓവർഡ്രാഫ്റ്റ് സൗകര്യം ലഭ്യമാണ്',
    statusActive: 'സജീവം',
    statusPending: 'അംഗീകാരം കാത്തിരിക്കുന്നു',
    statusDormant: 'നിഷ്ക്രിയം',

    amount: 'തുക (₹)',
    selectAccount: 'അക്കൗണ്ട് തിരഞ്ഞെടുക്കുക',
    depositHeading: 'അക്കൗണ്ടിലേക്ക് പണം നിക്ഷേപിക്കുക',
    withdrawHeading: 'അക്കൗണ്ടിൽ നിന്ന് പണം പിൻവലിക്കുക',
    transferHeading: 'നേരിട്ടുള്ള ബാങ്ക് കൈമാറ്റം',
    beneficiaryAccount: 'സ്വീകർത്താവിന്റെ അക്കൗണ്ട് നമ്പർ',
    beneficiaryName: 'സ്വീകർത്താവിന്റെ പേര്',
    description: 'ഇടപാട് വിവരണം',
    confirmTransaction: 'ഇടപാട് സ്ഥിരീകരിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    submit: 'അപേക്ഷ സമർപ്പിക്കുക',
    transactionSuccess: 'ഇടപാട് വിജയകരമായി പൂർത്തിയായി',
    transactionId: 'ഇടപാട് ഐഡി',
    downloadReceipt: 'രസീത് ഡൗൺലോഡ് ചെയ്യുക',
    printReceipt: 'രസീത് പ്രിന്റ് ചെയ്യുക',
    date: 'തീയതിയും സമയവും',
    type: 'തരം',
    status: 'നില',
    filterBy: 'ഫിൽട്ടർ ചെയ്യുക',
    allTypes: 'എല്ലാ ഇടപാടുകളും',

    cardNetwork: 'കാർഡ് നെറ്റ്‌വർക്ക് മുൻഗണന',
    deliveryAddress: 'ഡെലിവറി വിലാസം',
    applyDebitHeading: 'ഡെബിറ്റ് കാർഡിനായി അപേക്ഷിക്കുക',
    applyCreditHeading: 'ക്രെഡിറ്റ് കാർഡിനായി അപേക്ഷിക്കുക',
    employmentCategory: 'തൊഴിൽ വിഭാഗം',
    monthlyIncome: 'പ്രതിമാസ വരുമാനം (₹)',
    requestedLimit: 'ആവശ്യപ്പെട്ട പരിധി (₹)',
    employerName: 'സ്ഥാപനത്തിന്റെ പേര്',
    simulatedEligibilityScore: 'യോഗ്യതാ സ്കോർ',
    trackApplications: 'അപേക്ഷാ പുരോഗതി',
    debitCards: 'ഡെബിറ്റ് കാർഡുകൾ',
    creditCards: 'ക്രെഡിറ്റ് കാർഡുകൾ',
    applicationReference: 'അപേക്ഷാ റഫറൻസ് നമ്പർ',
    submittedOn: 'സമർപ്പിച്ച തീയതി',
    remarks: 'അഡ്മിൻ കുറിപ്പ്',

    statusSubmitted: 'സമർപ്പിച്ചു',
    statusUnderReview: 'പരിശോധനയിൽ',
    statusAdditionalInfo: 'കൂടുതൽ വിവരങ്ങൾ ആവശ്യമുണ്ട്',
    statusApproved: 'അംഗീകരിച്ചു',
    statusRejected: 'നിരസിച്ചു',
    statusDispatched: 'അയച്ചു',
    statusDelivered: 'ലഭിച്ചു',

    schemesHeading: 'സർക്കാർ പദ്ധതികളും സാമ്പത്തിക സഹായവും',
    schemesSubheading: 'ഇന്ത്യൻ സർക്കാരിന്റെ കർഷക, വിദ്യാഭ്യാസ സ്കോളർഷിപ്പ്, ബിസിനസ് വായ്പ പദ്ധതികൾ.',
    catAll: 'എല്ലാ പദ്ധതികളും',
    catAgriculture: 'കാർഷിക & കർഷക പദ്ധതികൾ',
    catEducation: 'വിദ്യാഭ്യാസം & സ്കോളർഷിപ്പ്',
    catBusiness: 'ബിസിനസ് & ചെറുകിട സംരംഭങ്ങൾ',
    catWomen: 'വനിതാ ശാക്തീകരണം',
    catKarnataka: 'കർണാടക സർക്കാർ പദ്ധതികൾ',
    targetBeneficiaries: 'ഗുണഭോക്താക്കൾ',
    eligibility: 'യോഗ്യതാ മാനദണ്ഡങ്ങൾ',
    benefits: 'സാമ്പത്തിക ആനുകൂല്യങ്ങൾ',
    documentsRequired: 'ആവശ്യമായ രേഖകൾ',
    applyOnOfficialPortal: 'ഔദ്യോഗിക പോർട്ടലിൽ അപേക്ഷിക്കുക',
    lastVerified: 'പരിശോധിച്ച തീയതി',
    disclaimerGovernment: 'ശ്രദ്ധിക്കുക: ഔദ്യോഗിക സർക്കാർ പോർട്ടലുകളിലേക്കുള്ള നേരിട്ടുള്ള വിവരങ്ങളും ലിങ്കുകളും ബാങ്ക് TM നൽകുന്നു.',

    loanFinderTitle: 'സ്മാർട്ട് ലോൺ ഫൈൻഡർ',
    loanFinderSubtitle: 'നിങ്ങൾക്കനുയോജ്യമായ സർക്കാർ സബ്‌സിഡികളും സ്കോളർഷിപ്പുകളും എളുപ്പത്തിൽ കണ്ടെത്തുക.',
    whoAreYou: 'നിങ്ങളുടെ വിഭാഗം തിരഞ്ഞെടുക്കുക',
    farmer: 'കർഷകൻ / കൃഷിക്കാരൻ',
    student: 'വിദ്യാർത്ഥി / ഗവേഷകൻ',
    womanEntrepreneur: 'വനിതാ സംരംഭക',
    smallBusiness: 'ചെറുകിട വ്യാപാരി / MSME',
    selfEmployed: 'സ്വയംതൊഴിൽ ചെയ്യുന്നയാൾ',
    generalCitizen: 'സാധാരണ പൗരൻ',
    loanPurpose: 'നിങ്ങളുടെ പ്രധാന സാമ്പത്തിക ആവശ്യം എന്താണ്?',
    purposeFarming: 'കാർഷിക ഉപകരണങ്ങളും വിള സഹായവും',
    purposeEducation: 'ഉന്നതവിദ്യാഭ്യാസവും സ്കോളർഷിപ്പും',
    purposeBusiness: 'ബിസിനസ് വികസനവും പ്രവർത്തന മൂലധനവും',
    purposeHousing: 'വീട് നിർമ്മാണവും അറ്റകുറ്റപ്പണികളും',
    purposePersonal: 'പൊതുവായ സാമ്പത്തിക സഹായം',
    findMatchingSchemes: 'പദ്ധതികൾ കണ്ടെത്തുക',
    matchingSchemesFound: 'നിങ്ങൾക്കായി ലഭ്യമായ സർക്കാർ പദ്ധതികൾ',
    noSchemesMatched: 'പൊരുത്തമുള്ള പദ്ധതികൾ കണ്ടെത്തിയില്ല. മുഴുവൻ പദ്ധതികളും കാണുക.',

    settingsTitle: 'സുരക്ഷയും മുൻഗണനകളും',
    changePassword: 'പാസ്‌വേഡ് മാറ്റുക',
    newPassword: 'പുതിയ പാസ്‌വേഡ്',
    updatePassword: 'പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്യുക',
    languagePreference: 'തിരഞ്ഞെടുത്ത ഭാഷ',
    customerSupport: '24x7 കസ്റ്റമർ കെയർ സേവനങ്ങൾ',
    branchLocator: 'ബ്രാഞ്ചും എടിഎമ്മും കണ്ടെത്തുക',
    tollFreeHelpline: 'ടോൾ ഫ്രീ നമ്പർ: 1800-425-2026',
    simulatedNotice: 'ബാങ്ക് TM ഒരു ഡിജിറ്റൽ ബാങ്കിംഗ് മാതൃകാ സംവിധാനമാണ്.',
  },
};
