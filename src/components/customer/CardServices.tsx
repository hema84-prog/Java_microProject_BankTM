import React, { useState } from 'react';
import { 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Truck, 
  ShieldCheck, 
  Info,
  MapPin,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { CardNetwork, CardType, CardApplicationStatus } from '../../types';

interface CardServicesProps {
  initialTab?: 'my_cards' | 'apply_debit' | 'apply_credit';
}

export const CardServices: React.FC<CardServicesProps> = ({ initialTab = 'my_cards' }) => {
  const { 
    currentCustomer, 
    customerAccounts, 
    customerCardApplications, 
    applyDebitCard, 
    applyCreditCard, 
    t 
  } = useBanking();

  const [activeTab, setActiveTab] = useState<'my_cards' | 'apply_debit' | 'apply_credit'>(initialTab);

  // Debit Form State
  const [debitAccount, setDebitAccount] = useState<string>(customerAccounts[0]?.accountNumber || '');
  const [debitNetwork, setDebitNetwork] = useState<CardNetwork>('RuPay');
  const [debitAddress, setDebitAddress] = useState<string>(currentCustomer?.address || '');

  // Credit Form State
  const [creditAccount, setCreditAccount] = useState<string>(customerAccounts[0]?.accountNumber || '');
  const [creditNetwork, setCreditNetwork] = useState<CardNetwork>('Visa');
  const [employmentCategory, setEmploymentCategory] = useState<'salaried' | 'self_employed' | 'business' | 'student' | 'agricultural'>('salaried');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(65000);
  const [employerName, setEmployerName] = useState<string>('');
  const [requestedLimit, setRequestedLimit] = useState<number>(100000);
  const [creditAddress, setCreditAddress] = useState<string>(currentCustomer?.address || '');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyDebit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!debitAccount) {
      setMessage({ type: 'error', text: 'Please select a linked bank account.' });
      return;
    }
    const res = applyDebitCard(debitAccount, debitNetwork, debitAddress);
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => setActiveTab('my_cards'), 2000);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleApplyCredit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!creditAccount) {
      setMessage({ type: 'error', text: 'Please select a primary settlement bank account.' });
      return;
    }
    const res = applyCreditCard(
      creditAccount,
      creditNetwork,
      employmentCategory,
      Number(monthlyIncome),
      employerName.trim() || 'Self / Private',
      Number(requestedLimit),
      creditAddress
    );
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => setActiveTab('my_cards'), 2000);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  // Helper for tracking steps
  const getStatusStep = (status: CardApplicationStatus) => {
    switch (status) {
      case 'submitted': return 1;
      case 'under_review':
      case 'additional_info_required': return 2;
      case 'approved': return 3;
      case 'dispatched': return 4;
      case 'delivered': return 5;
      case 'rejected': return -1;
      default: return 1;
    }
  };

  const debitCards = customerCardApplications.filter(c => c.cardType === 'debit');
  const creditCards = customerCardApplications.filter(c => c.cardType === 'credit');

  return (
    <div className="space-y-6">
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            {activeTab === 'my_cards' ? t.navMyCards : activeTab === 'apply_debit' ? t.applyDebitHeading : t.applyCreditHeading}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chip & Contactless enabled cards powered by RuPay, Visa & Mastercard
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('my_cards'); setMessage(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'my_cards' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.navMyCards} ({customerCardApplications.length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('apply_debit'); setMessage(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'apply_debit' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Apply Debit
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('apply_credit'); setMessage(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'apply_credit' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Apply Credit
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

      {/* Tab 1: My Cards (Display Debit and Credit Separately with tracking) */}
      {activeTab === 'my_cards' && (
        <div className="space-y-8">
          {/* Section: Debit Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-[#142B4A] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#2563EB]" />
                <span>{t.debitCards}</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('apply_debit')}
                className="text-xs font-medium text-[#2563EB] hover:underline"
              >
                + Apply for Another Debit Card
              </button>
            </div>

            {debitCards.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                No active debit card applications found.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {debitCards.map((card) => {
                  const step = getStatusStep(card.status);
                  return (
                    <div key={card.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
                      {/* Interactive Card Mockup Preview */}
                      <div className="h-44 rounded-xl bg-linear-to-tr from-[#142B4A] via-[#1E3A5F] to-[#2563EB] text-white p-5 shadow-md flex flex-col justify-between relative overflow-hidden select-none">
                        <div className="absolute right-0 top-0 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm tracking-wide">Bank<span className="text-blue-300">TM</span></span>
                          <span className="text-[11px] font-mono tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded">
                            {card.cardNetwork}
                          </span>
                        </div>

                        {/* Chip Graphics */}
                        <div className="w-9 h-7 rounded-md bg-amber-400/90 border border-amber-300/60 shadow-xs flex items-center justify-center">
                          <div className="w-5 h-4 border border-amber-600/40 rounded-xs" />
                        </div>

                        <div>
                          <div className="font-mono text-base tracking-widest text-slate-100">
                            {card.maskedCardNumber || '•••• •••• •••• ••••'}
                          </div>
                          <div className="flex items-center justify-between mt-2 text-[11px]">
                            <span className="font-medium tracking-wide uppercase truncate max-w-[150px]">
                              {card.customerName}
                            </span>
                            <span className="font-mono text-slate-300">EXP {card.expiryDate || '••/••'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Details & Lifecycle Tracker */}
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500">{t.applicationReference}</span>
                          <span className="font-mono font-bold text-slate-800">{card.id}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500">Linked Account</span>
                          <span className="font-mono text-slate-800">{card.accountNumber}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500">{t.submittedOn}</span>
                          <span className="font-mono text-slate-600">{card.submittedAt.slice(0, 10)}</span>
                        </div>

                        {/* Progress Stepper */}
                        <div className="pt-2">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                            Delivery Lifecycle Tracking
                          </span>
                          <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                            <div className={`p-1.5 rounded-sm font-medium ${step >= 1 ? 'bg-blue-100 text-blue-900 font-semibold' : 'bg-slate-100 text-slate-400'}`}>
                              1. Submitted
                            </div>
                            <div className={`p-1.5 rounded-sm font-medium ${step >= 3 ? 'bg-blue-100 text-blue-900 font-semibold' : 'bg-slate-100 text-slate-400'}`}>
                              2. Approved
                            </div>
                            <div className={`p-1.5 rounded-sm font-medium ${step >= 4 ? 'bg-blue-100 text-blue-900 font-semibold' : 'bg-slate-100 text-slate-400'}`}>
                              3. Dispatched
                            </div>
                            <div className={`p-1.5 rounded-sm font-medium ${step >= 5 ? 'bg-emerald-100 text-emerald-900 font-semibold' : 'bg-slate-100 text-slate-400'}`}>
                              4. Delivered
                            </div>
                          </div>
                        </div>

                        {card.remarks && (
                          <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 text-[11px] border border-slate-100">
                            <strong>Bank Note:</strong> {card.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Credit Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-[#142B4A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t.creditCards}</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('apply_credit')}
                className="text-xs font-medium text-[#2563EB] hover:underline"
              >
                + Apply for Credit Card
              </button>
            </div>

            {creditCards.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                No credit card applications on record. Apply below to check your eligibility.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {creditCards.map((card) => {
                  const step = getStatusStep(card.status);
                  return (
                    <div key={card.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
                      {/* Premium Card Mockup Preview */}
                      <div className="h-44 rounded-xl bg-linear-to-tr from-slate-900 via-slate-800 to-indigo-950 text-white p-5 shadow-md flex flex-col justify-between relative overflow-hidden select-none border border-slate-700">
                        <div className="absolute right-0 top-0 w-36 h-36 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm tracking-wide text-amber-400">
                            Bank<span className="text-white">TM Signature</span>
                          </span>
                          <span className="text-[11px] font-mono tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded text-amber-300">
                            {card.cardNetwork}
                          </span>
                        </div>

                        {/* Chip Graphics */}
                        <div className="w-9 h-7 rounded-md bg-amber-400/90 border border-amber-300/60 shadow-xs flex items-center justify-center">
                          <div className="w-5 h-4 border border-amber-600/40 rounded-xs" />
                        </div>

                        <div>
                          <div className="font-mono text-base tracking-widest text-amber-100">
                            {card.maskedCardNumber || '•••• •••• •••• ••••'}
                          </div>
                          <div className="flex items-center justify-between mt-2 text-[11px]">
                            <span className="font-medium tracking-wide uppercase text-slate-200 truncate max-w-[150px]">
                              {card.customerName}
                            </span>
                            <span className="font-mono text-amber-300">EXP {card.expiryDate || '••/••'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500">{t.applicationReference}</span>
                          <span className="font-mono font-bold text-slate-800">{card.id}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500">Requested Limit</span>
                          <span className="font-mono font-bold text-[#142B4A]">₹{card.requestedLimit?.toLocaleString('en-IN')}</span>
                        </div>
                        {card.simulatedScore && (
                          <div className="flex justify-between items-center py-1 border-b border-slate-100">
                            <span className="text-slate-500">{t.simulatedEligibilityScore}</span>
                            <span className="font-mono font-bold text-emerald-600">{card.simulatedScore}/900 (Excellent)</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500">Application Status</span>
                          <span className={`font-semibold uppercase text-[10px] px-2 py-0.5 rounded-sm ${
                            card.status === 'approved' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : card.status === 'rejected'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {card.status.replace('_', ' ')}
                          </span>
                        </div>

                        {card.remarks && (
                          <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 text-[11px] border border-slate-100">
                            <strong>Underwriter Note:</strong> {card.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Apply Debit Card Form */}
      {activeTab === 'apply_debit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-2xl">
          <form onSubmit={handleApplyDebit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Linked Bank Account *
              </label>
              <select
                value={debitAccount}
                onChange={(e) => setDebitAccount(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
              >
                {customerAccounts.map(a => (
                  <option key={a.accountNumber} value={a.accountNumber}>
                    {a.accountType.toUpperCase()} - {a.accountNumber} (Balance: ₹{a.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.cardNetwork} *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['RuPay', 'Visa', 'Mastercard'] as CardNetwork[]).map((net) => (
                  <div
                    key={net}
                    onClick={() => setDebitNetwork(net)}
                    className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                      debitNetwork === net
                        ? 'border-[#2563EB] bg-blue-50/50 ring-1 ring-[#2563EB]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#142B4A]">{net}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Chip & NFC</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.deliveryAddress} *
              </label>
              <textarea
                rows={3}
                value={debitAddress}
                onChange={(e) => setDebitAddress(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-100 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Personalized debit cards are produced and dispatched via Indian Speed Post with secure end-to-end tracking within 3-5 working days.
              </span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                Submit Debit Card Application
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('my_cards')}
                className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Apply Credit Card Form */}
      {activeTab === 'apply_credit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-2xl">
          <form onSubmit={handleApplyCredit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Auto-Debit Account *
                </label>
                <select
                  value={creditAccount}
                  onChange={(e) => setCreditAccount(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
                >
                  {customerAccounts.map(a => (
                    <option key={a.accountNumber} value={a.accountNumber}>
                      {a.accountType.toUpperCase()} - {a.accountNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Card Network Preference
                </label>
                <select
                  value={creditNetwork}
                  onChange={(e) => setCreditNetwork(e.target.value as CardNetwork)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
                >
                  <option value="Visa">Visa Signature</option>
                  <option value="Mastercard">Mastercard World</option>
                  <option value="RuPay">RuPay Select (Lounge Access)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.employmentCategory} *
                </label>
                <select
                  value={employmentCategory}
                  onChange={(e) => setEmploymentCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
                >
                  <option value="salaried">Salaried (Private / Govt)</option>
                  <option value="self_employed">Self-Employed Professional</option>
                  <option value="business">Business Owner / Trader</option>
                  <option value="agricultural">Agricultural Producer</option>
                  <option value="student">Post-Graduate Scholar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.employerName}
                </label>
                <input
                  type="text"
                  placeholder="Company / Trade Name"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.monthlyIncome} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">₹</span>
                  <input
                    type="number"
                    min="15000"
                    step="5000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    required
                    className="w-full pl-7 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.requestedLimit} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">₹</span>
                  <input
                    type="number"
                    min="25000"
                    max="1000000"
                    step="10000"
                    value={requestedLimit}
                    onChange={(e) => setRequestedLimit(Number(e.target.value))}
                    required
                    className="w-full pl-7 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono tabular-nums font-semibold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.deliveryAddress} *
              </label>
              <textarea
                rows={2}
                value={creditAddress}
                onChange={(e) => setCreditAddress(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div className="p-3 bg-amber-50/70 rounded-lg text-xs text-amber-900 border border-amber-200/80 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>Simulated Credit Assessment Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Credit evaluation will be simulated based on declared income and customer repayment history. Actual card approval and approved limit are determined by BankTM underwriting administration.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#142B4A] hover:bg-[#1f3f6b] rounded-lg transition-colors shadow-xs"
              >
                Submit Credit Card Application
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('my_cards')}
                className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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
