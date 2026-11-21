import React, { useState } from 'react';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Check,
  TrendingUp,
  Info,
  Building2,
  Landmark,
  ArrowRight
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BankingTransaction } from '../../types';

interface TransactionsViewProps {
  defaultMode?: 'deposit' | 'withdraw' | 'transfer' | 'balance';
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ defaultMode = 'transfer' }) => {
  const { 
    currentCustomer,
    customerAccounts, 
    selectedAccountNumber, 
    setSelectedAccountNumber,
    deposit, 
    withdraw, 
    transfer,
    setLastTransactionReceipt,
    t 
  } = useBanking();

  const [mode, setMode] = useState<'deposit' | 'withdraw' | 'transfer' | 'balance'>(defaultMode);
  
  // Common Form State
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Transfer State
  const [beneficiaryAccount, setBeneficiaryAccount] = useState<string>('');
  const [beneficiaryName, setBeneficiaryName] = useState<string>('');

  // Deposit Source State
  const [depositSourceType, setDepositSourceType] = useState<string>('Branch Cash Counter / CDM');
  const [customSourceName, setCustomSourceName] = useState<string>('');
  const [depositChannelId, setDepositChannelId] = useState<string>('CDM-IND-01');

  // Withdrawal Destination State
  const [withdrawalDestType, setWithdrawalDestType] = useState<string>('ATM Cash Dispenser');
  const [withdrawalChannelId, setWithdrawalChannelId] = useState<string>('ATM-IND-02');

  const activeAccount = customerAccounts.find(a => a.accountNumber === selectedAccountNumber) || customerAccounts[0];

  const handleDepositSourceChange = (val: string) => {
    setDepositSourceType(val);
    switch (val) {
      case 'Branch Cash Counter / CDM':
        setDepositChannelId('CDM-IND-01');
        break;
      case 'Cheque Deposit Clearing Counter':
        setDepositChannelId('CHQ-CLEARING-02');
        break;
      case 'Direct Employer Salary Payroll':
        setDepositChannelId('CORP-PAYROLL-09');
        break;
      case 'External Bank NEFT/RTGS Inward':
        setDepositChannelId('RBI-NEFT-INWARD');
        break;
      case 'Government Direct Benefit Transfer (DBT)':
        setDepositChannelId('GOVT-DBT-PFMS');
        break;
      default:
        setDepositChannelId('CUSTOM-DEP-SRC');
    }
  };

  const handleWithdrawalDestChange = (val: string) => {
    setWithdrawalDestType(val);
    switch (val) {
      case 'ATM Cash Dispenser':
        setWithdrawalChannelId('ATM-IND-02');
        break;
      case 'Branch Cash Counter (Teller Slip)':
        setWithdrawalChannelId('BRANCH-TELLER-03');
        break;
      case 'Self Cash Cheque / Draft Counter':
        setWithdrawalChannelId('CHQ-DISPENSER-05');
        break;
      default:
        setWithdrawalChannelId('CASH-DISPENSER-ATM');
    }
  };

  const [lastSuccessTx, setLastSuccessTx] = useState<BankingTransaction | null>(null);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLastSuccessTx(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid positive deposit amount.' });
      return;
    }
    const finalSource = depositSourceType === 'Other / Custom Source' ? (customSourceName.trim() || 'Custom External Source') : depositSourceType;
    const res = deposit(activeAccount.accountNumber, num, description, finalSource, depositChannelId);
    if (res.success && res.transaction) {
      setLastSuccessTx(res.transaction);
      setMessage({ type: 'success', text: `Successfully credited ₹${num.toLocaleString('en-IN')} from ${finalSource} into ${activeAccount.accountNumber}. Complete settlement advice generated.` });
      setAmount('');
      setDescription('');
    } else {
      setMessage({ type: 'error', text: res.message || 'Deposit failed.' });
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLastSuccessTx(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid positive withdrawal amount.' });
      return;
    }
    const res = withdraw(activeAccount.accountNumber, num, description, withdrawalDestType, withdrawalChannelId);
    if (res.success && res.transaction) {
      setLastSuccessTx(res.transaction);
      setMessage({ type: 'success', text: `Successfully debited ₹${num.toLocaleString('en-IN')} to ${withdrawalDestType}. Complete settlement advice generated.` });
      setAmount('');
      setDescription('');
    } else {
      setMessage({ type: 'error', text: res.message || 'Withdrawal failed.' });
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLastSuccessTx(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid transfer amount.' });
      return;
    }
    if (!beneficiaryAccount.trim()) {
      setMessage({ type: 'error', text: 'Please provide recipient account number.' });
      return;
    }

    const recipientLabel = beneficiaryName.trim() || 'Beneficiary Transfer';
    const res = transfer(activeAccount.accountNumber, beneficiaryAccount.trim(), recipientLabel, num, description);
    if (res.success && res.transaction) {
      setLastSuccessTx(res.transaction);
      setMessage({ type: 'success', text: `Successfully transferred ₹${num.toLocaleString('en-IN')} to ${beneficiaryName || beneficiaryAccount}. Transaction receipt generated.` });
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
      <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
        No active bank account available. Please open a bank account first.
      </div>
    );
  }

  const effectiveDepositSource = depositSourceType === 'Other / Custom Source' ? (customSourceName || 'Custom External Source') : depositSourceType;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header & Mode Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A] tracking-tight">
            {mode === 'deposit' ? 'Cash & Electronic Deposit' : mode === 'withdraw' ? 'Account Funds Withdrawal' : mode === 'transfer' ? 'Fund Transfer & Payments' : 'Balance Enquiry & Interest Yield'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Core banking double-entry ledger operations with complete audit traceability
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => { setMode('transfer'); setMessage(null); }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'transfer' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Transfer
          </button>
          <button
            type="button"
            onClick={() => { setMode('deposit'); setMessage(null); }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'deposit' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Deposit
          </button>
          <button
            type="button"
            onClick={() => { setMode('withdraw'); setMessage(null); }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'withdraw' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Withdraw
          </button>
          <button
            type="button"
            onClick={() => { setMode('balance'); setMessage(null); }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'balance' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Balance
          </button>
        </div>
      </div>

      {/* Account Selector Pill Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Selected Operating Account
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-bold text-base text-[#142B4A]">
              {activeAccount.accountType === 'savings' ? 'Savings Account' : 'Current Account (MSME)'}
            </span>
            <span className="text-xs font-mono text-slate-500">
              ({activeAccount.accountNumber})
            </span>
          </div>
        </div>

        {customerAccounts.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Switch Account:</label>
            <select
              value={activeAccount.accountNumber}
              onChange={(e) => setSelectedAccountNumber(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              {customerAccounts.map(a => (
                <option key={a.accountNumber} value={a.accountNumber}>
                  {a.accountType.toUpperCase()} - {a.accountNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Cleared Balance</span>
          <div className="text-xl font-extrabold text-[#142B4A] font-mono tabular-nums">
            ₹{activeAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs flex items-start gap-3 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
            : 'bg-red-50 text-red-900 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Real Banking Core System Settlement Voucher */}
      {lastSuccessTx && (
        <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-md p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Electronic Settlement Complete · {lastSuccessTx.type === 'deposit' || lastSuccessTx.type === 'transfer_in' ? 'CREDIT' : 'DEBIT'}
                </span>
                <h4 className="font-bold text-sm text-[#142B4A] mt-0.5">
                  Official Core Banking Settlement Voucher
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLastTransactionReceipt(lastSuccessTx)}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1E3A8A] rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Open Advice Slip
              </button>
              <button
                type="button"
                onClick={() => setLastSuccessTx(null)}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Transaction ID</span>
              <span className="font-mono font-bold text-[#142B4A] text-xs">{lastSuccessTx.id}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Date & Time</span>
              <span className="font-mono text-slate-700">{lastSuccessTx.date}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Transaction Amount</span>
              <span className={`font-mono font-bold text-sm ${
                lastSuccessTx.type === 'deposit' || lastSuccessTx.type === 'transfer_in' ? 'text-emerald-700' : 'text-[#142B4A]'
              }`}>
                {lastSuccessTx.type === 'deposit' || lastSuccessTx.type === 'transfer_in' ? '+' : '-'}₹{lastSuccessTx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Transaction Status</span>
              <span className="font-bold text-emerald-700 uppercase">{lastSuccessTx.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Sender / Origin */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Sender / Origin Details</span>
              <div className="font-bold text-slate-900">{lastSuccessTx.senderName || currentCustomer?.fullName}</div>
              <div className="font-mono text-[11px] text-slate-500">{lastSuccessTx.senderAccount || lastSuccessTx.accountNumber}</div>
              <div className="text-[11px] text-slate-600">Source: <span className="font-medium text-slate-800">{lastSuccessTx.sourceOfMoney || 'Operating Balance'}</span></div>
            </div>

            {/* Receiver / Destination */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Receiver / Destination Details</span>
              <div className="font-bold text-slate-900">{lastSuccessTx.recipientName || currentCustomer?.fullName || 'Self'}</div>
              <div className="font-mono text-[11px] text-slate-500">{lastSuccessTx.recipientAccount || lastSuccessTx.accountNumber}</div>
              <div className="text-[11px] text-slate-600">Destination: <span className="font-medium text-slate-800">{lastSuccessTx.destinationOfMoney || 'Disbursement'}</span></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500">Post-Transaction Account Cleared Balance:</span>
            <span className="font-mono font-bold text-base text-[#142B4A]">
              ₹{lastSuccessTx.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* Mode 1: Direct Transfer */}
      {mode === 'transfer' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          {/* Real-time Source & Destination Mapping Preview */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 text-xs space-y-2">
            <div className="font-bold text-[#142B4A] uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Double-Entry Transaction Routing Preview</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sender (Debited Source)</span>
                <div className="font-bold text-[#142B4A] mt-0.5">{currentCustomer?.fullName}</div>
                <div className="text-[11px] font-mono text-slate-500">{activeAccount.accountNumber} ({activeAccount.accountType.toUpperCase()})</div>
                <div className="text-[10px] text-slate-400 mt-1">Branch: {activeAccount.branch}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Receiver (Credited Destination)</span>
                <div className="font-bold text-[#142B4A] mt-0.5">{beneficiaryName || 'Pending Recipient Name'}</div>
                <div className="text-[11px] font-mono text-slate-500">{beneficiaryAccount || 'Pending Account Number'}</div>
                <div className="text-[10px] text-slate-400 mt-1">Clearing: Internal BankTM / RBI Rails</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                  Beneficiary Account Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. BTM-SB-100294119 or HDFC00049281"
                  value={beneficiaryAccount}
                  onChange={(e) => setBeneficiaryAccount(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono bg-white text-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Supports internal BankTM accounts and external NEFT / IMPS transfers.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                  Beneficiary Legal Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kaveri Agro Tech"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                  Transfer Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono tabular-nums font-bold text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                  Purpose / Narration
                </label>
                <input
                  type="text"
                  placeholder="e.g. Farm supplies, seed purchase, vendor invoice"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
                />
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500">Quick Amounts:</span>
              {['1000', '5000', '10000', '25000'].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  +₹{val}
                </button>
              ))}
            </div>

            {/* Validation Callout */}
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200 flex items-center justify-between">
              <span>
                {activeAccount.accountType === 'savings'
                  ? `Maintaining minimum balance of ₹1,000 is mandatory. Max transferable right now: ₹${Math.max(0, activeAccount.balance - 1000).toLocaleString('en-IN')}`
                  : `Overdraft active: Can utilize up to ₹${((activeAccount.overdraftLimit || 50000) + activeAccount.balance).toLocaleString('en-IN')}`
                }
              </span>
              <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Execute Electronic Transfer
              </button>
              <button
                type="button"
                onClick={() => { setAmount(''); setDescription(''); setBeneficiaryAccount(''); }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mode 2: Deposit Funds with Origin Source Traceability */}
      {mode === 'deposit' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          {/* Source and Destination Audit Card */}
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs space-y-2">
            <div className="font-bold text-emerald-950 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Deposit Source & Destination Traceability Record</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Origin / Source of Money (Sender)</span>
                <div className="font-bold text-emerald-950 mt-0.5">{effectiveDepositSource}</div>
                <div className="text-[11px] font-mono text-slate-500">Channel ID: {depositChannelId}</div>
                <div className="text-[10px] text-slate-400 mt-1">Method: Inward Cash / Rails Tendered</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Receiving Account (Receiver)</span>
                <div className="font-bold text-[#142B4A] mt-0.5">{currentCustomer?.fullName}</div>
                <div className="text-[11px] font-mono text-slate-500">{activeAccount.accountNumber} ({activeAccount.accountType.toUpperCase()})</div>
                <div className="text-[10px] text-slate-400 mt-1">Branch: {activeAccount.branch}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleDeposit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                  Deposit Origin Source / Channel *
                </label>
                <select
                  value={depositSourceType}
                  onChange={(e) => handleDepositSourceChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="Branch Cash Counter / CDM">Branch Cash Counter / CDM (In-Person)</option>
                  <option value="Cheque Deposit Clearing Counter">Cheque Deposit Clearing Counter</option>
                  <option value="Direct Employer Salary Payroll">Direct Employer Salary Payroll</option>
                  <option value="External Bank NEFT/RTGS Inward">External Bank NEFT/RTGS Inward</option>
                  <option value="Government Direct Benefit Transfer (DBT)">Government Direct Benefit Transfer (DBT)</option>
                  <option value="Other / Custom Source">Other / Custom Inward Source</option>
                </select>
              </div>

              {depositSourceType === 'Other / Custom Source' ? (
                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Custom Source Name / Remitter *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Karnataka Agricultural Co-Op Credit"
                    value={customSourceName}
                    onChange={(e) => setCustomSourceName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Audit Channel Identifier
                  </label>
                  <input
                    type="text"
                    value={depositChannelId}
                    onChange={(e) => setDepositChannelId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-mono text-slate-700 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                Deposit Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">₹</span>
                <input
                  type="number"
                  min="10"
                  step="any"
                  placeholder="Enter deposit amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono tabular-nums font-bold text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Quick Presets:</span>
              {['2000', '5000', '10000', '25000', '50000'].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  +₹{val}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                Narration / Purpose Description
              </label>
              <input
                type="text"
                placeholder="e.g. Monthly salary, crop sale proceeds, cash deposit voucher"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1E3A8A] rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Process Deposit & Generate Advice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mode 3: Withdraw Funds with Destination Traceability */}
      {mode === 'withdraw' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          {/* Source and Destination Audit Card */}
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-2">
            <div className="font-bold text-amber-950 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Withdrawal Source & Disbursement Destination Record</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-amber-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Debited Account (Sender)</span>
                <div className="font-bold text-[#142B4A] mt-0.5">{currentCustomer?.fullName}</div>
                <div className="text-[11px] font-mono text-slate-500">{activeAccount.accountNumber} ({activeAccount.accountType.toUpperCase()})</div>
                <div className="text-[10px] text-slate-400 mt-1">Available Cleared Balance: ₹{activeAccount.balance.toLocaleString()}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-amber-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Disbursement Channel (Receiver)</span>
                <div className="font-bold text-amber-950 mt-0.5">{withdrawalDestType}</div>
                <div className="text-[11px] font-mono text-slate-500">Terminal ID: {withdrawalChannelId}</div>
                <div className="text-[10px] text-slate-400 mt-1">Disbursement Mode: Currency Outflow</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                  Disbursement Channel / Destination *
                </label>
                <select
                  value={withdrawalDestType}
                  onChange={(e) => handleWithdrawalDestChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="ATM Cash Dispenser">ATM Cash Dispenser (Chip & PIN)</option>
                  <option value="Branch Cash Counter (Teller Slip)">Branch Cash Counter (Teller Slip)</option>
                  <option value="Self Cash Cheque / Draft Counter">Self Cash Cheque / Draft Counter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                  Dispenser / Terminal Code
                </label>
                <input
                  type="text"
                  value={withdrawalChannelId}
                  onChange={(e) => setWithdrawalChannelId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-mono text-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                Withdrawal Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">₹</span>
                <input
                  type="number"
                  min="100"
                  step="any"
                  placeholder="Enter withdrawal amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono tabular-nums font-bold text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Denominations:</span>
              {['500', '1000', '2000', '5000', '10000'].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  ₹{val}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                Purpose / Memo
              </label>
              <input
                type="text"
                placeholder="e.g. Household expenditure, emergency cash, travel funds"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1E3A8A] rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Authenticate & Disburse Funds
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mode 4: Balance Enquiry */}
      {mode === 'balance' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-[#142B4A]">Official Cleared Balance Certificate</h3>
              <p className="text-xs text-slate-500">Live RBI Core Banking Interface Status</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Active & Unencumbered
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Available Cleared Balance</span>
              <div className="text-2xl font-extrabold text-[#142B4A] font-mono tabular-nums mt-1">
                ₹{activeAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <span className="text-xs text-emerald-800 block">Projected 7.10% APY Interest</span>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-1">
                ₹{((activeAccount.balance * 0.071) / 365).toFixed(2)}/day
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Account Status & Rules</span>
              <div className="text-sm font-bold text-[#142B4A] mt-1">
                {activeAccount.accountType === 'savings' ? 'Min Balance: ₹1,000' : `Overdraft: ₹${(activeAccount.overdraftLimit || 50000).toLocaleString()}`}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
