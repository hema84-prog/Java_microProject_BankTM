import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight, 
  CreditCard, 
  Landmark, 
  ExternalLink, 
  PlusCircle,
  Eye,
  CheckCircle2,
  Clock,
  ChevronRight,
  Volume2,
  VolumeX,
  Copy,
  Lock,
  Unlock,
  Sparkles,
  TrendingUp,
  Send,
  ShieldCheck,
  Check,
  Search,
  Building2,
  Calculator,
  IndianRupee,
  FileText,
  ArrowRight
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { speakText, stopSpeech } from '../../utils/speech';

export const CustomerDashboard: React.FC = () => {
  const { 
    currentCustomer, 
    customerAccounts, 
    customerTransactions, 
    customerCardApplications,
    schemes,
    setActiveCustomerTab,
    setSelectedAccountNumber,
    setLastTransactionReceipt,
    transfer,
    language,
    t 
  } = useBanking();

  // Voice narration state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Interactive Card Widget state
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isCardLocked, setIsCardLocked] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);

  // Quick Direct Transfer Widget on Dashboard
  const [quickAmount, setQuickAmount] = useState<string>('1000');
  const [quickPayee, setQuickPayee] = useState<string>('HDFC00049281');
  const [quickPayeeName, setQuickPayeeName] = useState<string>('Kaveri Agro Tech');
  const [quickMsg, setQuickMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dedicated Government Schemes Dashboard Filter & Search
  const [dashCategory, setDashCategory] = useState<string>('all');
  const [dashSearch, setDashSearch] = useState<string>('');

  if (!currentCustomer) return null;

  // Aggregate statistics
  const totalBalance = customerAccounts.reduce((acc, a) => acc + (a.status === 'active' ? a.balance : 0), 0);
  const totalDeposits = customerTransactions
    .filter(tx => tx.type === 'deposit' || tx.type === 'transfer_in')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const totalWithdrawals = customerTransactions
    .filter(tx => tx.type === 'withdrawal' || tx.type === 'transfer_out')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const primaryAccount = customerAccounts[0];
  const primaryCard = customerCardApplications[0];

  // Daily interest accrual projection (7.10% APY for Savings)
  const dailyInterest = (totalBalance * 0.071) / 365;

  const dashboardCategories = [
    { id: 'all', label: 'All Schemes' },
    { id: 'business', label: 'Business & MSME' },
    { id: 'agriculture', label: 'Agriculture & KCC' },
    { id: 'education', label: 'Education Loans' },
    { id: 'women', label: 'Women & SHG' },
    { id: 'karnataka', label: 'Karnataka State' },
  ];

  const filteredDashboardSchemes = schemes.filter(s => {
    if (dashCategory !== 'all' && s.category !== dashCategory) return false;
    if (dashSearch) {
      const q = dashSearch.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchDesc = s.description.toLowerCase().includes(q);
      const matchAmt = s.loanOrSubsidyAmount?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAmt) return false;
    }
    return true;
  });

  const handleDashboardSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      const readout = `Welcome ${currentCustomer.fullName}. Your total available balance is Rupees ${Math.round(totalBalance).toLocaleString()}. You have ${customerAccounts.length} active accounts at BankTM. Lifetime deposits stand at Rupees ${Math.round(totalDeposits).toLocaleString()}.`;
      speakText(readout, language);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 8000);
    }
  };

  const handleCopyAcc = () => {
    if (primaryAccount) {
      navigator.clipboard.writeText(primaryAccount.accountNumber);
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    }
  };

  const handleQuickPay = (e: React.FormEvent) => {
    e.preventDefault();
    setQuickMsg(null);
    const amt = parseFloat(quickAmount);
    if (!primaryAccount) return;
    if (isNaN(amt) || amt <= 0) {
      setQuickMsg({ type: 'error', text: 'Please enter a valid amount.' });
      return;
    }

    const res = transfer(primaryAccount.accountNumber, quickPayee, quickPayeeName, amt, 'Quick Transfer from Dashboard');
    if (res.success) {
      setQuickMsg({ type: 'success', text: `Sent ₹${amt.toLocaleString('en-IN')} to ${quickPayeeName} successfully!` });
      setTimeout(() => setQuickMsg(null), 4000);
    } else {
      setQuickMsg({ type: 'error', text: res.message || 'Transfer failed.' });
    }
  };

  const recentTransactions = customerTransactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Dynamic Welcome Banner with Audio Voice Narration */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium font-mono">
              {t.customerId}: <strong className="text-slate-800">{currentCustomer.id}</strong>
            </span>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={handleCopyAcc}
              className="text-[11px] text-[#2563EB] hover:underline flex items-center gap-1 font-mono"
            >
              {copiedAcc ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAcc ? 'Copied' : primaryAccount?.accountNumber}</span>
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[#142B4A] tracking-tight">
            {t.welcomeCustomer}, {currentCustomer.fullName}
          </h1>

          <p className="text-xs text-slate-500">
            Registered branch: Indiranagar Core Banking Centre · IFSC: <span className="font-mono font-semibold text-slate-700">BTMN000104</span>
          </p>
        </div>

        {/* Action Controls & Audio Speaker Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDashboardSpeech}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors border shadow-xs ${
              isSpeaking 
                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title="Listen to your account balance readout"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-700" /> : <Volume2 className="w-3.5 h-3.5 text-[#2563EB]" />}
            <span>{isSpeaking ? 'Stop Voice' : 'Voice Briefing (ಧ್ವನಿ)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCustomerTab('deposit')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>{t.navDeposit}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCustomerTab('transfer')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{t.navTransfer}</span>
          </button>
        </div>
      </div>

      {/* 4 Main Key Performance Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Accounts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{t.totalAccounts}</span>
            <Wallet className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#142B4A] font-mono tabular-nums">
              {customerAccounts.length}
            </span>
            <span className="text-xs text-slate-500">
              ({customerAccounts.filter(a => a.accountType === 'savings').length} Savings · {customerAccounts.filter(a => a.accountType === 'current').length} Current)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveCustomerTab('my_accounts')}
            className="mt-3 text-[11px] font-semibold text-[#2563EB] hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <span>Manage All Accounts</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Available Balance */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{t.availableBalance}</span>
            <Landmark className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#142B4A] font-mono tabular-nums">
              ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Accruing ~₹{dailyInterest.toFixed(2)} interest/day (7.10% APY)</span>
          </div>
        </div>

        {/* Total Deposits */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{t.totalDeposits}</span>
            <ArrowDownToLine className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
              ₹{totalDeposits.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            Total lifetime credited settlements
          </div>
        </div>

        {/* Total Withdrawals */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{t.totalWithdrawals}</span>
            <ArrowUpFromLine className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-800 font-mono tabular-nums">
              ₹{totalWithdrawals.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            Transfers, debits & ATM disbursements
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Card Widget, Quick Transfer Drawer, & Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Interactive 3D Flip Card & Card Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#2563EB]" />
                <h3 className="font-bold text-sm text-[#142B4A]">BankTM Digital Card</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                {isCardFlipped ? 'Show Front' : 'Flip to Back (CVV)'}
              </button>
            </div>

            {/* The Flippable Card Simulation */}
            <div 
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              className="cursor-pointer relative h-52 rounded-2xl text-white p-6 shadow-xl transition-all duration-500 select-none overflow-hidden bg-linear-to-tr from-[#0F2038] via-[#1A365D] to-[#2563EB] border border-slate-700 hover:shadow-2xl"
            >
              {/* Hologram sheen */}
              <div className="absolute right-0 top-0 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              {!isCardFlipped ? (
                /* Card Front */
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-base tracking-tight">Bank<span className="text-blue-300">TM</span></span>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded">
                      {primaryCard?.cardNetwork || 'RuPay'} PLATINUM
                    </span>
                  </div>

                  {/* Chip & NFC Contactless */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-8 rounded-md bg-amber-400 border border-amber-300 shadow-xs flex items-center justify-center">
                      <div className="w-6 h-5 border border-amber-600/40 rounded-xs" />
                    </div>
                    <span className="text-xs tracking-widest text-blue-200">))))</span>
                  </div>

                  <div>
                    <div className="font-mono text-lg tracking-widest font-semibold text-slate-100">
                      {primaryCard?.maskedCardNumber || '6074 •••• •••• 9214'}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="font-bold tracking-wider uppercase truncate max-w-[170px]">
                        {currentCustomer.fullName}
                      </span>
                      <span className="font-mono text-slate-300 font-medium">
                        EXP {primaryCard?.expiryDate || '11/31'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Card Back */
                <div className="h-full flex flex-col justify-between">
                  <div className="w-full h-8 bg-slate-950 -mx-6 mt-1" />
                  
                  <div className="bg-white/80 p-1.5 rounded-sm flex items-center justify-between text-slate-900 font-mono text-xs">
                    <span className="text-[10px] text-slate-500">Authorized Signature</span>
                    <span className="font-bold bg-white px-2 py-0.5 rounded-xs tracking-widest">
                      CVV: 842
                    </span>
                  </div>

                  <div className="text-[9px] text-blue-200 leading-tight">
                    This card is property of BankTM. For 24x7 customer support or lost card reporting call 1800-425-2026.
                  </div>
                </div>
              )}
            </div>

              {/* Card Controls Bar */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCardLocked(!isCardLocked)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                  isCardLocked 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {isCardLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isCardLocked ? 'Card Frozen' : 'Card Active'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCustomerTab('my_cards')}
                className="py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-center"
              >
                Card Settings & Limits
              </button>
            </div>
          </div>

          {/* Direct Transfer Quick Drawer */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#142B4A] flex items-center gap-2">
                <Send className="w-4 h-4 text-[#2563EB]" />
                <span>Instant Quick Transfer</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Zero Fee</span>
            </div>

            {quickMsg && (
              <div className={`p-2.5 rounded-lg text-xs ${
                quickMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}>
                {quickMsg.text}
              </div>
            )}

            <form onSubmit={handleQuickPay} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Recipient Account Number / Payee
                </label>
                <input
                  type="text"
                  required
                  value={quickPayee}
                  onChange={(e) => setQuickPayee(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">₹</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 text-xs font-bold font-mono border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              {/* Fast Denomination Chips */}
              <div className="flex items-center gap-1.5">
                {['500', '1000', '2000', '5000'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setQuickAmount(val)}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-medium border transition-colors ${
                      quickAmount === val
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    +₹{val}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1f3f6b] rounded-lg transition-colors shadow-xs"
              >
                Send Direct Bank Transfer
              </button>
            </form>
          </div>
        </div>

        {/* Right 7 Cols: Accounts Overview & Live Passbook */}
        <div className="lg:col-span-7 space-y-6">
          {/* Account Ledgers Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#142B4A]">{t.accountOverview}</h3>
                <p className="text-xs text-slate-500">Your core operational banking accounts</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCustomerTab('open_account')}
                className="flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Open Account</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {customerAccounts.map((acc) => (
                <div key={acc.accountNumber} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#142B4A]">
                        {acc.accountType === 'savings' ? t.savingsAccount : t.currentAccount}
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        {acc.accountNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {acc.branch} · IFSC: <strong className="font-mono text-slate-700">{acc.ifscCode}</strong>
                    </div>
                    {acc.accountType === 'savings' && (
                      <div className="text-[11px] text-slate-500">
                        {t.minBalanceNote}
                      </div>
                    )}
                    {acc.accountType === 'current' && acc.overdraftLimit && (
                      <div className="text-[11px] text-blue-700 font-semibold font-mono">
                        Overdraft Limit: ₹{acc.overdraftLimit.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col sm:items-end justify-between items-baseline gap-1">
                    <span className="text-[11px] text-slate-400 font-medium">Cleared Balance</span>
                    <span className="text-xl font-bold text-[#142B4A] font-mono tabular-nums">
                      ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAccountNumber(acc.accountNumber);
                          setActiveCustomerTab('transfer');
                        }}
                        className="text-xs font-semibold text-[#2563EB] hover:underline"
                      >
                        Transfer
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAccountNumber(acc.accountNumber);
                          setActiveCustomerTab('history');
                        }}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Passbook
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Audited Transactions Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#142B4A]">{t.recentTransactions}</h3>
                <p className="text-xs text-slate-500">Live electronic settlement records</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCustomerTab('history')}
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                {t.viewAll}
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {t.noRecentTransactions}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                    <tr>
                      <th className="py-2.5 px-4">{t.date}</th>
                      <th className="py-2.5 px-4">{t.type}</th>
                      <th className="py-2.5 px-4">Description</th>
                      <th className="py-2.5 px-4 text-right">{t.amount}</th>
                      <th className="py-2.5 px-4 text-center">Advice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentTransactions.map((tx) => {
                      const isCredit = tx.type === 'deposit' || tx.type === 'transfer_in';
                      return (
                        <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                            {tx.date.split(' ')[0]}
                          </td>
                          <td className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                            {tx.type.replace('_', ' ')}
                          </td>
                          <td className="py-3 px-4 text-slate-700 truncate max-w-[200px]">
                            {tx.description}
                          </td>
                          <td className={`py-3 px-4 text-right font-mono tabular-nums font-bold ${
                            isCredit ? 'text-emerald-600' : 'text-slate-900'
                          }`}>
                            {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setLastTransactionReceipt(tx)}
                              className="text-slate-500 hover:text-[#2563EB] p-1 rounded-sm"
                              title="View Official Receipt"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
