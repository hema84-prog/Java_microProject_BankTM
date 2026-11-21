import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  CreditCard, 
  User, 
  FileText, 
  MapPin, 
  Briefcase, 
  CheckSquare, 
  Square,
  Sparkles,
  Truck
} from 'lucide-react';
import { CardApplication, CardApplicationStatus } from '../../types';

interface CardApplicationModalProps {
  application: CardApplication | null;
  onClose: () => void;
  isAdmin?: boolean;
  onApprove?: (id: string, remarks: string) => void;
  onReject?: (id: string, remarks: string) => void;
  onStatusChange?: (id: string, status: CardApplicationStatus, remarks: string) => void;
}

export const CardApplicationModal: React.FC<CardApplicationModalProps> = ({
  application,
  onClose,
  isAdmin = false,
  onApprove,
  onReject,
  onStatusChange,
}) => {
  const [remarks, setRemarks] = useState<string>('');

  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const text = `
================================================================================
                       BANKTM · CARD SERVICES DIVISION
        FORM AOF-CRD: APPLICATION FOR ISSUANCE OF DEBIT / CREDIT CARD
================================================================================
Application Reference No: ${application.id}
Submission Date & Time:   ${new Date(application.submittedAt).toLocaleString('en-IN')}
Current Status:           ${application.status.toUpperCase()}
Card Category:            ${application.cardType.toUpperCase()} CARD
Card Network:             ${application.cardNetwork}
Linked Bank Account:      ${application.accountNumber}

SECTION 1: APPLICANT PERSONAL & KYC PARTICULARS
--------------------------------------------------------------------------------
Applicant Legal Name:     ${application.customerName}
Name Embossed on Card:    ${application.nameOnCard || application.customerName.toUpperCase()}
Customer ID:              ${application.customerId}
Father's / Mother's Name: ${application.fatherOrMotherName || 'Verified in Bank Records'}
Date of Birth:            ${application.dateOfBirth || 'Verified'}
Gender:                   ${application.gender || 'Verified'}
Permanent Account No PAN: ${application.panNumber || 'Verified'}
Aadhaar Reference (UID):  ${application.aadhaarNumber || 'Verified'}
Contact Mobile:           ${application.contactMobile || 'On file'}
Contact Email:            ${application.contactEmail || 'On file'}
Delivery Address:         ${application.deliveryAddress}

SECTION 2: MANDATED REASON FOR APPLICATION
--------------------------------------------------------------------------------
REASON GIVEN:             ${application.reasonForApplying}
${application.reasonForApplying.includes('18 years of age') ? '>> SPECIAL ELIGIBILITY: APPLICANT ATTAINED MAJORITY (18 YEARS OLD - FIRST BANK CARD) <<' : ''}

SECTION 3: CARD USAGE & FACILITY SELECTION
--------------------------------------------------------------------------------
ATM Cash Withdrawal:      ${application.enableAtmCash !== false ? 'YES' : 'NO'}
Merchant POS Purchases:   ${application.enablePosMerchant !== false ? 'YES' : 'NO'}
Online E-Commerce:        ${application.enableOnlineEcommerce !== false ? 'YES' : 'NO'}
Contactless Tap & Pay:    ${application.enableContactlessNfc !== false ? 'YES (EMV NFC)' : 'NO'}
International Usage:      ${application.enableInternational ? 'YES' : 'NO (Domestic Only)'}

${application.cardType === 'credit' ? `
SECTION 4: CREDIT & UNDERWRITING PARTICULARS
--------------------------------------------------------------------------------
Employment Category:      ${application.employmentCategory || 'Salaried'}
Employer / Business Name: ${application.employerName || 'N/A'}
Monthly Net Income:       INR ₹${application.monthlyIncome ? application.monthlyIncome.toLocaleString('en-IN') : 'N/A'}
Requested Credit Limit:   INR ₹${application.requestedLimit ? application.requestedLimit.toLocaleString('en-IN') : 'N/A'}
Risk Assessment Score:    ${application.simulatedScore || 750} / 900
Existing Cards Held:      ${application.existingCreditCards || 'None'}
` : ''}

SECTION 5: STATUTORY DECLARATION & ISSUANCE AUDIT
--------------------------------------------------------------------------------
Customer Declaration:     EXECUTED AND DIGITALLY SIGNED UNDER RBI MASTER DIRECTIONS
Underwriter Remarks:      ${application.remarks || 'Under processing'}
${application.maskedCardNumber ? `Card Number Assigned:    ${application.maskedCardNumber} (Exp: ${application.expiryDate || '11/31'})` : ''}
================================================================================
Generated via BankTM Card Management Console · Confidential Banking Document
================================================================================
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BankTM-CardApp-${application.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const is18Years = application.reasonForApplying?.includes('18 years of age');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="bg-[#142B4A] text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-300 border border-white/10 font-bold">
              <CreditCard className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                  FORM AOF-CRD · CARD REQUISITION DOSSIER
                </span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  application.status === 'approved' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : application.status === 'rejected' 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {application.status}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Application for Issuance of {application.cardType.toUpperCase()} Card ({application.cardNetwork})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              title="Print Application Form"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-medium"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadText}
              title="Download Form Copy"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body - Authentic Bank Card Requisition Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 text-slate-800 bg-[#F9FBFC]">
          
          {/* Header Seal Banner */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-4 border-t-[#2563EB]">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm">
                  CRD
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#142B4A] tracking-tight">
                    BankTM Payment Card Services
                  </h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                    Reserve Bank of India Master Directions on Card Issuance
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                Official Requisition Form for {application.cardType === 'credit' ? 'Pre-Approved Credit Card' : 'Contactless EMV Debit Card'}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-right sm:min-w-[220px]">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Application ID</div>
              <div className="text-sm font-bold font-mono text-[#142B4A]">{application.id}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Submitted: <span className="font-mono">{new Date(application.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* HIGHLIGHT BANNER IF 18 YEARS REASON */}
          {is18Years && (
            <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-blue-900 block">
                  First-Time Adult Card Application (18 Years of Age)
                </span>
                <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">
                  Applicant has declared: <strong>"Applying for the first time at 18 years of age."</strong> Special youth banking priority is applied with standard zero-fee maintenance on domestic RuPay EMV chip cards.
                </p>
              </div>
            </div>
          )}

          {/* SECTION A: APPLICANT PARTICULARS */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-[#142B4A]/5 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#2563EB]" />
                Section A: Applicant Particulars & Embossing Instructions
              </span>
              <span className="text-[11px] font-mono text-slate-500">ID: {application.customerId}</span>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Full Legal Name</span>
                <span className="font-bold text-sm text-[#142B4A]">{application.customerName}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Name to be Embossed on Card</span>
                <span className="font-mono font-bold text-sm text-[#2563EB] tracking-wider uppercase">
                  {application.nameOnCard || application.customerName.toUpperCase()}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Father's / Mother's Name</span>
                <span className="font-semibold text-slate-700">
                  {application.fatherOrMotherName || 'Krishnamurthy Sharma'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Birth & Gender</span>
                <span className="font-semibold text-slate-700">
                  {application.dateOfBirth || '1992-06-15'} · {application.gender || 'Verified'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Income Tax PAN Number</span>
                <span className="font-mono font-bold text-slate-800 text-xs">
                  {application.panNumber || 'ABCPS8192K'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Aadhaar Reference (UID)</span>
                <span className="font-mono font-bold text-slate-800 text-xs">
                  {application.aadhaarNumber || '•••• •••• 8812'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Mobile</span>
                <span className="font-mono font-semibold text-slate-800">
                  {application.contactMobile || '+91 98450 12345'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Email ID</span>
                <span className="font-mono font-semibold text-slate-800 truncate block">
                  {application.contactEmail || 'customer@example.in'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Linked Bank Account</span>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {application.accountNumber}
                </span>
              </div>

              <div className="sm:col-span-3 pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Communication & Delivery Address</span>
                <p className="font-medium text-slate-700 mt-0.5 leading-relaxed">
                  {application.deliveryAddress}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION B: REASON FOR APPLICATION (EXPLICIT FOCUS) */}
          <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                Section B: Mandated Reason for Application
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Mandatory Field
              </span>
            </div>

            <div className="p-5 space-y-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Applicant Stated Reason / Justification:
                </span>
                <p className="text-sm font-semibold text-[#142B4A] mt-1 leading-relaxed">
                  "{application.reasonForApplying}"
                </p>
              </div>

              {is18Years && (
                <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-900 border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Valid First-Time Youth Application: Meets Reserve Bank of India age eligibility criteria (18+ years). No negative bureau history required for initial debit issuance.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION C: CARD NETWORK & CHANNEL FACILITIES */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-[#142B4A]/5 px-4 py-2.5 border-b border-slate-200">
              <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#2563EB]" />
                Section C: Card Network & Channel Preferences
              </span>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Selected Card Network</span>
                  <div className="text-base font-bold text-[#142B4A] mt-0.5">
                    {application.cardNetwork} ({application.cardNetwork === 'RuPay' ? 'Domestic & Lounge Access' : application.cardNetwork === 'Visa' ? 'Global Signature' : 'Mastercard World'})
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Card Type & Category</span>
                  <div className="text-base font-bold text-[#2563EB] uppercase mt-0.5">
                    {application.cardType === 'credit' ? 'Unsecured Revolving Credit Facility' : 'Primary Settlement Debit Card'}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  Authorized Transaction Channels Mandated:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-700">ATM Cash</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-700">POS Merchant</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-700">Online E-Com</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-700">Contactless NFC</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                    {application.enableInternational ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-medium text-slate-700">International</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION D: FINANCIAL & CREDIT PARTICULARS (IF CREDIT CARD) */}
          {application.cardType === 'credit' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-[#142B4A]/5 px-4 py-2.5 border-b border-slate-200">
                <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#2563EB]" />
                  Section D: Employment & Underwriting Details (Credit Card Requisition)
                </span>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Employment Category</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {application.employmentCategory || 'Salaried Professional'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Employer / Enterprise</span>
                  <span className="font-semibold text-slate-800">
                    {application.employerName || 'Apex Cloud Solutions India Pvt Ltd'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Net Take-Home</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ₹{application.monthlyIncome ? application.monthlyIncome.toLocaleString('en-IN') : '85,000'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Requested Credit Limit</span>
                  <span className="font-mono font-bold text-[#2563EB] text-sm">
                    ₹{application.requestedLimit ? application.requestedLimit.toLocaleString('en-IN') : '1,50,000'}
                  </span>
                </div>

                <div className="sm:col-span-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <span className="text-[10px] uppercase font-bold text-blue-700 block">Existing Credit Cards in Other Banks</span>
                  <span className="text-slate-800 font-medium text-xs mt-0.5 block">
                    {application.existingCreditCards || 'HDFC Bank Millennia (Limit ₹1,00,000)'}
                  </span>
                </div>

                <div className="sm:col-span-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Bureau Risk Assessment Score</span>
                  <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                    {application.simulatedScore || 785} / 900 (Excellent Grade)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ISSUED CARD PARTICULARS IF APPROVED */}
          {application.maskedCardNumber && (
            <div className="p-4 bg-slate-900 text-white rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold block">
                  ISSUED VIRTUAL & PHYSICAL CARD MAPPING
                </span>
                <div className="text-xl font-mono tracking-widest font-bold mt-1 text-slate-100">
                  {application.maskedCardNumber}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Expiry: <span className="font-mono text-slate-200">{application.expiryDate || '11/31'}</span> · EMV Chip Contactless Active
                </div>
              </div>
              <div className="p-2.5 bg-white/10 rounded-lg text-right">
                <span className="text-[10px] uppercase text-slate-300 font-mono block">Delivery Tracking</span>
                <span className="text-xs font-mono text-emerald-300 font-semibold">Speed Post IN892018274IN</span>
              </div>
            </div>
          )}

          {/* SECTION E: STATUTORY APPLICANT DECLARATION */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
            <div className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Applicant Legal Undertaking & Declaration</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              "I hereby declare that all information given in this Card Requisition Form (AOF-CRD) is accurate. I confirm that I am an Indian resident and have attained the age of majority (18+ years) or am applying under sanctioned youth banking provisions. I authorize BankTM to debit applicable annual maintenance charges to my linked account."
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-500">
              <span>Digitally Signed by: {application.customerName}</span>
              <span>Timestamp: {application.submittedAt}</span>
            </div>
          </div>

          {/* Remarks */}
          {application.remarks && (
            <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-700 border border-slate-200">
              <span className="font-bold text-slate-800">Processing Remarks:</span> {application.remarks}
            </div>
          )}

        </div>

        {/* Modal Footer / Administrator Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-mono">
            Form Ref: <span className="font-bold text-slate-700">{application.id}</span> · Status: <span className="font-bold uppercase text-slate-700">{application.status}</span>
          </div>

          {isAdmin && (application.status === 'pending' || application.status === 'submitted' || application.status === 'under_review') ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="text"
                placeholder="Underwriter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] w-full sm:w-64"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onReject && onReject(application.id, remarks || 'Application declined by compliance')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  onClick={() => onApprove && onApprove(application.id, remarks || 'Approved after KYC inspection')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Issue Card</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1E3A8A] rounded-lg transition-colors cursor-pointer self-end sm:self-auto"
            >
              Close Form Dossier
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
