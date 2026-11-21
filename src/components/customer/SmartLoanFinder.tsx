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
    { name: 'PM SVANidhi Street Vendor (7.0%)', amount: 50000, rate: 7.0, tenure: 1, cat: 'Micro' },
    { name: 'Stand-Up India Green Field (9.0%)', amount: 2500000, rate: 9.0, tenure: 7, cat: 'Women/SC/ST' },
    { name: 'PMEGP Subsidy Project (9.5%)', amount: 1500000, rate: 9.5, tenure: 5, cat: 'Manufacturing' },
  ];

  // EMI Math Calculation
  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100; // Monthly interest rate
    const n = tenureYears * 12; // Total months

    if (P <= 0 || r <= 0 || n <= 0) {
      return {
        monthlyEMI: 0,
        totalPayment: 0,
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
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB] uppercase tracking-wider">
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
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('calculator')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeMode === 'calculator'
                ? 'bg-[#142B4A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-amber-300" />
            <span>EMI Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('finder')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeMode === 'finder'
                ? 'bg-[#142B4A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Scheme Matcher</span>
          </button>
        </div>
      </div>

      {/* MODE 1: INTERACTIVE LOAN REPAYMENT EMI CALCULATOR */}
      {activeMode === 'calculator' && (
        <div className="space-y-6">
          {/* Quick Preset Buttons */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-1.5">
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
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    loanAmount === preset.amount && interestRate === preset.rate
                      ? 'border-[#2563EB] bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-xs text-[#142B4A]">{preset.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
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
              <h3 className="font-bold text-base text-[#142B4A] flex items-center gap-2 border-b border-slate-100 pb-3">
                <Calculator className="w-4 h-4 text-[#2563EB]" />
                <span>Adjust Loan Parameters</span>
              </h3>

              {/* Slider 1: Loan Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Loan Amount (Principal)</span>
                  <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-mono font-bold text-[#142B4A]">
                    <span>₹</span>
                    <input
                      type="number"
                      min={10000}
                      max={10000000}
                      step={10000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Math.max(10000, Number(e.target.value)))}
                      className="w-28 text-right bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={5000000}
                  step={10000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹10,000</span>
                  <span>₹25,00,000</span>
                  <span>₹50,00,000</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Annual Interest Rate (% p.a.)</span>
                  <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-mono font-bold text-[#142B4A]">
                    <input
                      type="number"
                      min={1.0}
                      max={25.0}
                      step={0.25}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Math.max(1, Number(e.target.value)))}
                      className="w-16 text-right bg-transparent focus:outline-none"
                    />
                    <span>%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={18.0}
                  step={0.25}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1.0% (Subsidized)</span>
                  <span>8.5% (Standard)</span>
                  <span>18.0%</span>
                </div>
              </div>

              {/* Slider 3: Loan Tenure */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Tenure (Years)</span>
                  <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-mono font-bold text-[#142B4A]">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
                      className="w-12 text-right bg-transparent focus:outline-none"
                    />
                    <span>Yrs</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#142B4A]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 Year ({12} Mos)</span>
                  <span>10 Years</span>
                  <span>20 Years ({240} Mos)</span>
                </div>
              </div>

              {/* Tenure Quick Buttons */}
              <div className="flex items-center gap-1.5 pt-2">
                <span className="text-[11px] text-slate-500 mr-1">Quick Select:</span>
                {[1, 3, 5, 7, 10, 15].map(y => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setTenureYears(y)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                      tenureYears === y
                        ? 'bg-[#142B4A] text-white border-[#142B4A]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {y}Y
                  </button>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Visual EMI Breakdown Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#142B4A] to-[#0A192F] text-white rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Estimated Monthly Repayment
                </span>
                
                <div className="mt-3">
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
                    ₹{emiData.monthlyEMI.toLocaleString('en-IN')}
                    <span className="text-sm font-normal text-blue-200"> / month</span>
                  </div>
                  <p className="text-[11px] text-blue-200 mt-1">
                    Equated Monthly Installment for {tenureYears * 12} continuous months
                  </p>
                </div>

                {/* Progress bar split */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-400">Principal: {emiData.principalPercent}%</span>
                    <span className="text-amber-300">Interest: {emiData.interestPercent}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden flex">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${emiData.principalPercent}%` }}
                    />
                    <div 
                      className="bg-amber-400 h-full transition-all duration-300"
                      style={{ width: `${emiData.interestPercent}%` }}
                    />
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="mt-6 space-y-3 divide-y divide-white/10 text-xs">
                  <div className="flex justify-between pt-2">
                    <span className="text-blue-200">Principal Loan Amount</span>
                    <span className="font-mono font-bold text-white">
                      ₹{loanAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-blue-200">Total Interest Payable</span>
                    <span className="font-mono font-bold text-amber-300">
                      ₹{emiData.totalInterest.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-blue-200">Total Amount Payable</span>
                    <span className="font-mono font-extrabold text-emerald-300 text-sm">
                      ₹{emiData.totalPayment.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link to Government Schemes */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveCustomerTab('schemes')}
                  className="w-full py-2.5 text-xs font-bold text-[#142B4A] bg-white hover:bg-blue-50 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Subsidized Government Schemes</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                </button>
                <div className="text-[10px] text-blue-200 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Official subsidized schemes can reduce your effective interest rate down to 4.0%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: ORIGINAL CITIZEN PROFILE SCHEME MATCHER */}
      {activeMode === 'finder' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
            {/* Step 1: Profile Category */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Select Citizen Profile
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {profileOptions.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProfileCategory(p.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      profileCategory === p.id 
                        ? 'border-[#2563EB] bg-blue-50/70 ring-2 ring-blue-500/20' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#142B4A]">{p.title}</span>
                      {profileCategory === p.id && (
                        <div className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Purpose */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. Credit / Assistance Purpose
              </label>
              <div className="flex flex-wrap gap-2">
                {purposeOptions.map(pur => (
                  <button
                    key={pur.id}
                    type="button"
                    onClick={() => setPurpose(pur.id)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      purpose === pur.id
                        ? 'bg-[#142B4A] text-white border-[#142B4A] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {pur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Geographic Scope */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                3. Jurisdiction / Geographic Scope
              </label>
              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: 'All Schemes (Central + Karnataka)' },
                  { id: 'central', label: 'Central Government Only' },
                  { id: 'karnataka', label: 'Karnataka State Schemes Only' },
                ].map(scope => (
                  <button
                    key={scope.id}
                    type="button"
                    onClick={() => setSchemeScope(scope.id as any)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      schemeScope === scope.id
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {scope.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Found <strong>{matchedSchemes.length}</strong> matching government schemes
              </span>
              <button
                type="button"
                onClick={handleMatch}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1E3A8A] rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Find Tailored Schemes</span>
              </button>
            </div>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#142B4A]">
                Recommended Schemes For Your Profile ({matchedSchemes.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedSchemes.map(scheme => (
                  <div key={scheme.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {scheme.categoryLabel}
                      </span>
                      {scheme.isStateScheme && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Karnataka
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#142B4A]">{scheme.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{scheme.department}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-950 font-mono font-bold text-xs border border-emerald-200">
                      {scheme.loanOrSubsidyAmount || scheme.financialBenefits}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{scheme.description}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveCustomerTab('schemes')}
                        className="text-xs font-bold text-[#2563EB] hover:underline"
                      >
                        View Full Dossier
                      </button>
                      <a
                        href={scheme.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-bold text-[#142B4A] hover:underline"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3 text-[#2563EB]" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
