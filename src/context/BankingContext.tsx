import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  Role, 
  CustomerUser, 
  AdminUser, 
  BankAccount, 
  BankingTransaction, 
  CardApplication, 
  AccountApplication, 
  GovernmentScheme, 
  AuditLog, 
  NotificationItem,
  CardNetwork,
  CardApplicationStatus,
  AccountType
} from '../types';
import { translations, TranslationDictionary } from '../i18n/translations';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_ACCOUNTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_CARD_APPLICATIONS, 
  INITIAL_ACCOUNT_APPLICATIONS, 
  INITIAL_SCHEMES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

export type CustomerNavTab = 
  | 'dashboard' 
  | 'profile' 
  | 'open_account' 
  | 'my_accounts' 
  | 'deposit' 
  | 'withdraw' 
  | 'transfer' 
  | 'balance' 
  | 'history' 
  | 'apply_debit' 
  | 'apply_credit' 
  | 'my_cards' 
  | 'schemes' 
  | 'loan_finder' 
  | 'settings' 
  | 'help';

export type AdminNavTab = 
  | 'dashboard' 
  | 'customers' 
  | 'account_apps' 
  | 'account_management' 
  | 'transactions' 
  | 'card_management' 
  | 'schemes' 
  | 'reports' 
  | 'audit_logs' 
  | 'settings';

interface BankingContextType {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;

  // Authentication & Sessions
  currentRole: 'welcome' | 'customer' | 'admin';
  setCurrentRole: (role: 'welcome' | 'customer' | 'admin') => void;
  authView: 'welcome' | 'customer_login' | 'customer_register' | 'admin_login';
  setAuthView: (view: 'welcome' | 'customer_login' | 'customer_register' | 'admin_login') => void;
  currentCustomer: CustomerUser | null;
  currentAdmin: AdminUser | null;
  customerLogin: (username: string, pass: string) => { success: boolean; message?: string };
  adminLogin: (username: string, pass: string) => { success: boolean; message?: string };
  registerCustomer: (data: {
    fullName: string;
    username: string;
    email: string;
    mobile: string;
    address: string;
    password: string;
  }) => { success: boolean; message?: string };
  logout: () => void;
  updateCustomerPassword: (newPass: string) => boolean;

  // Customer Navigation
  activeCustomerTab: CustomerNavTab;
  setActiveCustomerTab: (tab: CustomerNavTab) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean | ((prev: boolean) => boolean)) => void;

  // Admin Navigation
  activeAdminTab: AdminNavTab;
  setActiveAdminTab: (tab: AdminNavTab) => void;

  // Accounts Data & Methods
  accounts: BankAccount[];
  customerAccounts: BankAccount[];
  selectedAccountNumber: string;
  setSelectedAccountNumber: (accNo: string) => void;
  applyNewAccount: (type: AccountType, initialDeposit: number, branch: string, details?: Partial<AccountApplication>) => { success: boolean; message: string; applicationId?: string };
  
  // Banking Operations
  deposit: (accountNumber: string, amount: number, desc?: string, sourceName?: string, sourceAccountOrChannel?: string) => { success: boolean; transaction?: BankingTransaction; message?: string };
  withdraw: (accountNumber: string, amount: number, desc?: string, destinationName?: string, destinationChannelAcc?: string) => { success: boolean; transaction?: BankingTransaction; message?: string };
  transfer: (senderAcc: string, recipientAcc: string, recipientName: string, amount: number, desc?: string) => { success: boolean; transaction?: BankingTransaction; message?: string };
  transactions: BankingTransaction[];
  customerTransactions: BankingTransaction[];

  // Cards
  cardApplications: CardApplication[];
  customerCardApplications: CardApplication[];
  applyDebitCard: (accNo: string, network: CardNetwork, address: string, reason?: string, details?: Partial<CardApplication>) => { success: boolean; message: string; applicationId?: string };
  applyCreditCard: (
    accNo: string, 
    network: CardNetwork, 
    employmentCategory: 'salaried' | 'self_employed' | 'business' | 'student' | 'agricultural',
    monthlyIncome: number,
    employerName: string,
    requestedLimit: number,
    address: string,
    reason?: string,
    details?: Partial<CardApplication>
  ) => { success: boolean; message: string; applicationId?: string };

  // Admin Actions
  customers: CustomerUser[];
  accountApplications: AccountApplication[];
  toggleCustomerStatus: (custId: string) => void;
  approveAccountApplication: (appId: string, remarks?: string) => void;
  rejectAccountApplication: (appId: string, remarks?: string) => void;
  updateCardApplicationStatus: (appId: string, status: CardApplicationStatus, remarks?: string) => void;
  schemes: GovernmentScheme[];
  addOrUpdateScheme: (scheme: GovernmentScheme) => void;
  deleteScheme: (schemeId: string) => void;
  auditLogs: AuditLog[];

  // Notifications & Receipts
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  lastTransactionReceipt: BankingTransaction | null;
  setLastTransactionReceipt: (tx: BankingTransaction | null) => void;
  resetAllData: () => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'banktm_language',
  CUSTOMERS: 'banktm_customers',
  ACCOUNTS: 'banktm_accounts',
  TRANSACTIONS: 'banktm_transactions',
  CARDS: 'banktm_cards',
  ACCOUNT_APPS: 'banktm_account_apps',
  SCHEMES: 'banktm_schemes',
  AUDIT: 'banktm_audit',
  CURRENT_CUST: 'banktm_current_customer',
  CURRENT_ROLE: 'banktm_role',
};

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Localization
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved as Language) || 'en';
  });

  // Role and Auth view
  const [currentRole, setCurrentRole] = useState<'welcome' | 'customer' | 'admin'>('welcome');
  const [authView, setAuthView] = useState<'welcome' | 'customer_login' | 'customer_register' | 'admin_login'>('welcome');
  
  // Navigation Tabs
  const [activeCustomerTab, setActiveCustomerTab] = useState<CustomerNavTab>('dashboard');
  const [activeAdminTab, setActiveAdminTab] = useState<AdminNavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Entities stored in state and localStorage
  const [customers, setCustomers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<BankingTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [cardApplications, setCardApplications] = useState<CardApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CARDS);
    return saved ? JSON.parse(saved) : INITIAL_CARD_APPLICATIONS;
  });

  const [accountApplications, setAccountApplications] = useState<AccountApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNT_APPS);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNT_APPLICATIONS;
  });

  const [schemes, setSchemes] = useState<GovernmentScheme[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEMES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((s: any) => s.id === 'SCH-BIZ-003')) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_SCHEMES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Active Sessions
  const [currentCustomer, setCurrentCustomer] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_CUST);
    return saved ? JSON.parse(saved) : null;
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState<string>('');
  const [lastTransactionReceipt, setLastTransactionReceipt] = useState<BankingTransaction | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cardApplications));
  }, [cardApplications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNT_APPS, JSON.stringify(accountApplications));
  }, [accountApplications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(schemes));
  }, [schemes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (currentCustomer) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CUST, JSON.stringify(currentCustomer));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CUST);
    }
  }, [currentCustomer]);

  // Set default selected account when customer logs in or accounts change
  useEffect(() => {
    if (currentCustomer) {
      const custAccs = accounts.filter(a => a.customerId === currentCustomer.id && a.status === 'active');
      if (custAccs.length > 0 && (!selectedAccountNumber || !custAccs.some(a => a.accountNumber === selectedAccountNumber))) {
        setSelectedAccountNumber(custAccs[0].accountNumber);
      }
    }
  }, [currentCustomer, accounts, selectedAccountNumber]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (currentCustomer) {
      setCustomers(prev => prev.map(c => c.id === currentCustomer.id ? { ...c, preferredLanguage: lang } : c));
      setCurrentCustomer(prev => prev ? { ...prev, preferredLanguage: lang } : null);
    }
  };

  const logAudit = (action: string, entityType: AuditLog['entityType'], entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      adminUsername: currentAdmin?.username || 'system',
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth Functions
  const customerLogin = (username: string, pass: string) => {
    const user = customers.find(c => c.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'Invalid username or credentials.' };
    }
    if (user.status !== 'active') {
      return { success: false, message: 'Your account is suspended. Please contact bank administration.' };
    }
    if (user.passwordHash !== pass) {
      return { success: false, message: 'Incorrect password entered.' };
    }

    setCurrentCustomer(user);
    setCurrentRole('customer');
    if (user.preferredLanguage) {
      setLanguageState(user.preferredLanguage);
    }
    setActiveCustomerTab('dashboard');
    return { success: true };
  };

  const adminLogin = (username: string, pass: string) => {
    if (username.trim().toLowerCase() === 'admin' && pass === 'BankTM@2026') {
      const admin: AdminUser = {
        id: 'ADM-001',
        username: 'admin',
        fullName: 'Suresh Narayanan (COO)',
        email: 'admin@banktm.in',
        role: 'superadmin',
        lastLogin: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      setCurrentAdmin(admin);
      setCurrentRole('admin');
      setActiveAdminTab('dashboard');
      logAudit('ADMIN_LOGIN', 'customer', 'ADM-001', 'Administrator successfully logged into BankTM Executive Console');
      return { success: true };
    }
    return { success: false, message: 'Invalid Administrator credentials. Default is admin / BankTM@2026' };
  };

  const registerCustomer = (data: {
    fullName: string;
    username: string;
    email: string;
    mobile: string;
    address: string;
    password: string;
  }) => {
    const existing = customers.find(c => c.username.toLowerCase() === data.username.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'Username is already taken. Please choose another.' };
    }

    const newId = `BTM-CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCustomer: CustomerUser = {
      id: newId,
      username: data.username.trim(),
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      mobile: data.mobile.trim(),
      address: data.address.trim(),
      passwordHash: data.password,
      preferredLanguage: language,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    // Auto provision initial Savings Account with ₹5,000 initial balance for immediate usability
    const newAccNumber = `BTM-SB-100${Math.floor(100000 + Math.random() * 900000)}`;
    const initialAccount: BankAccount = {
      accountNumber: newAccNumber,
      customerId: newId,
      accountType: 'savings',
      balance: 10000,
      status: 'active',
      createdAt: new Date().toISOString(),
      branch: 'Indiranagar Branch, Bengaluru',
      ifscCode: 'BTMN000104',
      minimumBalance: 1000,
    };

    // Initial welcome deposit transaction
    const initialTx: BankingTransaction = {
      id: `TXN-${Date.now().toString().slice(-8)}`,
      customerId: newId,
      accountNumber: newAccNumber,
      type: 'deposit',
      amount: 10000,
      balanceAfter: 10000,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      description: 'Account Opening Initial Deposit',
      status: 'success',
      referenceNumber: `REF${Date.now().toString().slice(-10)}`,
    };

    setCustomers(prev => [...prev, newCustomer]);
    setAccounts(prev => [...prev, initialAccount]);
    setTransactions(prev => [initialTx, ...prev]);

    // Auto login
    setCurrentCustomer(newCustomer);
    setCurrentRole('customer');
    setActiveCustomerTab('dashboard');

    return { success: true };
  };

  const updateCustomerPassword = (newPass: string) => {
    if (!currentCustomer) return false;
    setCustomers(prev => prev.map(c => c.id === currentCustomer.id ? { ...c, passwordHash: newPass } : c));
    setCurrentCustomer(prev => prev ? { ...prev, passwordHash: newPass } : null);
    return true;
  };

  const logout = () => {
    if (currentAdmin) {
      logAudit('ADMIN_LOGOUT', 'customer', currentAdmin.id, 'Administrator logged out');
    }
    setCurrentCustomer(null);
    setCurrentAdmin(null);
    setCurrentRole('welcome');
    setAuthView('welcome');
  };

  // Customer specific lists
  const customerAccounts = currentCustomer 
    ? accounts.filter(a => a.customerId === currentCustomer.id) 
    : [];

  const customerTransactions = currentCustomer 
    ? transactions.filter(t => t.customerId === currentCustomer.id) 
    : [];

  const customerCardApplications = currentCustomer 
    ? cardApplications.filter(c => c.customerId === currentCustomer.id) 
    : [];

  // Account Application
  const applyNewAccount = (type: AccountType, initialDeposit: number, branch: string, details?: Partial<AccountApplication>) => {
    if (!currentCustomer) return { success: false, message: 'Please log in' };
    if (type === 'savings' && initialDeposit < 1000) {
      return { success: false, message: 'Savings account requires minimum ₹1,000 initial deposit.' };
    }
    if (type === 'current' && initialDeposit < 5000) {
      return { success: false, message: 'Current account requires minimum ₹5,000 initial deposit.' };
    }

    const newApp: AccountApplication = {
      id: `ACC-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentCustomer.id,
      customerName: details?.customerName || currentCustomer.fullName,
      customerEmail: details?.customerEmail || currentCustomer.email,
      customerMobile: details?.customerMobile || currentCustomer.mobile,
      accountType: type,
      initialDeposit,
      branch: branch || 'Indiranagar Branch, Bengaluru',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      remarks: 'Application under verification by branch officer.',
      ...(details || {}),
    };

    setAccountApplications(prev => [newApp, ...prev]);
    return { success: true, message: 'Account application submitted successfully! It will be reviewed by the bank administrator.', applicationId: newApp.id };
  };

  // Banking Transactions
  const deposit = (accountNumber: string, amount: number, desc?: string, sourceName?: string, sourceAccountOrChannel?: string) => {
    if (!currentCustomer) return { success: false, message: 'Unauthorized' };
    if (amount <= 0 || isNaN(amount)) {
      return { success: false, message: 'Please enter a valid positive amount.' };
    }

    const targetAcc = accounts.find(a => a.accountNumber === accountNumber && a.customerId === currentCustomer.id);
    if (!targetAcc) {
      return { success: false, message: 'Selected account not found or access denied.' };
    }

    const newBalance = targetAcc.balance + amount;
    const txId = `TXN-${Date.now().toString().slice(-8)}`;
    const depositSource = sourceName?.trim() || 'Branch Cash Counter / CDM';
    const depositChannel = sourceAccountOrChannel?.trim() || 'CDM-COUNTER-01';

    const newTx: BankingTransaction = {
      id: txId,
      customerId: currentCustomer.id,
      accountNumber,
      type: 'deposit',
      amount,
      balanceAfter: newBalance,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      description: desc?.trim() || `Cash Deposit via ${depositSource}`,
      senderAccount: depositChannel,
      senderName: depositSource,
      recipientAccount: accountNumber,
      recipientName: currentCustomer.fullName,
      sourceOfMoney: depositSource,
      destinationOfMoney: `${targetAcc.accountType.toUpperCase()} Account (${accountNumber})`,
      channel: 'Cash Deposit',
      status: 'success',
      referenceNumber: `REF${Date.now().toString().slice(-10)}`,
    };

    setAccounts(prev => prev.map(a => a.accountNumber === accountNumber ? { ...a, balance: newBalance } : a));
    setTransactions(prev => [newTx, ...prev]);
    setLastTransactionReceipt(newTx);

    return { success: true, transaction: newTx };
  };

  const withdraw = (accountNumber: string, amount: number, desc?: string, destinationName?: string, destinationChannelAcc?: string) => {
    if (!currentCustomer) return { success: false, message: 'Unauthorized' };
    if (amount <= 0 || isNaN(amount)) {
      return { success: false, message: 'Please enter a valid positive amount.' };
    }

    const targetAcc = accounts.find(a => a.accountNumber === accountNumber && a.customerId === currentCustomer.id);
    if (!targetAcc) {
      return { success: false, message: 'Account not found.' };
    }

    // Rules
    if (targetAcc.accountType === 'savings') {
      const minBal = targetAcc.minimumBalance || 1000;
      if (targetAcc.balance - amount < minBal) {
        return { 
          success: false, 
          message: `Withdrawal declined. Minimum balance of ₹${minBal.toLocaleString()} must be maintained. Current balance: ₹${targetAcc.balance.toLocaleString()}.` 
        };
      }
    } else if (targetAcc.accountType === 'current') {
      const odLimit = targetAcc.overdraftLimit || 50000;
      if (targetAcc.balance - amount < -odLimit) {
        return { 
          success: false, 
          message: `Withdrawal declined. Amount exceeds available overdraft limit of ₹${odLimit.toLocaleString()}. Maximum withdrawable: ₹${(targetAcc.balance + odLimit).toLocaleString()}.` 
        };
      }
    }

    const newBalance = targetAcc.balance - amount;
    const txId = `TXN-${Date.now().toString().slice(-8)}`;
    const destLabel = destinationName?.trim() || 'Cash Disbursed (Self / ATM Dispenser)';
    const destChannel = destinationChannelAcc?.trim() || 'ATM-DISPENSER-01';

    const newTx: BankingTransaction = {
      id: txId,
      customerId: currentCustomer.id,
      accountNumber,
      type: 'withdrawal',
      amount,
      balanceAfter: newBalance,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      description: desc?.trim() || `Cash Withdrawal via ${destLabel}`,
      senderAccount: accountNumber,
      senderName: currentCustomer.fullName,
      recipientAccount: destChannel,
      recipientName: destLabel,
      sourceOfMoney: `${targetAcc.accountType.toUpperCase()} Account (${accountNumber})`,
      destinationOfMoney: destLabel,
      channel: 'ATM',
      status: 'success',
      referenceNumber: `REF${Date.now().toString().slice(-10)}`,
    };

    setAccounts(prev => prev.map(a => a.accountNumber === accountNumber ? { ...a, balance: newBalance } : a));
    setTransactions(prev => [newTx, ...prev]);
    setLastTransactionReceipt(newTx);

    return { success: true, transaction: newTx };
  };

  const transfer = (senderAcc: string, recipientAcc: string, recipientName: string, amount: number, desc?: string) => {
    if (!currentCustomer) return { success: false, message: 'Unauthorized' };
    if (amount <= 0 || isNaN(amount)) {
      return { success: false, message: 'Please enter a valid positive transfer amount.' };
    }
    if (senderAcc === recipientAcc.trim()) {
      return { success: false, message: 'Sender and recipient account cannot be the same.' };
    }

    const sender = accounts.find(a => a.accountNumber === senderAcc && a.customerId === currentCustomer.id);
    if (!sender) {
      return { success: false, message: 'Debit account not found.' };
    }

    // Balance validation
    if (sender.accountType === 'savings') {
      const minBal = sender.minimumBalance || 1000;
      if (sender.balance - amount < minBal) {
        return { 
          success: false, 
          message: `Transfer failed. Maintaining minimum balance of ₹${minBal.toLocaleString()} is mandatory. Available for transfer: ₹${Math.max(0, sender.balance - minBal).toLocaleString()}.` 
        };
      }
    } else {
      const odLimit = sender.overdraftLimit || 50000;
      if (sender.balance - amount < -odLimit) {
        return { 
          success: false, 
          message: `Transfer failed. Amount exceeds total credit limit. Max transferable: ₹${(sender.balance + odLimit).toLocaleString()}.` 
        };
      }
    }

    const newSenderBal = sender.balance - amount;
    const txId = `TXN-${Date.now().toString().slice(-8)}`;
    const ref = `REF${Date.now().toString().slice(-10)}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const senderTx: BankingTransaction = {
      id: txId,
      customerId: currentCustomer.id,
      accountNumber: senderAcc,
      type: 'transfer_out',
      amount,
      balanceAfter: newSenderBal,
      date: now,
      description: desc?.trim() || `Fund Transfer to ${recipientName || recipientAcc}`,
      senderAccount: senderAcc,
      senderName: currentCustomer.fullName,
      recipientAccount: recipientAcc.trim(),
      recipientName: recipientName.trim(),
      sourceOfMoney: `${sender.accountType.toUpperCase()} Account (${senderAcc})`,
      destinationOfMoney: `Beneficiary Account (${recipientAcc.trim()})`,
      channel: 'Internal Transfer',
      status: 'success',
      referenceNumber: ref,
    };

    // If recipient is another BankTM account, credit them synchronously!
    const recipientBankTMAcc = accounts.find(a => a.accountNumber === recipientAcc.trim());
    if (recipientBankTMAcc) {
      const newRecipientBal = recipientBankTMAcc.balance + amount;
      const recipientUser = customers.find(c => c.id === recipientBankTMAcc.customerId);
      const recipientTx: BankingTransaction = {
        id: `TXN-${(Date.now() + 1).toString().slice(-8)}`,
        customerId: recipientBankTMAcc.customerId,
        accountNumber: recipientBankTMAcc.accountNumber,
        type: 'transfer_in',
        amount,
        balanceAfter: newRecipientBal,
        date: now,
        description: `Fund Transfer from ${currentCustomer.fullName} (${senderAcc})`,
        senderAccount: senderAcc,
        senderName: currentCustomer.fullName,
        recipientAccount: recipientBankTMAcc.accountNumber,
        recipientName: recipientUser?.fullName || recipientName.trim(),
        sourceOfMoney: `Sender Account (${senderAcc})`,
        destinationOfMoney: `${recipientBankTMAcc.accountType.toUpperCase()} Account (${recipientBankTMAcc.accountNumber})`,
        channel: 'Internal Transfer',
        status: 'success',
        referenceNumber: ref,
      };

      setAccounts(prev => prev.map(a => {
        if (a.accountNumber === senderAcc) return { ...a, balance: newSenderBal };
        if (a.accountNumber === recipientAcc.trim()) return { ...a, balance: newRecipientBal };
        return a;
      }));
      setTransactions(prev => [senderTx, recipientTx, ...prev]);
    } else {
      // External transfer
      setAccounts(prev => prev.map(a => a.accountNumber === senderAcc ? { ...a, balance: newSenderBal } : a));
      setTransactions(prev => [senderTx, ...prev]);
    }

    setLastTransactionReceipt(senderTx);
    return { success: true, transaction: senderTx };
  };

  // Card Application logic
  const applyDebitCard = (accNo: string, network: CardNetwork, address: string, reason?: string, details?: Partial<CardApplication>) => {
    if (!currentCustomer) return { success: false, message: 'Please log in' };

    // Prevent duplicate pending applications
    const pendingExisting = cardApplications.find(
      c => c.customerId === currentCustomer.id && c.accountNumber === accNo && c.cardType === 'debit' && (c.status === 'pending' || c.status === 'submitted' || c.status === 'under_review')
    );
    if (pendingExisting) {
      return { success: false, message: 'A debit card application is already in progress for this account.' };
    }

    const newApp: CardApplication = {
      id: `CRD-APP-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentCustomer.id,
      customerName: details?.customerName || currentCustomer.fullName,
      accountNumber: accNo,
      cardType: 'debit',
      cardNetwork: network,
      reasonForApplying: reason?.trim() || 'New Account Debit Card for ATM & Everyday POS Purchases',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliveryAddress: address || currentCustomer.address,
      remarks: 'Application submitted. Pending branch verification and approval.',
      declarationAccepted: true,
      ...(details || {}),
    };

    setCardApplications(prev => [newApp, ...prev]);
    return { success: true, message: 'Debit card application submitted successfully! Status is now Pending.', applicationId: newApp.id };
  };

  const applyCreditCard = (
    accNo: string, 
    network: CardNetwork, 
    employmentCategory: 'salaried' | 'self_employed' | 'business' | 'student' | 'agricultural',
    monthlyIncome: number,
    employerName: string,
    requestedLimit: number,
    address: string,
    reason?: string,
    details?: Partial<CardApplication>
  ) => {
    if (!currentCustomer) return { success: false, message: 'Please log in' };

    const pendingExisting = cardApplications.find(
      c => c.customerId === currentCustomer.id && c.cardType === 'credit' && (c.status === 'pending' || c.status === 'submitted' || c.status === 'under_review')
    );
    if (pendingExisting) {
      return { success: false, message: 'You already have an active credit card application under review.' };
    }

    // Simulated eligibility calculation
    let baseScore = 650;
    if (monthlyIncome > 50000) baseScore += 80;
    else if (monthlyIncome > 25000) baseScore += 50;
    if (employmentCategory === 'salaried') baseScore += 45;
    if (employmentCategory === 'business') baseScore += 40;
    const finalScore = Math.min(840, baseScore + Math.floor(Math.random() * 30));

    const newApp: CardApplication = {
      id: `CRD-APP-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentCustomer.id,
      customerName: details?.customerName || currentCustomer.fullName,
      accountNumber: accNo,
      cardType: 'credit',
      cardNetwork: network,
      reasonForApplying: reason?.trim() || 'Credit Card for Travel and E-Commerce Expenses',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliveryAddress: address || currentCustomer.address,
      employmentCategory,
      monthlyIncome,
      employerName,
      requestedLimit,
      simulatedScore: finalScore,
      declarationAccepted: true,
      remarks: `Automated assessment score: ${finalScore}/900. Submitted for underwriter review.`,
      ...(details || {}),
    };

    setCardApplications(prev => [newApp, ...prev]);
    return { success: true, message: 'Credit card application submitted successfully! Status is now Pending.', applicationId: newApp.id };
  };

  // Admin Management Actions
  const toggleCustomerStatus = (custId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === custId) {
        const nextStatus = c.status === 'active' ? 'suspended' : 'active';
        logAudit('CUSTOMER_STATUS_CHANGE', 'customer', custId, `Customer status updated to ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const approveAccountApplication = (appId: string, remarks?: string) => {
    const app = accountApplications.find(a => a.id === appId);
    if (!app) return;

    const prefix = app.accountType === 'savings' ? 'BTM-SB-100' : 'BTM-CA-200';
    const newAccNumber = `${prefix}${Math.floor(100000 + Math.random() * 900000)}`;
    const newAccount: BankAccount = {
      accountNumber: newAccNumber,
      customerId: app.customerId,
      accountType: app.accountType,
      balance: app.initialDeposit,
      status: 'active',
      createdAt: new Date().toISOString(),
      branch: app.branch,
      ifscCode: 'BTMN000104',
      minimumBalance: app.accountType === 'savings' ? 1000 : undefined,
      overdraftLimit: app.accountType === 'current' ? 50000 : undefined,
    };

    const initialTx: BankingTransaction = {
      id: `TXN-${Date.now().toString().slice(-8)}`,
      customerId: app.customerId,
      accountNumber: newAccNumber,
      type: 'deposit',
      amount: app.initialDeposit,
      balanceAfter: app.initialDeposit,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      description: 'Account Opening Deposit (Approved)',
      senderAccount: 'BRANCH-OPENING-DESK',
      senderName: 'Branch Cash Opening Counter',
      recipientAccount: newAccNumber,
      recipientName: app.customerName,
      sourceOfMoney: 'Account Opening Cash / Cheque Tendered',
      destinationOfMoney: `${app.accountType.toUpperCase()} Account (${newAccNumber})`,
      channel: 'Cash Deposit',
      status: 'success',
      referenceNumber: `REF${Date.now().toString().slice(-10)}`,
    };

    setAccounts(prev => [...prev, newAccount]);
    setTransactions(prev => [initialTx, ...prev]);
    setAccountApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved', remarks: remarks || 'Approved by Administrator' } : a));
    logAudit('ACCOUNT_APPROVED', 'account', newAccNumber, `Approved ${app.accountType} account application for ${app.customerName}`);
  };

  const rejectAccountApplication = (appId: string, remarks?: string) => {
    setAccountApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'rejected', remarks: remarks || 'Application rejected by compliance.' } : a));
    logAudit('ACCOUNT_REJECTED', 'account', appId, `Rejected account request with remarks: ${remarks}`);
  };

  const updateCardApplicationStatus = (appId: string, status: CardApplicationStatus, remarks?: string) => {
    setCardApplications(prev => prev.map(c => {
      if (c.id === appId) {
        let masked = c.maskedCardNumber;
        let exp = c.expiryDate;
        if ((status === 'approved' || status === 'dispatched' || status === 'delivered') && !masked) {
          const firstDigit = c.cardNetwork === 'Visa' ? '4129' : c.cardNetwork === 'Mastercard' ? '5241' : '6074';
          masked = `${firstDigit} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`;
          exp = '11/31';
        }
        logAudit('CARD_STATUS_UPDATE', 'card', appId, `Card application ${appId} status changed to ${status}. Remarks: ${remarks || ''}`);

        // Dispatch in-app notification to the customer
        const notifTitle = status === 'approved'
          ? `Card Application Approved (${c.cardType.toUpperCase()})`
          : status === 'rejected'
          ? `Card Application Decision (${c.cardType.toUpperCase()})`
          : `Card Application Updated: ${status.toUpperCase()}`;
        const notifMsg = `Your ${c.cardNetwork} ${c.cardType} card application (${appId}) status is now ${status.toUpperCase()}.${remarks ? ` Remarks: ${remarks}` : ''}`;

        setNotifications(nPrev => [{
          id: `NOTIF-${Date.now()}`,
          title: notifTitle,
          message: notifMsg,
          date: new Date().toISOString().replace('T', ' ').slice(0, 19),
          read: false,
          type: status === 'approved' ? 'success' : status === 'rejected' ? 'alert' : 'info'
        }, ...nPrev]);

        return {
          ...c,
          status,
          updatedAt: new Date().toISOString(),
          remarks: remarks || c.remarks,
          maskedCardNumber: masked,
          expiryDate: exp,
        };
      }
      return c;
    }));
  };

  const addOrUpdateScheme = (scheme: GovernmentScheme) => {
    setSchemes(prev => {
      const idx = prev.findIndex(s => s.id === scheme.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = scheme;
        logAudit('SCHEME_UPDATED', 'scheme', scheme.id, `Government scheme updated: ${scheme.title}`);
        return updated;
      }
      logAudit('SCHEME_ADDED', 'scheme', scheme.id, `New government scheme added: ${scheme.title}`);
      return [scheme, ...prev];
    });
  };

  const deleteScheme = (schemeId: string) => {
    setSchemes(prev => prev.filter(s => s.id !== schemeId));
    logAudit('SCHEME_DELETED', 'scheme', schemeId, `Removed scheme ID ${schemeId}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const resetAllData = () => {
    localStorage.clear();
    setCustomers(INITIAL_CUSTOMERS);
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCardApplications(INITIAL_CARD_APPLICATIONS);
    setAccountApplications(INITIAL_ACCOUNT_APPLICATIONS);
    setSchemes(INITIAL_SCHEMES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentCustomer(null);
    setCurrentAdmin(null);
    setCurrentRole('welcome');
    setAuthView('welcome');
    setLanguageState('en');
  };

  const t = translations[language] || translations.en;

  return (
    <BankingContext.Provider value={{
      language,
      setLanguage,
      t,
      currentRole,
      setCurrentRole,
      authView,
      setAuthView,
      currentCustomer,
      currentAdmin,
      customerLogin,
      adminLogin,
      registerCustomer,
      logout,
      updateCustomerPassword,
      activeCustomerTab,
      setActiveCustomerTab,
      sidebarCollapsed,
      setSidebarCollapsed,
      activeAdminTab,
      setActiveAdminTab,
      accounts,
      customerAccounts,
      selectedAccountNumber,
      setSelectedAccountNumber,
      applyNewAccount,
      deposit,
      withdraw,
      transfer,
      transactions,
      customerTransactions,
      cardApplications,
      customerCardApplications,
      applyDebitCard,
      applyCreditCard,
      customers,
      accountApplications,
      toggleCustomerStatus,
      approveAccountApplication,
      rejectAccountApplication,
      updateCardApplicationStatus,
      schemes,
      addOrUpdateScheme,
      deleteScheme,
      auditLogs,
      notifications,
      markNotificationRead,
      lastTransactionReceipt,
      setLastTransactionReceipt,
      resetAllData,
    }}>
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const ctx = useContext(BankingContext);
  if (!ctx) throw new Error('useBanking must be used within a BankingProvider');
  return ctx;
};
