import React, { useState } from 'react';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

interface TransactionsViewProps {
  defaultMode?: 'deposit' | 'withdraw' | 'transfer' | 'balance';
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ defaultMode = 'transfer' }) => {
  const { 
    customerAccounts, 
    selectedAccountNumber, 
    setSelectedAccountNumber,
    deposit, 
    withdraw, 
    transfer,
    t 
  } = useBanking();

  const [mode, setMode] = useState<'deposit' | 'withdraw' | 'transfer' | 'balance'>(defaultMode);
  
  // Form State
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState<string>('');
  const [beneficiaryName, setBeneficiaryName] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const activeAccount = customerAccounts.find(a => a.accountNumber === selectedAccountNumber) || customerAccounts[0];

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid positive deposit amount.' });
      return;
    }
    const res = deposit(activeAccount.accountNumber, num, description);
    if (res.success) {
      setMessage({ type: 'success', text: `Successfully deposited ₹${num.toLocaleString('en-IN')}. Receipt generated.` });
      setAmount('');
      setDescription('');
    } else {
      setMessage({ type: 'error', text: res.message || 'Deposit failed.' });
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid positive withdrawal amount.' });
      return;
    }
    const res = withdraw(activeAccount.accountNumber, num, description);
    if (res.success) {
      setMessage({ type: 'success', text: `Successfully debited ₹${num.toLocaleString('en-IN')}. Receipt generated.` });
      setAmount('');
      setDescription('');
    } else {
      setMessage({ type: 'error', text: res.message || 'Withdrawal failed.' });
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid positive transfer amount.' });
      return;
    }
    if (!beneficiaryAccount.trim()) {
      setMessage({ type: 'error', text: 'Beneficiary account number is required.' });
      return;
    }
    const res = transfer(activeAccount.accountNumber, beneficiaryAccount.trim(), beneficiaryName.trim() || 'Beneficiary', num, description);
    if (res.success) {
      setMessage({ type: 'success', text: `Fund transfer of ₹${num.toLocaleString('en-IN')} completed successfully! Receipt generated.` });
      setAmount('');
      setDescription('');
      setBeneficiaryAccount('');
      setBeneficiaryName('');
    } else {
      setMessage({ type: 'error', text: res.message || 'Transfer failed.' });
    }
  };

  if (!activeAccount) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-slate-500 border border-slate-200">
        No active bank account available. Please open a bank account first.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header & Mode Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            {mode === 'deposit' ? t.depositHeading : mode === 'withdraw' ? t.withdrawHeading : mode === 'transfer' ? t.transferHeading : t.navBalanceEnquiry}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time simulated core banking operations with strict ledger integrity
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => { setMode('transfer'); setMessage(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'transfer' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Transfer
          </button>
          <button
            type="button"
            onClick={() => { setMode('deposit'); setMessage(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'deposit' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Deposit
          </button>
          <button
            type="button"
            onClick={() => { setMode('withdraw'); setMessage(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'withdraw' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Withdraw
          </button>
          <button
            type="button"
            onClick={() => { setMode('balance'); setMessage(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'balance' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Balance
          </button>
        </div>
      </div>

      {/* Account Selector Pill Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Selected Operating Account
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-bold text-base text-[#142B4A]">
              {activeAccount.accountType === 'savings' ? t.savingsAccount : t.currentAccount}
            </span>
            <span className="text-xs font-mono text-slate-500">
              ({activeAccount.accountNumber})
            </span>
          </div>
        </div>

        {/* Change account dropdown if multiple */}
        {customerAccounts.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium whitespace-nowrap">Switch Account:</label>
            <select
              value={activeAccount.accountNumber}
              onChange={(e) => setSelectedAccountNumber(e.target.value)}
              className="text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              {customerAccounts.map(a => (
                <option key={a.accountNumber} value={a.accountNumber}>
                  {a.accountType.toUpperCase()} - {a.accountNumber} (₹{a.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Current Available Balance Callout */}
        <div className="text-right sm:border-l sm:border-slate-100 sm:pl-4">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Current Balance</span>
          <div className="text-xl font-bold text-[#142B4A] font-mono tabular-nums">
            ₹{activeAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
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

      {/* Mode 1: Direct Transfer */}
      {mode === 'transfer' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.beneficiaryAccount} *
                </label>
                <input
                  type="text"
                  placeholder="e.g. BTM-SB-100294119 or HDFC0091823"
                  value={beneficiaryAccount}
                  onChange={(e) => setBeneficiaryAccount(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Supports internal BankTM accounts and external NEFT/IMPS accounts.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.beneficiaryName} (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Beneficiary Legal Name"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.amount} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono tabular-nums font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.description}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly rent, supplier payment"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            {/* Validation note */}
            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-100 flex items-center justify-between">
              <span>
                {activeAccount.accountType === 'savings'
                  ? `Minimum balance rule: ₹1,000 must remain in account. Maximum transferable right now: ₹${Math.max(0, activeAccount.balance - 1000).toLocaleString('en-IN')}`
                  : `Overdraft facility active: Can utilize up to ₹${((activeAccount.overdraftLimit || 50000) + activeAccount.balance).toLocaleString('en-IN')}`
                }
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                {t.confirmTransaction}
              </button>
              <button
                type="button"
                onClick={() => { setAmount(''); setDescription(''); setBeneficiaryAccount(''); }}
                className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mode 2: Deposit Funds */}
      {mode === 'deposit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deposit Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">₹</span>
                <input
                  type="number"
                  min="10"
                  step="any"
                  placeholder="Enter deposit amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono tabular-nums font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deposit Source / Reference Remarks
              </label>
              <input
                type="text"
                placeholder="e.g. Cash Deposit Machine, Salary Credit, Cheque #004918"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#142B4A] hover:bg-[#1f3f6b] rounded-lg transition-colors shadow-xs"
              >
                Credit Funds to Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mode 3: Withdraw Funds */}
      {mode === 'withdraw' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Withdrawal Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">₹</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  placeholder="Enter withdrawal amount in multiples of ₹100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono tabular-nums font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Remarks / Purpose
              </label>
              <input
                type="text"
                placeholder="e.g. Branch counter withdrawal, Cash requirement"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100 space-y-1">
              <div className="font-semibold text-slate-700">Withdrawal Rule Policy:</div>
              {activeAccount.accountType === 'savings' ? (
                <p>Savings accounts must retain at least ₹1,000 minimum balance. Maximum withdrawable: ₹{Math.max(0, activeAccount.balance - 1000).toLocaleString('en-IN')}.</p>
              ) : (
                <p>Current accounts can utilize the full overdraft limit of ₹{(activeAccount.overdraftLimit || 50000).toLocaleString('en-IN')}. Maximum withdrawable: ₹{(activeAccount.balance + (activeAccount.overdraftLimit || 50000)).toLocaleString('en-IN')}.</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors shadow-xs"
              >
                Authorize Cash Withdrawal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mode 4: Balance Enquiry */}
      {mode === 'balance' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#142B4A]">Official Ledger Balance Summary</h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Timestamp: {new Date().toISOString().replace('T', ' ').slice(0, 19)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Cleared Balance</span>
              <div className="text-2xl font-bold text-[#142B4A] font-mono tabular-nums mt-1">
                ₹{activeAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Account Policy Requirement</span>
              <div className="text-sm font-semibold text-slate-800 font-mono mt-2">
                {activeAccount.accountType === 'savings' ? 'Min Balance: ₹1,000.00' : `Overdraft: ₹${(activeAccount.overdraftLimit || 50000).toLocaleString('en-IN')}`}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Net Withdrawable</span>
              <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
                ₹{(activeAccount.accountType === 'savings' 
                  ? Math.max(0, activeAccount.balance - 1000) 
                  : activeAccount.balance + (activeAccount.overdraftLimit || 50000)
                ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 pt-2">
            Home Branch: <span className="font-medium text-slate-800">{activeAccount.branch}</span> · IFSC: <span className="font-mono text-slate-800">{activeAccount.ifscCode}</span>
          </div>
        </div>
      )}
    </div>
  );
};
