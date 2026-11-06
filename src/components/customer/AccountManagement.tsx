import React, { useState } from 'react';
import { 
  PlusCircle, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Building2,
  ArrowRight,
  Info
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AccountType } from '../../types';

export const AccountManagement: React.FC<{ initialMode?: 'list' | 'open' }> = ({ initialMode = 'list' }) => {
  const { 
    customerAccounts, 
    accountApplications, 
    applyNewAccount, 
    setActiveCustomerTab,
    setSelectedAccountNumber,
    t 
  } = useBanking();

  const [activeView, setActiveView] = useState<'list' | 'open'>(initialMode);
  const [accountType, setAccountType] = useState<AccountType>('savings');
  const [initialDeposit, setInitialDeposit] = useState<number>(1000);
  const [branch, setBranch] = useState<string>('Indiranagar Branch, Bengaluru');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmitOpen = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = applyNewAccount(accountType, Number(initialDeposit), branch);
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        setActiveView('list');
      }, 2500);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            {activeView === 'list' ? t.navMyAccounts : t.navOpenNewAccount}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your personal savings and commercial current accounts with BankTM
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setActiveView('list'); setMessage(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeView === 'list'
                ? 'bg-[#142B4A] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.navMyAccounts} ({customerAccounts.length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveView('open'); setMessage(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeView === 'open'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.navOpenNewAccount}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-xs flex items-start gap-3 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {activeView === 'list' ? (
        <div className="space-y-6">
          {/* Active Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {customerAccounts.map((acc) => (
              <div 
                key={acc.accountNumber} 
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      acc.accountType === 'savings' 
                        ? 'bg-blue-50 text-[#2563EB]' 
                        : 'bg-teal-50 text-teal-700'
                    }`}>
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#142B4A]">
                        {acc.accountType === 'savings' ? t.savingsAccount : t.currentAccount}
                      </h3>
                      <div className="font-mono text-xs text-slate-500 tracking-wider">
                        {acc.accountNumber}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {acc.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 space-y-2 border border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500 font-medium">Available Balance</span>
                    <span className="text-xl font-bold text-[#142B4A] font-mono tabular-nums">
                      ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div>
                      <span className="text-slate-400">Branch:</span> <span className="font-medium text-slate-700">{acc.branch.split(',')[0]}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">IFSC:</span> <span className="font-mono font-medium text-slate-700">{acc.ifscCode}</span>
                    </div>
                  </div>

                  {acc.accountType === 'savings' && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                      <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{t.minBalanceNote}</span>
                    </div>
                  )}

                  {acc.accountType === 'current' && acc.overdraftLimit && (
                    <div className="text-[11px] text-blue-700 font-medium flex items-center justify-between pt-1">
                      <span>Approved Overdraft Limit</span>
                      <span className="font-mono font-bold">₹{acc.overdraftLimit.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* Account Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAccountNumber(acc.accountNumber);
                        setActiveCustomerTab('deposit');
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#2563EB] hover:bg-blue-50 rounded-md transition-colors"
                    >
                      Deposit
                    </button>
                    <span className="text-slate-200">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAccountNumber(acc.accountNumber);
                        setActiveCustomerTab('withdraw');
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      Withdraw
                    </button>
                    <span className="text-slate-200">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAccountNumber(acc.accountNumber);
                        setActiveCustomerTab('transfer');
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
                    >
                      Transfer
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAccountNumber(acc.accountNumber);
                      setActiveCustomerTab('history');
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <span>Passbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Account Applications */}
          {accountApplications.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <h3 className="font-semibold text-sm text-[#142B4A] flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Submitted Account Opening Applications</span>
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {accountApplications.map((app) => (
                  <div key={app.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {app.accountType === 'savings' ? 'Savings Account Application' : 'Current Account Application'}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Ref: <span className="font-mono">{app.id}</span> · Initial Deposit: <span className="font-mono font-medium">₹{app.initialDeposit.toLocaleString('en-IN')}</span> · {app.branch}
                      </div>
                      {app.remarks && (
                        <div className="text-[11px] text-slate-600 mt-1">
                          Remarks: {app.remarks}
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm font-semibold shrink-0 ${
                      app.status === 'pending'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : app.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Open New Account Form */
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 max-w-2xl">
          <form onSubmit={handleSubmitOpen} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.accountType}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => { setAccountType('savings'); setInitialDeposit(Math.max(initialDeposit, 1000)); }}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    accountType === 'savings'
                      ? 'border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-sm text-[#142B4A]">{t.savingsAccount}</div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Ideal for personal finances and wealth growth. Minimum balance requirement of ₹1,000.
                  </p>
                </div>

                <div
                  onClick={() => { setAccountType('current'); setInitialDeposit(Math.max(initialDeposit, 5000)); }}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    accountType === 'current'
                      ? 'border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-sm text-[#142B4A]">{t.currentAccount}</div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Designed for businesses & trading. Includes ₹50,000 overdraft facility. Minimum initial deposit ₹5,000.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Funding Deposit Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">₹</span>
                <input
                  type="number"
                  min={accountType === 'savings' ? 1000 : 5000}
                  step="500"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(Number(e.target.value))}
                  required
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono tabular-nums"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {accountType === 'savings' ? 'Minimum opening deposit: ₹1,000' : 'Minimum opening deposit: ₹5,000'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred BankTM Home Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
              >
                <option value="Indiranagar Branch, Bengaluru">Indiranagar Branch, Bengaluru (BTMN000104)</option>
                <option value="MG Road Main Branch, Bengaluru">MG Road Main Branch, Bengaluru (BTMN000101)</option>
                <option value="Jayanagar Branch, Bengaluru">Jayanagar Branch, Bengaluru (BTMN000108)</option>
                <option value="Mysuru City Branch">Mysuru City Branch (BTMN000201)</option>
                <option value="Hubballi Commercial Hub">Hubballi Commercial Hub (BTMN000301)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-start gap-2 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                All new accounts undergo verification by the BankTM Branch Administrator. Once approved, your account will be activated instantly with your initial deposit credited.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                Submit Application for Approval
              </button>
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
