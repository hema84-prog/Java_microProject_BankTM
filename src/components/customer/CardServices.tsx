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
  XCircle, 
  ChevronRight, 
  TrendingUp,
  FileText,
  User,
  Calendar,
  Layers,
  CheckSquare,
  Square,
  Lock,
  Unlock,
  Eye,
  Building2
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { CardNetwork, CardType, CardApplicationStatus, CardApplication } from '../../types';
import { CardApplicationModal } from '../common/CardApplicationModal';

interface CardServicesProps {
  initialTab?: 'my_cards' | 'apply' | 'applications' | 'apply_debit' | 'apply_credit';
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

  const [activeTab, setActiveTab] = useState<'my_cards' | 'apply' | 'applications'>(
    initialTab === 'apply_debit' || initialTab === 'apply_credit' ? 'apply' : initialTab
  );
  const [applyType, setApplyType] = useState<CardType>(
    initialTab === 'apply_credit' ? 'credit' : 'debit'
  );

  // Common Manual Bank Card Form State (Form AOF-CRD)
  const [selectedAccount, setSelectedAccount] = useState<string>(customerAccounts[0]?.accountNumber || '');
  const [selectedNetwork, setSelectedNetwork] = useState<CardNetwork>('RuPay');
  const [embossedName, setEmbossedName] = useState<string>(currentCustomer?.fullName?.toUpperCase() || '');
  const [fatherOrMotherName, setFatherOrMotherName] = useState<string>('Krishnamurthy Sharma');
  const [dateOfBirth, setDateOfBirth] = useState<string>('2008-05-10'); // Default youth/adult
  const [gender, setGender] = useState<'Male' | 'Female' | 'Third Gender'>('Male');
  const [panNumber, setPanNumber] = useState<string>('ABCPS8192K');
  const [aadhaarNumber, setAadhaarNumber] = useState<string>('4829 1049 8812');
  const [contactMobile, setContactMobile] = useState<string>(currentCustomer?.mobile || '+91 98450 12345');
  const [contactEmail, setContactEmail] = useState<string>(currentCustomer?.email || 'customer@example.in');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(currentCustomer?.address || '#42, 3rd Cross, Indiranagar, Bengaluru, Karnataka - 560038');
  
  // Channels
  const [enableAtm, setEnableAtm] = useState<boolean>(true);
  const [enablePos, setEnablePos] = useState<boolean>(true);
  const [enableOnline, setEnableOnline] = useState<boolean>(true);
  const [enableContactless, setEnableContactless] = useState<boolean>(true);
  const [enableInternational, setEnableInternational] = useState<boolean>(false);

  // Mandatory Reason for Applying (with specific 18-year-old option)
  const [reasonForApplying, setReasonForApplying] = useState<string>('Applying for the first time at 18 years of age.');

  // Credit Specific Form State
  const [employmentCategory, setEmploymentCategory] = useState<'salaried' | 'self_employed' | 'business' | 'student' | 'agricultural'>('salaried');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(65000);
  const [employerName, setEmployerName] = useState<string>('Apex Cloud Solutions India Pvt Ltd');
  const [requestedLimit, setRequestedLimit] = useState<number>(100000);
  const [existingCreditCards, setExistingCreditCards] = useState<string>('None / First Credit Card Requisition');

  // Declaration
  const [declarationAccepted, setDeclarationAccepted] = useState<boolean>(true);

  // Feedback & Dossier Modal
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedDossierApp, setSelectedDossierApp] = useState<CardApplication | null>(null);

  // Quick Preset Reasons for Applying - Explicitly includes 18 years of age requirement!
  const reasonPresets = [
    'Applying for the first time at 18 years of age.',
    'Primary contactless card for everyday ATM & merchant transactions',
    'Salary account mandate / Corporate payroll requirement',
    'Upgrade to RuPay Platinum with complimentary airport lounge access',
    'Replacement card for damaged or expiring magnetic chip card',
    'International contactless travel & foreign currency e-commerce payments',
    'Dedicated high-limit card for monthly business and vendor expenses',
    'Student campus allowance & educational fee payments'
  ];

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedAccount) {
      setMessage({ type: 'error', text: 'Please select a linked bank account.' });
      return;
    }

    if (!reasonForApplying.trim()) {
      setMessage({ type: 'error', text: 'Please provide a valid reason for applying.' });
      return;
    }

    if (!declarationAccepted) {
      setMessage({ type: 'error', text: 'Please acknowledge the statutory applicant declaration.' });
      return;
    }

    const physicalFormDetails: Partial<CardApplication> = {
      nameOnCard: embossedName.trim().toUpperCase() || currentCustomer?.fullName?.toUpperCase(),
      dateOfBirth,
      gender,
      fatherOrMotherName: fatherOrMotherName.trim(),
      panNumber: panNumber.trim().toUpperCase(),
      aadhaarNumber: aadhaarNumber.trim(),
      contactMobile: contactMobile.trim(),
      contactEmail: contactEmail.trim(),
      enableAtmCash: enableAtm,
      enablePosMerchant: enablePos,
      enableOnlineEcommerce: enableOnline,
      enableContactlessNfc: enableContactless,
      enableInternational,
      declarationAccepted: true,
      existingCreditCards: applyType === 'credit' ? existingCreditCards : undefined,
    };

    if (applyType === 'debit') {
      const res = applyDebitCard(
        selectedAccount, 
        selectedNetwork, 
        deliveryAddress, 
        reasonForApplying.trim(),
        physicalFormDetails
      );
      if (res.success) {
        setMessage({ 
          type: 'success', 
          text: `Official Debit Card Application (${res.applicationId}) submitted successfully under Form AOF-CRD! Status is now Pending Review. You can track real-time administrator decisions in the Applications Tracker.` 
        });
        setTimeout(() => setActiveTab('applications'), 1500);
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    } else {
      const res = applyCreditCard(
        selectedAccount,
        selectedNetwork,
        employmentCategory,
        Number(monthlyIncome),
        employerName.trim() || 'Self / Private Enterprise',
        Number(requestedLimit),
        deliveryAddress,
        reasonForApplying.trim(),
        physicalFormDetails
      );
      if (res.success) {
        setMessage({ 
          type: 'success', 
          text: `Official Credit Card Application (${res.applicationId}) submitted successfully under Form AOF-CRD! Status is now Pending Review. Underwriter assessment in progress.` 
        });
        setTimeout(() => setActiveTab('applications'), 1500);
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    }
  };

  const getStatusBadge = (status: CardApplicationStatus) => {
    switch (status) {
      case 'approved':
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approved</span>
          </span>
        );
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Dispatched</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Rejected</span>
          </span>
        );
      case 'pending':
      case 'submitted':
      case 'under_review':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            {activeTab === 'my_cards' 
              ? 'Active Cards & Card Services' 
              : activeTab === 'apply' 
              ? 'Debit & Credit Card Application Center' 
              : 'Card Applications & Real-Time Tracking'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Official Form AOF-CRD Requisition System · EMV Contactless Chip RuPay, Visa, and Mastercard
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('my_cards'); setMessage(null); }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'my_cards' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Cards
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('apply'); setMessage(null); }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'apply' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Apply for Card (Form AOF-CRD)
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('applications'); setMessage(null); }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'applications' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Applications Tracker</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'applications' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {customerCardApplications.length}
            </span>
          </button>
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

      {/* VIEW 1: ACTIVE CARDS */}
      {activeTab === 'my_cards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#142B4A] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#2563EB]" />
              <span>Issued Active Cards Linked to Your Account</span>
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('apply')}
              className="text-xs font-bold text-[#2563EB] hover:underline"
            >
              + Apply for Supplementary Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary RuPay Platinum Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="bg-gradient-to-tr from-[#0F2027] via-[#203A43] to-[#2C5364] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-44 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="font-bold tracking-widest text-xs uppercase text-emerald-400">BankTM Platinum</span>
                  <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded">RuPay</span>
                </div>
                <div className="w-8 h-6 bg-amber-400/80 rounded-sm flex items-center justify-center">
                  <div className="w-5 h-4 border border-amber-600/40 rounded-xs" />
                </div>
                <div>
                  <div className="font-mono text-base tracking-widest text-slate-100">
                    6074 •••• •••• 9214
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px]">
                    <span className="font-bold tracking-wide uppercase truncate max-w-[150px]">
                      {currentCustomer?.fullName}
                    </span>
                    <span className="font-mono text-blue-200">EXP 11/31</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Linked Account</span>
                  <span className="font-mono font-bold text-[#142B4A]">{customerAccounts[0]?.accountNumber || 'Acc. Ending in 1001'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Card Status</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active & Unfrozen
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Domestic POS & ATM Limit</span>
                  <span className="font-mono font-semibold text-slate-700">₹1,00,000 / day</span>
                </div>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider block">
                  Need an Additional Card or Higher Limit?
                </span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  You can apply for supplementary RuPay, Visa Signature, or Mastercard World cards linked directly to your operational savings or current accounts.
                </p>
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>EMV Contactless Chip protection on all cards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Dedicated options for 18-year-old first-time cardholders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Up to ₹5,00,000 credit card limits on eligible profiles</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('apply')}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1E3A8A] rounded-xl transition-colors cursor-pointer text-center"
              >
                Open Official Card Application Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: AUTHENTIC MANUAL BANK APPLICATION FORM (FORM AOF-CRD) */}
      {activeTab === 'apply' && (
        <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          
          {/* Bank Form Official Header Seal */}
          <div className="border-b-2 border-slate-200 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#142B4A] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  TM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-[#2563EB] text-[10px] font-mono font-bold tracking-widest uppercase">
                      FORM AOF-CRD (REV. 2026/04)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">CONFIDENTIAL BANKING APPLICATION</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-[#142B4A] tracking-tight mt-0.5">
                    Official Application Form for Issuance of Debit / Credit Card
                  </h3>
                  <p className="text-xs text-slate-500">
                    Governed by Reserve Bank of India Master Directions on Payment Cards
                  </p>
                </div>
              </div>

              {/* Card Type Selector (Segmented Bank Switch) */}
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setApplyType('debit')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    applyType === 'debit' 
                      ? 'bg-[#142B4A] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  DEBIT CARD REQUISITION
                </button>
                <button
                  type="button"
                  onClick={() => setApplyType('credit')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    applyType === 'credit' 
                      ? 'bg-[#142B4A] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  CREDIT CARD REQUISITION
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitApplication} className="space-y-6">
            
            {/* SECTION A: APPLICANT PERSONAL & KYC PARTICULARS */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2563EB]" />
                  Section A: Applicant Personal & KYC Particulars (In Block Letters)
                </span>
                <span className="text-[10px] font-mono text-slate-500">Cust ID: {currentCustomer?.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    value={currentCustomer?.fullName || ''}
                    readOnly
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-100 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Name to be Embossed on Card (Max 21 Chars) *
                  </label>
                  <input
                    type="text"
                    maxLength={21}
                    value={embossedName}
                    onChange={(e) => setEmbossedName(e.target.value.toUpperCase())}
                    placeholder="e.g. RAJESH K SHARMA"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white font-mono uppercase text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Father's / Mother's / Spouse's Full Name *
                  </label>
                  <input
                    type="text"
                    value={fatherOrMotherName}
                    onChange={(e) => setFatherOrMotherName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Date of Birth (YYYY-MM-DD) *
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Third Gender">Third Gender</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Income Tax PAN Card Number *
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCPS8192K"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white font-mono uppercase text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Aadhaar Number (12 Digits) *
                  </label>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="e.g. 4829 1049 8812"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Registered Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={contactMobile}
                    onChange={(e) => setContactMobile(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: BANK ACCOUNT & BRANCH DETAILS */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#2563EB]" />
                  Section B: Linked Settlement Account & Home Branch
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Primary Operational Bank Account to Link *
                  </label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800 font-mono"
                  >
                    {customerAccounts.map(a => (
                      <option key={a.accountNumber} value={a.accountNumber}>
                        {a.accountType.toUpperCase()} - {a.accountNumber} (Available Balance: ₹{a.balance.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Issuing Branch & Clearing Routing
                  </label>
                  <input
                    type="text"
                    value="Indiranagar Branch, Bengaluru (IFSC: BTMN000104)"
                    readOnly
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-100 text-slate-700 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* SECTION C: CARD NETWORK & CHANNEL SELECTION */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#2563EB]" />
                  Section C: Card Network & Channel Authorization
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setSelectedNetwork('RuPay')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedNetwork === 'RuPay' 
                      ? 'border-[#2563EB] bg-blue-50/50 ring-1 ring-[#2563EB]' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#142B4A]">RuPay Platinum</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Govt & Lounge</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Zero annual maintenance on savings accounts. Domestic airport lounge access included.</p>
                </div>

                <div
                  onClick={() => setSelectedNetwork('Visa')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedNetwork === 'Visa' 
                      ? 'border-[#2563EB] bg-blue-50/50 ring-1 ring-[#2563EB]' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#142B4A]">Visa Signature</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">Global</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Accepted worldwide at over 40 million merchants & online global payment gateways.</p>
                </div>

                <div
                  onClick={() => setSelectedNetwork('Mastercard')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedNetwork === 'Mastercard' 
                      ? 'border-[#2563EB] bg-blue-50/50 ring-1 ring-[#2563EB]' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#142B4A]">Mastercard World</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">Travel</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Comprehensive travel insurance and round-the-clock international concierge assistance.</p>
                </div>
              </div>

              {/* Channel Authorization Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Transaction Channels Mandate (You can adjust limits later):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enableAtm} 
                      onChange={(e) => setEnableAtm(e.target.checked)}
                      className="accent-[#2563EB] w-4 h-4" 
                    />
                    <span className="text-xs font-medium text-slate-700">ATM Cash</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enablePos} 
                      onChange={(e) => setEnablePos(e.target.checked)}
                      className="accent-[#2563EB] w-4 h-4" 
                    />
                    <span className="text-xs font-medium text-slate-700">POS Swipes</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enableOnline} 
                      onChange={(e) => setEnableOnline(e.target.checked)}
                      className="accent-[#2563EB] w-4 h-4" 
                    />
                    <span className="text-xs font-medium text-slate-700">Online E-Com</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enableContactless} 
                      onChange={(e) => setEnableContactless(e.target.checked)}
                      className="accent-[#2563EB] w-4 h-4" 
                    />
                    <span className="text-xs font-medium text-slate-700">Contactless NFC</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enableInternational} 
                      onChange={(e) => setEnableInternational(e.target.checked)}
                      className="accent-[#2563EB] w-4 h-4" 
                    />
                    <span className="text-xs font-medium text-slate-700">International</span>
                  </label>
                </div>
              </div>
            </div>

            {/* SECTION D: REASON FOR APPLICATION (MANDATORY REQUIREMENT) */}
            <div className="bg-[#F8FAFC] border-2 border-blue-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  Section D: Reason for Application (Select or Type Specific Rationale) *
                </span>
                <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-100 px-2 py-0.5 rounded">
                  Mandatory Field
                </span>
              </div>

              {/* Special Badge if 18-Year Reason Selected */}
              {reasonForApplying.includes('18 years of age') && (
                <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg text-xs text-blue-900 flex items-center gap-2 font-medium">
                  <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span>
                    Priority Adult Requisition: First-time bank card issued upon attaining 18 years of age. Instant standard issuance without CIBIL bureau history check.
                  </span>
                </div>
              )}

              {/* Preset Selector Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Click a standard banking reason preset:
                </span>
                <div className="flex flex-wrap gap-2">
                  {reasonPresets.map((preset, idx) => {
                    const isSelected = reasonForApplying === preset;
                    const is18 = preset.includes('18 years of age');
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReasonForApplying(preset)}
                        className={`px-3 py-1.5 text-xs rounded-lg border text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? is18
                              ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                              : 'bg-[#142B4A] text-white border-[#142B4A] font-semibold shadow-xs'
                            : is18
                            ? 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100 font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {is18 && <Sparkles className="w-3.5 h-3.5" />}
                        <span>{preset}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editable Textarea for Customization */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Applicant Declaration of Reason:
                </label>
                <textarea
                  rows={2}
                  value={reasonForApplying}
                  onChange={(e) => setReasonForApplying(e.target.value)}
                  placeholder="State your exact reason for requesting this payment card..."
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* SECTION E: EMPLOYMENT & FINANCIAL PARTICULARS (FOR CREDIT CARDS) */}
            {applyType === 'credit' && (
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#2563EB]" />
                    Section E: Credit Underwriting & Income Evaluation
                  </span>
                  <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-bold">
                    Underwriting Form
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Employment / Occupation Category *
                    </label>
                    <select
                      value={employmentCategory}
                      onChange={(e) => setEmploymentCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                    >
                      <option value="salaried">Salaried (Government / Reputed Corporate)</option>
                      <option value="self_employed">Self-Employed Professional (Doctor, CA, Lawyer, Engineer)</option>
                      <option value="business">Business Proprietor / MSME Trader</option>
                      <option value="student">Student / 18+ Youth Banking</option>
                      <option value="agricultural">Agricultural Cultivator / Dairy Farmer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Employer, Institution or Business Name *
                    </label>
                    <input
                      type="text"
                      value={employerName}
                      onChange={(e) => setEmployerName(e.target.value)}
                      placeholder="e.g. Apex Software Technologies"
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Monthly Net Take-Home Salary / Income (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">₹</span>
                      <input
                        type="number"
                        min={15000}
                        step={5000}
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                        required
                        className="w-full pl-7 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Requested Revolving Credit Limit (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">₹</span>
                      <input
                        type="number"
                        min={25000}
                        max={1000000}
                        step={10000}
                        value={requestedLimit}
                        onChange={(e) => setRequestedLimit(Number(e.target.value))}
                        required
                        className="w-full pl-7 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono font-bold text-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Existing Credit Cards / Credit Facilities in Other Banks
                    </label>
                    <input
                      type="text"
                      value={existingCreditCards}
                      onChange={(e) => setExistingCreditCards(e.target.value)}
                      placeholder="e.g. HDFC Bank Millennia (Limit ₹1,00,000) or None"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION F: DELIVERY ADDRESS */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-3">
              <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2563EB]" />
                Section F: Card Dispatch & Communication Address
              </span>
              <p className="text-[11px] text-slate-500">
                The card welcome kit, EMV chip card, and confidential PIN advice will be dispatched via India Post Speed Post.
              </p>
              <textarea
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
              />
            </div>

            {/* SECTION G: STATUTORY APPLICANT DECLARATION */}
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  required
                  className="mt-0.5 w-4 h-4 text-[#2563EB] accent-[#2563EB] shrink-0"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  <strong>Statutory Applicant Undertaking:</strong> I declare that all particulars entered in this Form AOF-CRD are true, correct, and verified. I confirm that I am an Indian resident and have attained majority (18+ years of age) or am applying under legal youth banking rules. I agree to abide by the BankTM Terms & Conditions, Schedule of Charges, and RBI Master Directions on Payment Cards.
                </span>
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                <span>Applicant Digital Signature: {currentCustomer?.fullName}</span>
                <span>Submission Date: {new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            {/* Submission Actions */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('applications')}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-center"
              >
                Cancel & View Submitted Applications
              </button>

              <button
                type="submit"
                className="px-8 py-3 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Official Form (AOF-CRD) for Bank Approval</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: SUBMITTED APPLICATIONS & REAL-TIME TRACKER */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-[#142B4A]">
                Your Submitted Card Applications & Real-Time Decision Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Review your full submitted physical requisition forms (AOF-CRD) and track underwriter decisions
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('apply')}
              className="px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition-colors self-start sm:self-auto cursor-pointer"
            >
              + Submit Another Application
            </button>
          </div>

          {customerCardApplications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-800 text-sm">No card applications submitted yet</p>
              <p className="text-xs mt-1">Apply for a Debit or Credit card using the official bank form.</p>
              <button
                type="button"
                onClick={() => setActiveTab('apply')}
                className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#142B4A] rounded-xl hover:bg-[#1E3A8A]"
              >
                Open Application Form
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {customerCardApplications.map((app) => (
                <div key={app.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 hover:border-blue-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        app.cardType === 'debit' ? 'bg-blue-50 text-[#2563EB]' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {app.cardType === 'debit' ? <CreditCard className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#142B4A]">{app.cardNetwork} {app.cardType.toUpperCase()} CARD</span>
                          <span className="text-[11px] font-mono text-slate-400">({app.id})</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Applicant: <strong className="text-slate-800">{app.customerName}</strong> · Account: <strong className="font-mono text-slate-700">{app.accountNumber}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {getStatusBadge(app.status)}
                      <button
                        type="button"
                        onClick={() => setSelectedDossierApp(app)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#142B4A] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>View Full Form (AOF-CRD)</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Name on Card</span>
                      <span className="font-semibold text-slate-800 uppercase font-mono">{app.nameOnCard || app.customerName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Linked Account</span>
                      <span className="font-mono font-semibold text-slate-800">{app.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Card Type & Network</span>
                      <span className="font-semibold text-[#142B4A] uppercase">{app.cardType} ({app.cardNetwork})</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Submission Date</span>
                      <span className="font-mono text-slate-700">{new Date(app.submittedAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Reason for Applying */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Reason for Application</span>
                    <p className="text-slate-800 font-semibold leading-relaxed">
                      "{app.reasonForApplying || 'Standard Account Opening Card Application'}"
                    </p>
                    {app.reasonForApplying?.includes('18 years of age') && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <Sparkles className="w-3 h-3" />
                        First-time card application upon attaining 18 years
                      </span>
                    )}
                  </div>

                  {/* Dispatch / Remarks info */}
                  {app.remarks && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong>Administrator / Underwriter Remarks:</strong> {app.remarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full Physical Form Dossier Modal */}
      <CardApplicationModal
        application={selectedDossierApp}
        onClose={() => setSelectedDossierApp(null)}
      />
    </div>
  );
};
