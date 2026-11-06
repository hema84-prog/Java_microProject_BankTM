import React from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { CustomerLogin } from './components/auth/CustomerLogin';
import { CustomerRegister } from './components/auth/CustomerRegister';
import { AdminLogin } from './components/auth/AdminLogin';
import { Header } from './components/common/Header';
import { ReceiptModal } from './components/common/ReceiptModal';

// Customer Components
import { CustomerSidebar } from './components/customer/CustomerSidebar';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { AccountManagement } from './components/customer/AccountManagement';
import { TransactionsView } from './components/customer/TransactionsView';
import { TransactionHistory } from './components/customer/TransactionHistory';
import { CardServices } from './components/customer/CardServices';
import { GovernmentSchemes } from './components/customer/GovernmentSchemes';
import { SmartLoanFinder } from './components/customer/SmartLoanFinder';
import { CustomerSettings } from './components/customer/CustomerSettings';

// Admin Components
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { AccountApproval } from './components/admin/AccountApproval';
import { CardManagement } from './components/admin/CardManagement';
import { TransactionMonitoring } from './components/admin/TransactionMonitoring';
import { SchemeManagement } from './components/admin/SchemeManagement';
import { ReportsAnalytics } from './components/admin/ReportsAnalytics';
import { AuditLogs } from './components/admin/AuditLogs';

const BankingApp: React.FC = () => {
  const { 
    currentRole, 
    authView, 
    activeCustomerTab, 
    activeAdminTab,
    t 
  } = useBanking();

  // 1. Role Selection / Authentication Gateway
  if (currentRole === 'welcome') {
    if (authView === 'customer_login') return <CustomerLogin />;
    if (authView === 'customer_register') return <CustomerRegister />;
    if (authView === 'admin_login') return <AdminLogin />;
    return <WelcomeScreen />;
  }

  // 2. Customer Portal Experience
  if (currentRole === 'customer') {
    const getCustomerTitle = () => {
      switch (activeCustomerTab) {
        case 'dashboard': return t.navDashboard;
        case 'profile': return t.navMyProfile;
        case 'open_account': return t.navOpenNewAccount;
        case 'my_accounts': return t.navMyAccounts;
        case 'deposit': return t.navDeposit;
        case 'withdraw': return t.navWithdraw;
        case 'transfer': return t.navTransfer;
        case 'balance': return t.navBalanceEnquiry;
        case 'history': return t.navTransactionHistory;
        case 'apply_debit': return t.navApplyDebitCard;
        case 'apply_credit': return t.navApplyCreditCard;
        case 'my_cards': return t.navMyCards;
        case 'schemes': return t.navGovernmentSchemes;
        case 'loan_finder': return t.navSmartLoanFinder;
        case 'settings': return t.navSettings;
        case 'help': return t.navHelpSupport;
        default: return t.navDashboard;
      }
    };

    return (
      <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
        {/* Customer Sidebar */}
        <CustomerSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header pageTitle={getCustomerTitle()} />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {activeCustomerTab === 'dashboard' && <CustomerDashboard />}
              {activeCustomerTab === 'my_accounts' && <AccountManagement initialMode="list" />}
              {activeCustomerTab === 'open_account' && <AccountManagement initialMode="open" />}
              {activeCustomerTab === 'deposit' && <TransactionsView defaultMode="deposit" />}
              {activeCustomerTab === 'withdraw' && <TransactionsView defaultMode="withdraw" />}
              {activeCustomerTab === 'transfer' && <TransactionsView defaultMode="transfer" />}
              {activeCustomerTab === 'balance' && <TransactionsView defaultMode="balance" />}
              {activeCustomerTab === 'history' && <TransactionHistory />}
              {activeCustomerTab === 'apply_debit' && <CardServices initialTab="apply_debit" />}
              {activeCustomerTab === 'apply_credit' && <CardServices initialTab="apply_credit" />}
              {activeCustomerTab === 'my_cards' && <CardServices initialTab="my_cards" />}
              {activeCustomerTab === 'schemes' && <GovernmentSchemes />}
              {activeCustomerTab === 'loan_finder' && <SmartLoanFinder />}
              {(activeCustomerTab === 'profile' || activeCustomerTab === 'settings' || activeCustomerTab === 'help') && <CustomerSettings />}
            </div>
          </main>
        </div>

        {/* Global Transaction Advice Receipt */}
        <ReceiptModal />
      </div>
    );
  }

  // 3. Bank Administrator Portal Experience
  if (currentRole === 'admin') {
    const getAdminTitle = () => {
      switch (activeAdminTab) {
        case 'dashboard': return 'Executive Console';
        case 'customers': return 'Customer Management';
        case 'account_apps': return 'Account Approval Queue';
        case 'account_management': return 'Institutional Master Accounts';
        case 'transactions': return 'Transaction Settlement Ledger';
        case 'card_management': return 'Debit & Credit Card Operations';
        case 'schemes': return 'Government Scheme Registry';
        case 'reports': return 'Financial Analytics & Reports';
        case 'audit_logs': return 'Security Audit Log';
        case 'settings': return 'Admin Settings';
        default: return 'Administrator Console';
      }
    };

    return (
      <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
        {/* Administrator Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header pageTitle={getAdminTitle()} />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {activeAdminTab === 'dashboard' && <AdminDashboard />}
              {activeAdminTab === 'customers' && <CustomerManagement />}
              {(activeAdminTab === 'account_apps' || activeAdminTab === 'account_management') && <AccountApproval />}
              {activeAdminTab === 'transactions' && <TransactionMonitoring />}
              {activeAdminTab === 'card_management' && <CardManagement />}
              {activeAdminTab === 'schemes' && <SchemeManagement />}
              {activeAdminTab === 'reports' && <ReportsAnalytics />}
              {activeAdminTab === 'audit_logs' && <AuditLogs />}
              {activeAdminTab === 'settings' && <CustomerSettings />}
            </div>
          </main>
        </div>

        {/* Global Transaction Advice Receipt */}
        <ReceiptModal />
      </div>
    );
  }

  return <WelcomeScreen />;
};

export default function App() {
  return (
    <BankingProvider>
      <BankingApp />
    </BankingProvider>
  );
}
