import React from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

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
  const pendingDebitCards = cardApplications.filter(c => c.cardType === 'debit' && (c.status === 'submitted' || c.status === 'under_review'));
  const pendingCreditCards = cardApplications.filter(c => c.cardType === 'credit' && (c.status === 'submitted' || c.status === 'under_review'));

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
            Real-time monitoring of all customer accounts, clearing transactions, card issuance, and welfare schemes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-medium">
            System Status: 100% Operational
          </span>
        </div>
      </div>

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
            <span className="text-[11px] text-amber-700">Requires administrator KYC verification</span>
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
            <span className="text-[11px] text-blue-700">Awaiting personalization & dispatch</span>
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
            <span className="text-[11px] text-purple-700">Underwriting & income verification</span>
          </div>
          <span className="text-2xl font-bold font-mono text-purple-900">
            {pendingCreditCards.length}
          </span>
        </div>
      </div>

      {/* Two Column Section: Pending Queues & Recent System Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Pending Account Approvals Queue */}
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
              className="text-xs font-medium text-[#2563EB] hover:underline"
            >
              View All
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
                      onClick={() => rejectAccountApplication(app.id, 'Insufficient KYC documentation.')}
                      className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-sm transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => approveAccountApplication(app.id, 'Verified and approved by Branch Administrator.')}
                      className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-sm transition-colors shadow-xs"
                    >
                      Approve & Issue Account
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Recent System Banking Transactions */}
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
              className="text-xs font-medium text-[#2563EB] hover:underline"
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
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase">
                    {tx.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
