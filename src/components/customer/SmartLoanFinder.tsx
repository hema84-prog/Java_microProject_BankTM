import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  Calculator, 
  TrendingUp, 
  HelpCircle,
  ArrowRight,
  IndianRupee,
  Calendar,
  Layers,
  Percent,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { GovernmentScheme } from '../../types';

export const SmartLoanFinder: React.FC = () => {
  const { schemes, setActiveCustomerTab, t } = useBanking();

  // Mode: Finder vs Calculator
  const [activeMode, setActiveMode] = useState<'finder' | 'calculator'>('calculator');

  // Wizard state
  const [profileCategory, setProfileCategory] = useState<string>('farmer');
  const [purpose, setPurpose] = useState<string>('farming');
  const [schemeScope, setSchemeScope] = useState<'all' | 'central' | 'karnataka'>('all');
  const [hasSearched, setHasSearched] = useState(false);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(300000);
  const [interestRate, setInterestRate] = useState<number>(4.0); // 4% KCC default
  const [tenureYears, setTenureYears] = useState<number>(5);

  const profileOptions = [
    { id: 'farmer', title: t.farmer, desc: 'Cultivators, tenant farmers, dairy & agriculture workers' },
    { id: 'student', title: t.student, desc: 'Undergraduates, diploma holders, technical scholars' },
    { id: 'woman', title: t.womanEntrepreneur, desc: 'Women-led MSMEs, SHG members, home entrepreneurs' },
    { id: 'business', title: t.smallBusiness, desc: 'Shopkeepers, artisans, manufacturers, traders' },
    { id: 'self_employed', title: t.selfEmployed, desc: 'Street vendors, freelance artisans, service providers' },
    { id: 'general', title: t.generalCitizen, desc: 'Salaried individuals, families seeking general support' },
  ];

  const purposeOptions = [
    { id: 'farming', label: t.purposeFarming },
    { id: 'education', label: t.purposeEducation },
    { id: 'business', label: t.purposeBusiness },
    { id: 'housing', label: t.purposeHousing },
    { id: 'personal', label: t.purposePersonal },
  ];

  // Quick Scheme Presets for EMI Calculator
  const schemePresets = [
    { name: 'KCC Crop Loan (4.0%)', amount: 300000, rate: 4.0, tenure: 3, cat: 'Agriculture' },
    { name: 'Mudra Kishore (8.5%)', amount: 500000, rate: 8.5, tenure: 5, cat: 'MSME' },
    { name: 'Vidya Lakshmi Student Loan (8.25%)', amount: 750000, rate: 8.25, tenure: 7, cat: 'Education' },
    { name: 'PM SVANidhi Vendor (7.0% Subsidized)', amount: 50000, rate: 7.0, tenure: 2, cat: 'Street Vendor' },
    { name: 'Stand-Up India (8.75%)', amount: 2500000, rate: 8.75, tenure: 7, cat: 'Women Enterprise' },
  ];

  // Mathematical EMI Calculation
  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (r === 0) {
      const emi = P / n;
      return {
        monthlyEMI: emi,
        totalPayment: P,
        totalInterest: 0,
        principalPercent: 100,
        interestPercent: 0,
      };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    const principalPercent = (P / totalPayment) * 100;
    const interestPercent = (totalInterest / totalPayment) * 100;

    return {
      monthlyEMI: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principalPercent: Math.round(principalPercent),
      interestPercent: Math.round(interestPercent),
    };
  };

  const emiData = calculateEMI();

  const handleMatch = () => {
    setHasSearched(true);
  };

  const matchedSchemes = schemes.filter(s => {
    if (schemeScope === 'karnataka' && !s.isStateScheme) return false;
    if (schemeScope === 'central' && s.isStateScheme) return false;

    if (profileCategory === 'farmer') {
      return s.category === 'agriculture' || s.id === 'SCH-KAR-003';
    }
    if (profileCategory === 'student') {
      return s.category === 'education' || s.id === 'SCH-KAR-001' || s.id === 'SCH-EDU-003';
    }
    if (profileCategory === 'woman') {
      return s.category === 'women' || s.id === 'SCH-KAR-002' || s.id === 'SCH-BIZ-001' || s.id === 'SCH-WOMEN-001';
    }
    if (profileCategory === 'business') {
      return s.category === 'business';
    }
    if (profileCategory === 'self_employed') {
      return s.id === 'SCH-BIZ-002' || s.id === 'SCH-BIZ-001' || s.id === 'SCH-BIZ-004';
    }
    return s.isStateScheme || s.category === 'agriculture' || s.category === 'education';
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#002C6C] uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Smart Credit Advisory & EMI Simulation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142B4A] mt-1">
            Smart Loan Finder & Interactive EMI Calculator
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Calculate your monthly installment (EMI), total interest payments, and discover tailored central and state government credit schemes for agriculture, education, and MSME enterprises.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('calculator')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeMode === 'calculator'
                ? 'bg-[#002C6C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>EMI Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('finder')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeMode === 'finder'
                ? 'bg-[#002C6C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scheme Matcher</span>
          </button>
        </div>
      </div>

      {/* MODE 1: INTERACTIVE LOAN REPAYMENT EMI CALCULATOR */}
      {activeMode === 'calculator' && (
        <div className="space-y-6">
          {/* Quick Preset Buttons */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Select Government Scheme Rate Preset:</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {schemePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setLoanAmount(preset.amount);
                    setInterestRate(preset.rate);
                    setTenureYears(preset.tenure);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    loanAmount === preset.amount && interestRate === preset.rate
                      ? 'border-[#002C6C] bg-blue-50/70 ring-2 ring-[#002C6C]/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-xs text-[#142B4A]">{preset.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ₹{preset.amount.toLocaleString('en-IN')} · {preset.tenure} Years
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Calculator Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Cols: Sliders & Controls */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
              <h3 className="font-extrabold text-base text-[#142B4A] flex items-center gap-2 border-b border-slate-100 pb-3">
                <Calculator className="w-4 h-4 text-[#002C6C]" />
                <span>Adjust Loan Parameters</span>
              </h3>

              {/* Slider 1: Loan Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Loan Amount (Principal)</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-base text-[#002C6C] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    <span>₹</span>
                    <span>{loanAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#002C6C] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>₹10,000 (Mudra Shishu)</span>
                  <span>₹25,00,000</span>
                  <span>₹50,00,000 (PMEGP Max)</span>
                </div>
              </div>

              {/* Slider 2: Annual Interest Rate */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Annual Interest Rate (% p.a.)</span>
                  <div className="font-mono font-bold text-base text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    {interestRate.toFixed(2)}%
                  </div>
                </div>

                <input
                  type="range"
                  min="3.0"
                  max="16.0"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>3.0% (Subsidized)</span>
                  <span>4.0% (KCC Farm)</span>
                  <span>8.5% (Mudra)</span>
                  <span>16.0% (Unsecured)</span>
                </div>
              </div>

              {/* Slider 3: Loan Tenure */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Loan Repayment Tenure</span>
                  <div className="font-mono font-bold text-base text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    {tenureYears} Years ({tenureYears * 12} Months)
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-slate-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>1 Year</span>
                  <span>5 Years (Standard)</span>
                  <span>10 Years</span>
                  <span>15 Years (Education)</span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Visual EMI Display & Payment Breakdown */}
            <div className="lg:col-span-5 bg-linear-to-b from-[#002C6C] to-[#0A1A2F] rounded-2xl text-white p-6 sm:p-7 shadow-xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[11px] font-mono tracking-widest text-blue-200 uppercase block">
                  Computed Repayment Summary
                </span>

                {/* Big EMI Highlight Box */}
                <div className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 space-y-1">
                  <span className="text-xs text-blue-200">Monthly Installment (EMI)</span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums tracking-tight">
                    ₹{emiData.monthlyEMI.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-blue-300 block">per month for {tenureYears * 12} installments</span>
                </div>

                {/* Principal & Total Interest Breakdown */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-300 block text-[11px]">Total Interest</span>
                    <span className="font-mono font-bold text-base text-amber-300 block mt-0.5">
                      ₹{emiData.totalInterest.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-300 block text-[11px]">Total Repayment</span>
                    <span className="font-mono font-bold text-base text-emerald-300 block mt-0.5">
                      ₹{emiData.totalPayment.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Visual Proportion Bar (Principal vs Interest) */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] text-blue-200">
                    <span>Principal: {emiData.principalPercent}%</span>
                    <span>Interest: {emiData.interestPercent}%</span>
                  </div>

                  <div className="w-full h-3 bg-amber-400 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${emiData.principalPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button: Explore Scheme Details */}
              <button
                type="button"
                onClick={() => setActiveCustomerTab('schemes')}
                className="w-full py-3 bg-white text-[#002C6C] hover:bg-blue-50 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Browse Matching Government Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODE 2: SCHEME MATCHER WIZARD */}
      {activeMode === 'finder' && (
        <div className="space-y-6">
          {/* Step 1: Select Profile */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#142B4A]">
                1. {t.whoAreYou}
              </h3>
              <span className="text-[11px] text-slate-400">Step 1 of 2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {profileOptions.map((opt) => {
                const isSelected = profileCategory === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => { setProfileCategory(opt.id); setHasSearched(false); }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#002C6C] bg-blue-50/50 ring-2 ring-[#002C6C]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#142B4A]">{opt.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#002C6C]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Purpose & Scope */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#142B4A]">
                2. {t.loanPurpose}
              </h3>
              <span className="text-[11px] text-slate-400">Step 2 of 2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {purposeOptions.map((pur) => {
                const isSelected = purpose === pur.id;
                return (
                  <div
                    key={pur.id}
                    onClick={() => { setPurpose(pur.id); setHasSearched(false); }}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#002C6C] bg-blue-50/50 ring-1 ring-[#002C6C]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-semibold text-[#142B4A]">{pur.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#002C6C]" />}
                  </div>
                );
              })}
            </div>

            {/* Scope Selector */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-xs text-slate-600 font-medium">Scheme Origin Preference:</span>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => { setSchemeScope('all'); setHasSearched(false); }}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    schemeScope === 'all' ? 'bg-white text-[#142B4A] font-semibold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All Central & State
                </button>
                <button
                  type="button"
                  onClick={() => { setSchemeScope('central'); setHasSearched(false); }}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    schemeScope === 'central' ? 'bg-white text-[#142B4A] font-semibold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Central Schemes Only
                </button>
                <button
                  type="button"
                  onClick={() => { setSchemeScope('karnataka'); setHasSearched(false); }}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    schemeScope === 'karnataka' ? 'bg-white text-[#142B4A] font-semibold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Karnataka State Only
                </button>
              </div>
            </div>

            {/* Discover Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleMatch}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#002C6C] hover:bg-[#003B95] rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.findMatchingSchemes}</span>
              </button>
            </div>
          </div>

          {/* Results Section */}
          {hasSearched && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#142B4A] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.matchingSchemesFound} ({matchedSchemes.length})</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Personalized based on selected criteria
                </span>
              </div>

              {matchedSchemes.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center text-xs text-slate-500 border border-slate-200">
                  {t.noSchemesMatched}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedSchemes.map((scheme) => (
                    <div
                      key={scheme.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#002C6C] bg-blue-50 px-2 py-0.5 rounded-sm">
                            {scheme.categoryLabel}
                          </span>
                          {scheme.isStateScheme && (
                            <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">
                              {scheme.state} Scheme
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-base text-[#142B4A]">
                          {scheme.title}
                        </h4>

                        <div className="p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-950 font-bold border border-emerald-200">
                          {scheme.loanOrSubsidyAmount || scheme.financialBenefits}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {scheme.description}
                        </p>

                        <div className="text-[11px] text-slate-500">
                          <strong>Documents:</strong> {scheme.requiredDocuments.slice(0, 3).join(', ')}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setActiveCustomerTab('schemes')}
                          className="text-xs font-bold text-[#002C6C] hover:underline"
                        >
                          View Full Details
                        </button>
                        <a
                          href={scheme.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#002C6C] hover:bg-[#003B95] rounded-lg transition-colors shadow-xs"
                        >
                          <span>Apply on Official Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
