export type Language = 'en' | 'kn' | 'hi' | 'ta' | 'te' | 'ml';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export type Role = 'customer' | 'admin';

export type AccountType = 'savings' | 'current';

export interface BankAccount {
  accountNumber: string;
  customerId: string;
  accountType: AccountType;
  balance: number;
  status: 'active' | 'pending' | 'dormant' | 'frozen';
  createdAt: string;
  branch: string;
  ifscCode: string;
  overdraftLimit?: number; // for current account
  minimumBalance?: number; // 1000 for savings
}

export interface CustomerUser {
  id: string; // e.g. BTM-CUST-1042
  username: string;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  passwordHash: string;
  preferredLanguage: Language;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'superadmin' | 'branch_manager' | 'compliance_officer';
  lastLogin: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out';
export type TransactionStatus = 'success' | 'pending' | 'failed';

export interface BankingTransaction {
  id: string; // e.g. TXN-20261105-9921
  customerId: string;
  accountNumber: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  date: string;
  description: string;
  recipientAccount?: string;
  recipientName?: string;
  status: TransactionStatus;
  referenceNumber: string;
}

export type CardType = 'debit' | 'credit';
export type CardNetwork = 'RuPay' | 'Visa' | 'Mastercard';
export type CardApplicationStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'additional_info_required'
  | 'approved' 
  | 'rejected' 
  | 'dispatched' 
  | 'delivered';

export interface CardApplication {
  id: string; // e.g. CRD-APP-4019
  customerId: string;
  customerName: string;
  accountNumber: string;
  cardType: CardType;
  cardNetwork: CardNetwork;
  status: CardApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  deliveryAddress: string;
  remarks?: string;
  // Credit specific:
  employmentCategory?: 'salaried' | 'self_employed' | 'business' | 'student' | 'agricultural';
  monthlyIncome?: number;
  employerName?: string;
  requestedLimit?: number;
  simulatedScore?: number;
  // Issued card simulated details (no sensitive CVV/PIN stored)
  maskedCardNumber?: string;
  expiryDate?: string;
}

export interface AccountApplication {
  id: string; // e.g. ACC-REQ-8821
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  accountType: AccountType;
  initialDeposit: number;
  branch: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  remarks?: string;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  category: 'agriculture' | 'education' | 'business' | 'women' | 'karnataka';
  categoryLabel: string;
  description: string;
  targetBeneficiaries: string;
  eligibility: string[];
  financialBenefits: string;
  loanOrSubsidyAmount: string;
  applicationProcedure: string[];
  requiredDocuments: string[];
  officialPortalUrl: string;
  portalName: string;
  lastVerifiedDate: string;
  isVerified: boolean;
  department: string;
  isStateScheme: boolean;
  state?: string;
  interestRateText?: string;
  maxTenureYears?: number;
}

export interface AuditLog {
  id: string;
  adminUsername: string;
  action: string;
  entityType: 'customer' | 'account' | 'card' | 'scheme' | 'transaction';
  entityId: string;
  timestamp: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}
