import React, { useState } from 'react';
import { 
  Users, 
  Wallet, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Activity, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  FileText,
  Eye,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AccountApplication, CardApplication } from '../../types';
import { AccountApplicationModal } from '../common/AccountApplicationModal';
import { CardApplicationModal } from '../common/CardApplicationModal';

export const AdminDashboard: React.FC = () => {
  const { 
    customers, 
    accounts, 
    transactions, 
    accountApplications, 
    cardApplications, 
    setActiveAdminTab,
    approveAccountApplication,
    rejectAccountApplication,
    updateCardApplicationStatus 
  } = useBanking();

  const [appTypeTab, setAppTypeTab] = useState<'all' | 'accounts' | 'cards'>('all');
  const [selectedAccountApp, setSelectedAccountApp] = useState<AccountApplication | null>(null);
  const [selectedCardApp, setSelectedCardApp] = useState<CardApplication | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Metrics
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const savingsAccounts = accounts.filter(a => a.accountType === 'savings').length;
  const currentAccounts = accounts.filter(a => a.accountType === 'current').length;
  const totalDeposits = transactions
    .filter(tx => tx.type === 'deposit' || tx.type === 'transfer_in')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalWithdrawals = transactions
    .filter(tx => tx.type === 'withdrawal' || tx.type === 'transfer_out')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const pendingAccounts = accountApplications.filter(a => a.status === 'pending');
  const pendingDebitCards = cardApplications.filter(c => c.cardType === 'debit' && (c.status === 'pending' || c.status === 'submitted' || c.status === 'under_review'));
  const pendingCreditCards = cardApplications.filter(c => c.cardType === 'credit' && (c.status === 'pending' || c.status === 'submitted' || c.status === 'under_review'));
  const totalPendingApps = pendingAccounts.length + pendingDebitCards.length + pendingCreditCards.length;

  const handleApproveAccount = (id: string, rem: string) => {
    approveAccountApplication(id, rem);
    setActionFeedback(`Account application ${id} approved and provisioned!`);
    setSelectedAccountApp(null);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleRejectAccount = (id: string, rem: string) => {
    rejectAccountApplication(id, rem);
    setActionFeedback(`Account application ${id} rejected.`);
    setSelectedAccountApp(null);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleApproveCard = (id: string, rem: string) => {
    updateCardApplicationStatus(id, 'approved', rem);
    setActionFeedback(`Card application ${id} approved!`);
    setSelectedCardApp(null);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleRejectCard = (id: string, rem: string) => {
    updateCardApplicationStatus(id, 'rejected', rem);
    setActionFeedback(`Card application ${id} rejected.`);
    setSelectedCardApp(null);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="bg-[#0E1E34] text-white rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-red-400 uppercase tracking-widest font-semibold">
            BankTM Core Banking System · Executive Console
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Institutional Operations & Compliance Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time inspection of customer application forms (AOF-01 & AOF-CRD), accounts, and settlement transactions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-medium">
            System Status: 100% Operational
          </span>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Primary KPI Row 1: Accounts & Volumes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Registered Customers</div>
          <div className="mt-2 text-2xl font-bold text-[#142B4A] font-mono tabular-nums">
            {customers.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {activeCustomers} Active Accounts
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Bank Accounts</div>
          <div className="mt-2 text-2xl font-bold text-[#142B4A] font-mono tabular-nums">
            {accounts.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            {savingsAccounts} Savings · {currentAccounts} Current
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Deposits (Lifetime)</div>
          <div className="mt-2 text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            ₹{totalDeposits.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Credits & cash deposits
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Withdrawals</div>
          <div className="mt-2 text-2xl font-bold text-slate-800 font-mono tabular-nums">
            ₹{totalWithdrawals.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Debits & counter outlays
          </div>
        </div>
      </div>

      {/* Pending Approval Badges Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveAdminTab('account_apps')}
          className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 cursor-pointer hover:bg-amber-50 transition-colors flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-amber-900 block">Pending Account Applications</span>
            <span className="text-[11px] text-amber-700">Form AOF-01 · KYC verification</span>
          </div>
          <span className="text-2xl font-bold font-mono text-amber-900">
            {pendingAccounts.length}
          </span>
        </div>

        <div 
          onClick={() => setActiveAdminTab('card_management')}
          className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-blue-900 block">Pending Debit Cards</span>
            <span className="text-[11px] text-blue-700">Form AOF-CRD · Chip personalization</span>
          </div>
          <span className="text-2xl font-bold font-mono text-blue-900">
            {pendingDebitCards.length}
          </span>
        </div>

        <div 
          onClick={() => setActiveAdminTab('card_management')}
          className="bg-purple-50/80 border border-purple-200/80 rounded-xl p-4 cursor-pointer hover:bg-purple-50 transition-colors flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-purple-900 block">Pending Credit Cards</span>
            <span className="text-[11px] text-purple-700">Underwriting & limit evaluation</span>
          </div>
          <span className="text-2xl font-bold font-mono text-purple-900">
            {pendingCreditCards.length}
          </span>
        </div>
      </div>

      {/* ALL CUSTOMER APPLICATIONS SECTION (REQUIREMENT 4) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#142B4A] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2563EB]" />
              <span>Customer Submitted Applications Portal (AOF & Card Forms)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect complete physical application details, KYC documents, and applicant reasons (including 18-year first-time cardholders)
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setAppTypeTab('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                appTypeTab === 'all' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              All Applications ({accountApplications.length + cardApplications.length})
            </button>
            <button
              type="button"
              onClick={() => setAppTypeTab('accounts')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                appTypeTab === 'accounts' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Account AOF ({accountApplications.length})
            </button>
            <button
              type="button"
              onClick={() => setAppTypeTab('cards')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                appTypeTab === 'cards' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Card Requisitions ({cardApplications.length})
            </button>
          </div>
        </div>

        {/* Combined Applications List */}
        <div className="space-y-3">
          {/* Account Applications */}
          {(appTypeTab === 'all' || appTypeTab === 'accounts') &&
            accountApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-slate-50 hover:bg-blue-50/30 rounded-xl border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#142B4A]">
                        {app.applicantPrefix || 'Mr./Ms.'} {app.customerName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 uppercase">
                        Form AOF-01 · {app.accountType.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Ref: <span className="font-mono">{app.id}</span> · Initial Deposit: <strong className="font-mono text-slate-700">₹{app.initialDeposit.toLocaleString('en-IN')}</strong> · Branch: {app.branch}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedAccountApp(app)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1E3A8A] rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-300" />
                    <span>View Full AOF Form</span>
                  </button>
                </div>
              </div>
            ))}

          {/* Card Applications */}
          {(appTypeTab === 'all' || appTypeTab === 'cards') &&
            cardApplications.map((c) => {
              const is18 = c.reasonForApplying?.includes('18 years of age');
              return (
                <div
                  key={c.id}
                  className="p-4 bg-slate-50 hover:bg-purple-50/30 rounded-xl border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#142B4A]">{c.customerName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 uppercase">
                          Form AOF-CRD · {c.cardNetwork} {c.cardType.toUpperCase()}
                        </span>
                        {is18 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            18 Yrs First-Time
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          c.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : c.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Ref: <span className="font-mono">{c.id}</span> · Reason: <span className="text-slate-700 font-medium">"{c.reasonForApplying}"</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedCardApp(c)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1E3A8A] rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-300" />
                      <span>View Full Card Form</span>
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Two Column Section: Recent System Banking Transactions & Active Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Pending Account Approvals Quick Queue */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#142B4A]">
                Pending Account Opening Requests
              </h3>
              <p className="text-xs text-slate-500">Requires administrator review before generating account</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveAdminTab('account_apps')}
              className="text-xs font-medium text-[#2563EB] hover:underline cursor-pointer"
            >
              View Queue
            </button>
          </div>

          {pendingAccounts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No pending account applications in the review queue.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAccounts.slice(0, 3).map((app) => (
                <div key={app.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{app.customerName}</span>
                      <span className="text-slate-400 text-[11px] block">Ref: {app.id} · {app.customerEmail}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-sm uppercase">
                      {app.accountType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Initial Deposit: <strong>₹{app.initialDeposit.toLocaleString('en-IN')}</strong></span>
                    <span>{app.branch.split(',')[0]}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAccountApp(app)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-sm cursor-pointer"
                    >
                      Inspect Form
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectAccount(app.id, 'Insufficient KYC documentation.')}
                      className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-sm transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveAccount(app.id, 'Verified and approved by Branch Administrator.')}
                      className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-sm transition-colors shadow-xs cursor-pointer"
                    >
                      Approve & Issue Account
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Institutional Transaction Monitor */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#142B4A]">
                Institutional Transaction Monitor
              </h3>
              <p className="text-xs text-slate-500">Recent real-time core settlement entries</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveAdminTab('transactions')}
              className="text-xs font-medium text-[#2563EB] hover:underline cursor-pointer"
            >
              Monitor All
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-slate-700">{tx.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({tx.accountNumber})</span>
                  </div>
                  <div className="text-slate-600 truncate max-w-[220px] text-[11px]">
                    {tx.description}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-slate-900 tabular-nums">
                    ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase ${
                    tx.type === 'deposit' || tx.type === 'transfer_in' ? 'text-emerald-600' : 'text-slate-600'
                  }`}>
                    {tx.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account AOF Modal */}
      <AccountApplicationModal
        application={selectedAccountApp}
        onClose={() => setSelectedAccountApp(null)}
        isAdmin={true}
        onApprove={handleApproveAccount}
        onReject={handleRejectAccount}
      />

      {/* Card AOF-CRD Modal */}
      <CardApplicationModal
        application={selectedCardApp}
        onClose={() => setSelectedCardApp(null)}
        isAdmin={true}
        onApprove={handleApproveCard}
        onReject={handleRejectCard}
      />
    </div>
  );
};
