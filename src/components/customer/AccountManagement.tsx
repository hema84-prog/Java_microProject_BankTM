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
  Info,
  User,
  MapPin,
  Briefcase,
  FileText,
  Eye,
  CheckSquare,
  Square
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AccountType, AccountApplication } from '../../types';
import { AccountApplicationModal } from '../common/AccountApplicationModal';

export const AccountManagement: React.FC<{ initialMode?: 'list' | 'open' }> = ({ initialMode = 'list' }) => {
  const { 
    currentCustomer,
    customerAccounts, 
    accountApplications, 
    applyNewAccount, 
    setActiveCustomerTab,
    setSelectedAccountNumber,
    t 
  } = useBanking();

  const [activeView, setActiveView] = useState<'list' | 'open'>(initialMode);
  
  // Section 1: Account Type & Branch
  const [accountType, setAccountType] = useState<AccountType>('savings');
  const [initialDeposit, setInitialDeposit] = useState<number>(1000);
  const [branch, setBranch] = useState<string>('Indiranagar Branch, Bengaluru');

  // Section 2: Personal & KYC Particulars
  const [applicantPrefix, setApplicantPrefix] = useState<'Mr.' | 'Ms.' | 'Mrs.' | 'Dr.'>('Mr.');
  const [fullName, setFullName] = useState<string>(currentCustomer?.fullName || 'Rajesh K. Sharma');
  const [fatherOrSpouseName, setFatherOrSpouseName] = useState<string>('Krishnamurthy Sharma');
  const [motherName, setMotherName] = useState<string>('Lakshmi Sharma');
  const [dateOfBirth, setDateOfBirth] = useState<string>('1990-08-14');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Third Gender'>('Male');
  const [nationality, setNationality] = useState<string>('Indian');
  const [maritalStatus, setMaritalStatus] = useState<'Single' | 'Married' | 'Other'>('Married');
  const [panNumber, setPanNumber] = useState<string>('ABCPS8192K');
  const [aadhaarNumber, setAadhaarNumber] = useState<string>('4829 1049 8812');

  // Section 3: Contact & Address
  const [customerMobile, setCustomerMobile] = useState<string>(currentCustomer?.mobile || '+91 98450 12345');
  const [customerEmail, setCustomerEmail] = useState<string>(currentCustomer?.email || 'rajesh.sharma@example.in');
  const [residentialAddress, setResidentialAddress] = useState<string>(currentCustomer?.address || '#42, 3rd Cross, Indiranagar');
  const [city, setCity] = useState<string>('Bengaluru');
  const [state, setState] = useState<string>('Karnataka');
  const [pinCode, setPinCode] = useState<string>('560038');
  const [communicationAddressSame, setCommunicationAddressSame] = useState<boolean>(true);
  const [communicationAddress, setCommunicationAddress] = useState<string>('');

  // Section 4: Occupation & Income
  const [occupationType, setOccupationType] = useState<string>('Salaried (Private / Public Sector)');
  const [annualIncome, setAnnualIncome] = useState<string>('₹5,00,000 - ₹10,00,000');
  const [sourceOfFunds, setSourceOfFunds] = useState<string>('Salary Remittance & Professional Services');

  // Section 5: Facilities Requested
  const [reqDebitCard, setReqDebitCard] = useState<boolean>(true);
  const [reqChequeBook, setReqChequeBook] = useState<boolean>(true);
  const [reqNetBanking, setReqNetBanking] = useState<boolean>(true);
  const [reqSmsAlerts, setReqSmsAlerts] = useState<boolean>(true);
  const [reqPassbook, setReqPassbook] = useState<boolean>(true);

  // Section 6: Nominee Details (Form DA-1)
  const [nomineeName, setNomineeName] = useState<string>('Sita R. Sharma');
  const [nomineeRelationship, setNomineeRelationship] = useState<string>('Spouse');
  const [nomineeAgeOrDob, setNomineeAgeOrDob] = useState<string>('32 Years');
  const [nomineeAddress, setNomineeAddress] = useState<string>('#42, 3rd Cross, Indiranagar, Bengaluru - 560038');

  // Section 7: Declaration
  const [declarationAccepted, setDeclarationAccepted] = useState<boolean>(true);

  // Messages & Modal
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedDossierApp, setSelectedDossierApp] = useState<AccountApplication | null>(null);

  const handleSubmitOpen = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!declarationAccepted) {
      setMessage({ type: 'error', text: 'Please accept the statutory applicant declaration.' });
      return;
    }

    const physicalAofDetails: Partial<AccountApplication> = {
      applicantPrefix,
      customerName: fullName.trim(),
      customerMobile: customerMobile.trim(),
      customerEmail: customerEmail.trim(),
      fatherOrSpouseName: fatherOrSpouseName.trim(),
      motherName: motherName.trim(),
      dateOfBirth,
      gender,
      nationality,
      maritalStatus,
      panNumber: panNumber.trim().toUpperCase(),
      aadhaarNumber: aadhaarNumber.trim(),
      occupationType,
      annualIncome,
      sourceOfFunds,
      residentialAddress: residentialAddress.trim(),
      city: city.trim(),
      state: state.trim(),
      pinCode: pinCode.trim(),
      communicationAddressSame,
      communicationAddress: communicationAddressSame ? undefined : communicationAddress.trim(),
      facilitiesRequested: {
        debitCard: reqDebitCard,
        chequeBook: reqChequeBook,
        netBanking: reqNetBanking,
        smsAlerts: reqSmsAlerts,
        passbook: reqPassbook,
      },
      nomineeDetails: {
        name: nomineeName.trim(),
        relationship: nomineeRelationship.trim(),
        ageOrDob: nomineeAgeOrDob.trim(),
        address: nomineeAddress.trim() || residentialAddress.trim(),
        isMinor: false,
      },
      declarationAccepted: true,
    };

    const res = applyNewAccount(accountType, Number(initialDeposit), branch, physicalAofDetails);
    if (res.success) {
      setMessage({ 
        type: 'success', 
        text: `Official Account Opening Form (${res.applicationId}) submitted successfully under Form AOF-01! It has been dispatched to the branch administrator for KYC verification and account ledger provisioning.` 
      });
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
            {activeView === 'list' ? t.navMyAccounts : 'Official Account Opening Portal (Form AOF-01)'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your operational bank accounts or submit a manual-style Account Opening Form under RBI guidelines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setActiveView('list'); setMessage(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeView === 'open'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Open New Account (AOF-01)</span>
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
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#2563EB] hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
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
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
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
                      className="px-2.5 py-1.5 text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
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
                    className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Passbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submitted Account Applications with Dossier View */}
          {accountApplications.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-[#142B4A] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Submitted Account Opening Forms (Form AOF-01 Records)</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Total applications: {accountApplications.length}
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {accountApplications.map((app) => (
                  <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {app.accountType === 'savings' ? 'Savings Bank Account Application' : 'Current Account Application'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">({app.id})</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Applicant: <strong className="text-slate-700">{app.customerName}</strong> · Initial Deposit: <strong className="font-mono text-slate-800">₹{app.initialDeposit.toLocaleString('en-IN')}</strong> · Branch: {app.branch}
                      </div>
                      {app.remarks && (
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200/60 inline-block">
                          Branch Status Note: {app.remarks}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm font-semibold shrink-0 ${
                        app.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : app.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {app.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedDossierApp(app)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#142B4A] bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>View Full AOF Form</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* OPEN NEW ACCOUNT - AUTHENTIC MANUAL BANK FORM (FORM AOF-01) */
        <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          
          {/* Form Header Official Seal */}
          <div className="border-b-2 border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#142B4A] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                TM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#2563EB] text-[10px] font-mono font-bold tracking-widest uppercase">
                    FORM AOF-01 (REV. 2026/04)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">RESERVE BANK OF INDIA COMPLIANT</span>
                </div>
                <h3 className="font-extrabold text-lg text-[#142B4A] tracking-tight mt-0.5">
                  Comprehensive Account Opening Form for Resident Individuals & Sole Proprietors
                </h3>
                <p className="text-xs text-slate-500">
                  Please fill all mandatory particulars. All documents will be verified under Prevention of Money Laundering Act (PMLA).
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitOpen} className="space-y-6">
            
            {/* SECTION 1: ACCOUNT TYPE & HOME BRANCH */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#2563EB]" />
                  Section 1: Account Category, Initial Deposit & Home Branch Mandate
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142B4A] mb-2">
                  Account Scheme Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => { setAccountType('savings'); setInitialDeposit(Math.max(initialDeposit, 1000)); }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      accountType === 'savings'
                        ? 'border-[#2563EB] bg-blue-50/50 ring-1 ring-[#2563EB]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#142B4A]">Savings Bank Account (SB)</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        7.10% Annual Interest
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      For personal finances, salaried earnings, and DBT welfare subsidies. Minimum operational balance: ₹1,000.
                    </p>
                  </div>

                  <div
                    onClick={() => { setAccountType('current'); setInitialDeposit(Math.max(initialDeposit, 5000)); }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      accountType === 'current'
                        ? 'border-[#2563EB] bg-blue-50/50 ring-1 ring-[#2563EB]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#142B4A]">Commercial Current Account (CA)</span>
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                        ₹50,000 Overdraft
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Tailored for MSME traders, business entities, and sole proprietors. Unlimited RTGS/NEFT clearing. Minimum initial deposit: ₹5,000.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Initial Opening Funding Deposit (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">₹</span>
                    <input
                      type="number"
                      min={accountType === 'savings' ? 1000 : 5000}
                      step="500"
                      value={initialDeposit}
                      onChange={(e) => setInitialDeposit(Number(e.target.value))}
                      required
                      className="w-full pl-7 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white font-mono font-bold text-slate-900"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {accountType === 'savings' ? 'Minimum opening deposit: ₹1,000' : 'Minimum opening deposit: ₹5,000'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Preferred BankTM Home Branch *
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-800"
                  >
                    <option value="Indiranagar Branch, Bengaluru">Indiranagar Branch, Bengaluru (IFSC: BTMN000104)</option>
                    <option value="MG Road Main Branch, Bengaluru">MG Road Main Branch, Bengaluru (IFSC: BTMN000101)</option>
                    <option value="Jayanagar Branch, Bengaluru">Jayanagar Branch, Bengaluru (IFSC: BTMN000108)</option>
                    <option value="Mysuru City Branch">Mysuru City Branch (IFSC: BTMN000201)</option>
                    <option value="Hubballi Commercial Hub">Hubballi Commercial Hub (IFSC: BTMN000301)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: APPLICANT PERSONAL & KYC PARTICULARS */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2563EB]" />
                  Section 2: Personal Identification & KYC Particulars (In Block Letters)
                </span>
                <span className="text-[10px] font-mono text-slate-500">Form 60 / PAN Mandatory</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                  <select
                    value={applicantPrefix}
                    onChange={(e) => setApplicantPrefix(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Full Legal Name (as per Aadhaar / PAN) *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white font-bold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Father's / Spouse's Full Name *
                  </label>
                  <input
                    type="text"
                    value={fatherOrSpouseName}
                    onChange={(e) => setFatherOrSpouseName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Mother's Maiden Name *
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Third Gender">Third Gender</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">Nationality *</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">Marital Status</label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
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
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono uppercase font-bold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Aadhaar Number (UIDAI 12-Digits) *
                  </label>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="e.g. 4829 1049 8812"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: CONTACT & ADDRESS PARTICULARS */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2563EB]" />
                  Section 3: Contact & Address Information
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Mobile Number for SMS OTP & Alerts *
                  </label>
                  <input
                    type="tel"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Email Address for E-Statements *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">
                    Permanent Residential Address (House/Flat No, Street, Locality) *
                  </label>
                  <textarea
                    rows={2}
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">City / Town *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">State & PIN Code *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="PIN"
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={communicationAddressSame}
                      onChange={(e) => setCommunicationAddressSame(e.target.checked)}
                      className="w-4 h-4 text-[#2563EB] accent-[#2563EB]"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      Communication / Mailing Address is same as Permanent Residence
                    </span>
                  </label>

                  {!communicationAddressSame && (
                    <div className="mt-2">
                      <textarea
                        rows={2}
                        placeholder="Enter full communication address if different..."
                        value={communicationAddress}
                        onChange={(e) => setCommunicationAddress(e.target.value)}
                        required={!communicationAddressSame}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 4: OCCUPATION, INCOME & SOURCE OF FUNDS */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#2563EB]" />
                  Section 4: Occupation, Income & Source of Funds
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">Occupation Type *</label>
                  <select
                    value={occupationType}
                    onChange={(e) => setOccupationType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Salaried (Private / Public Sector)">Salaried (Private / Public Sector)</option>
                    <option value="Business / Trader">Business / Trader</option>
                    <option value="Self-Employed Professional">Self-Employed Professional (Doctor, Lawyer, CA)</option>
                    <option value="Student / Youth">Student / Youth</option>
                    <option value="Agriculturist / Cultivator">Agriculturist / Cultivator</option>
                    <option value="Retired Personnel">Retired Personnel</option>
                    <option value="Homemaker">Homemaker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">Annual Gross Income *</label>
                  <select
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Up to ₹2,50,000">Up to ₹2,50,000</option>
                    <option value="₹2,50,001 - ₹5,00,000">₹2,50,001 - ₹5,00,000</option>
                    <option value="₹5,00,001 - ₹10,00,000">₹5,00,001 - ₹10,00,000</option>
                    <option value="₹10,00,001 - ₹25,00,000">₹10,00,001 - ₹25,00,000</option>
                    <option value="Above ₹25,00,000">Above ₹25,00,000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">Source of Funds *</label>
                  <input
                    type="text"
                    value={sourceOfFunds}
                    onChange={(e) => setSourceOfFunds(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: BANKING FACILITIES MANDATE */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-3">
              <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider block">
                Section 5: Required Banking Facilities
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqDebitCard}
                    onChange={(e) => setReqDebitCard(e.target.checked)}
                    className="w-4 h-4 text-[#2563EB] accent-[#2563EB]"
                  />
                  <span className="text-xs font-medium text-slate-700">RuPay Debit Card</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqChequeBook}
                    onChange={(e) => setReqChequeBook(e.target.checked)}
                    className="w-4 h-4 text-[#2563EB] accent-[#2563EB]"
                  />
                  <span className="text-xs font-medium text-slate-700">Cheque Book</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqNetBanking}
                    onChange={(e) => setReqNetBanking(e.target.checked)}
                    className="w-4 h-4 text-[#2563EB] accent-[#2563EB]"
                  />
                  <span className="text-xs font-medium text-slate-700">Net & Mobile Bank</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqSmsAlerts}
                    onChange={(e) => setReqSmsAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#2563EB] accent-[#2563EB]"
                  />
                  <span className="text-xs font-medium text-slate-700">SMS Alerts</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqPassbook}
                    onChange={(e) => setReqPassbook(e.target.checked)}
                    className="w-4 h-4 text-[#2563EB] accent-[#2563EB]"
                  />
                  <span className="text-xs font-medium text-slate-700">Physical Passbook</span>
                </label>
              </div>
            </div>

            {/* SECTION 6: NOMINEE PARTICULARS (FORM DA-1) */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider">
                  Section 6: Nomination Particulars (Section 45ZA of Banking Regulation Act, 1949)
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Form DA-1</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">Nominee Full Name *</label>
                  <input
                    type="text"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">Relationship with Applicant *</label>
                  <input
                    type="text"
                    value={nomineeRelationship}
                    onChange={(e) => setNomineeRelationship(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">Nominee Age / DOB *</label>
                  <input
                    type="text"
                    value={nomineeAgeOrDob}
                    onChange={(e) => setNomineeAgeOrDob(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-[#142B4A] mb-1">Nominee Full Address *</label>
                  <input
                    type="text"
                    value={nomineeAddress}
                    onChange={(e) => setNomineeAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 7: APPLICANT STATUTORY DECLARATION */}
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
                  <strong>Statutory Applicant Declaration:</strong> I hereby declare that the particulars given above are true and correct to the best of my knowledge. I agree to abide by BankTM account rules and guidelines mandated by the Reserve Bank of India. I undertake to maintain the stipulated minimum quarterly balance and authorize the bank to verify my KYC credentials.
                </span>
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                <span>Applicant Digital Signature: {fullName}</span>
                <span>Date: {new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-center"
              >
                Cancel & Return to Accounts
              </button>

              <button
                type="submit"
                className="px-8 py-3 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Account Opening Form (Form AOF-01) for Approval</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Full Physical Form Dossier Modal */}
      <AccountApplicationModal
        application={selectedDossierApp}
        onClose={() => setSelectedDossierApp(null)}
      />
    </div>
  );
};
