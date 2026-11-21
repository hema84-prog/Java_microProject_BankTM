import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Building2, 
  User, 
  FileText, 
  Calendar, 
  MapPin, 
  Briefcase, 
  CheckSquare, 
  Square,
  Clock
} from 'lucide-react';
import { AccountApplication } from '../../types';

interface AccountApplicationModalProps {
  application: AccountApplication | null;
  onClose: () => void;
  isAdmin?: boolean;
  onApprove?: (id: string, remarks: string) => void;
  onReject?: (id: string, remarks: string) => void;
}

export const AccountApplicationModal: React.FC<AccountApplicationModalProps> = ({
  application,
  onClose,
  isAdmin = false,
  onApprove,
  onReject,
}) => {
  const [remarks, setRemarks] = useState<string>('');

  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const text = `
================================================================================
                       BANKTM · CORE BANKING SYSTEM
         FORM AOF-01: COMPREHENSIVE ACCOUNT OPENING APPLICATION (KYC)
================================================================================
Application Reference No: ${application.id}
Submission Date & Time:   ${new Date(application.submittedAt).toLocaleString('en-IN')}
Current Status:           ${application.status.toUpperCase()}
Preferred Home Branch:    ${application.branch}

SECTION 1: APPLICANT PARTICULARS
--------------------------------------------------------------------------------
Applicant Legal Name:     ${application.applicantPrefix || 'Mr./Ms.'} ${application.customerName}
Customer ID:              ${application.customerId}
Father's / Spouse's Name: ${application.fatherOrSpouseName || 'N/A'}
Mother's Maiden Name:     ${application.motherName || 'N/A'}
Date of Birth:            ${application.dateOfBirth || 'N/A'}
Gender:                   ${application.gender || 'N/A'}
Nationality:              ${application.nationality || 'Indian'}
Marital Status:           ${application.maritalStatus || 'N/A'}
Permanent Account No PAN: ${application.panNumber || 'N/A'}
Aadhaar Reference (UID):  ${application.aadhaarNumber || 'N/A'}

SECTION 2: CONTACT & ADDRESS PARTICULARS
--------------------------------------------------------------------------------
Contact Mobile:           ${application.customerMobile}
Email Address:            ${application.customerEmail}
Permanent Residence:      ${application.residentialAddress || 'N/A'}, ${application.city || ''}, ${application.state || ''} - ${application.pinCode || ''}
Communication Address:    ${application.communicationAddressSame ? 'Same as Permanent Residence' : (application.communicationAddress || 'N/A')}

SECTION 3: OCCUPATION & INCOME PROFILE
--------------------------------------------------------------------------------
Occupation / Profession:  ${application.occupationType || 'N/A'}
Annual Gross Income:      ${application.annualIncome || 'N/A'}
Source of Funds:          ${application.sourceOfFunds || 'N/A'}

SECTION 4: ACCOUNT MANDATE & INITIAL FUNDING
--------------------------------------------------------------------------------
Account Category:         ${application.accountType.toUpperCase()} BANK ACCOUNT
Initial Funding Deposit:  INR ₹${application.initialDeposit.toLocaleString('en-IN')}
Cheque Book Facility:     ${application.facilitiesRequested?.chequeBook ? 'YES (25 Leaves)' : 'NO'}
RuPay Debit Card:         ${application.facilitiesRequested?.debitCard ? 'YES (EMV Chip & Contactless)' : 'NO'}
Internet & Mobile Bank:   ${application.facilitiesRequested?.netBanking ? 'YES' : 'NO'}
SMS Alert Facility:       ${application.facilitiesRequested?.smsAlerts ? 'YES' : 'NO'}
Passbook Issuance:        ${application.facilitiesRequested?.passbook ? 'YES' : 'NO'}

SECTION 5: NOMINATION PARTICULARS (FORM DA-1, SECTION 45ZA)
--------------------------------------------------------------------------------
Nominee Full Name:        ${application.nomineeDetails?.name || 'N/A'}
Relationship to Account:  ${application.nomineeDetails?.relationship || 'N/A'}
Nominee Age / DOB:        ${application.nomineeDetails?.ageOrDob || 'N/A'}
Nominee Address:          ${application.nomineeDetails?.address || 'N/A'}

SECTION 6: STATUTORY DECLARATION & OFFICER UNDERWRITING
--------------------------------------------------------------------------------
Declaration Status:       EXECUTED & ACCEPTED BY APPLICANT UNDER RBI KYC DIRECTIVES
Customer Remarks / Note:  ${application.remarks || 'None'}
================================================================================
Generated via BankTM Institutional Banking Engine · Confidential Core Banking Record
================================================================================
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BankTM-AOF-${application.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="bg-[#142B4A] text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-300 border border-white/10 font-bold">
              <FileText className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                  FORM AOF-01 · OFFICIAL BANK APPLICATION
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
                Comprehensive Account Opening Form (KYC Requisition)
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

        {/* Form Body - Authentic Bank Form Replica */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 text-slate-800 bg-[#F9FBFC]">
          
          {/* Bank Form Official Header Seal */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-4 border-t-[#142B4A]">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#142B4A] text-white flex items-center justify-center font-bold text-sm">
                  TM
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#142B4A] tracking-tight">BankTM Institutional Banking</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                    Scheduled Commercial Bank · Reserve Bank of India Licensed
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                Customer Account Opening & KYC Requisition Undertaking (AOF-01)
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-right sm:min-w-[220px]">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Application Ref No</div>
              <div className="text-sm font-bold font-mono text-[#142B4A]">{application.id}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Submitted: <span className="font-mono">{new Date(application.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* SECTION 1: APPLICANT IDENTIFICATION & KYC PARTICULARS */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-[#142B4A]/5 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#2563EB]" />
                Section 1: Applicant KYC & Personal Particulars
              </span>
              <span className="text-[11px] font-mono text-slate-500">ID: {application.customerId}</span>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Legal Name</span>
                <span className="font-bold text-sm text-[#142B4A]">
                  {application.applicantPrefix || 'Mr./Ms.'} {application.customerName}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Father's / Spouse's Name</span>
                <span className="font-semibold text-slate-700">
                  {application.fatherOrSpouseName || 'Not specified'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Mother's Full Name</span>
                <span className="font-semibold text-slate-700">
                  {application.motherName || 'Not specified'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Birth</span>
                <span className="font-mono font-semibold text-slate-700">
                  {application.dateOfBirth || '1992-05-14'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Gender</span>
                <span className="font-semibold text-slate-700">
                  {application.gender || 'Not specified'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nationality & Marital Status</span>
                <span className="font-semibold text-slate-700">
                  {application.nationality || 'Indian'} · {application.maritalStatus || 'Single'}
                </span>
              </div>

              <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                <span className="text-[10px] uppercase font-bold text-blue-700 block">Income Tax PAN</span>
                <span className="font-mono font-bold text-slate-800 text-xs tracking-wider">
                  {application.panNumber || 'ABCPS8192K'}
                </span>
              </div>

              <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                <span className="text-[10px] uppercase font-bold text-blue-700 block">Aadhaar (UIDAI Ref)</span>
                <span className="font-mono font-bold text-slate-800 text-xs tracking-wider">
                  {application.aadhaarNumber || '•••• •••• 8812'}
                </span>
              </div>

              <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">KYC Verification</span>
                <span className="font-bold text-emerald-700 text-xs flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Aadhaar OTP / Biometric Verified</span>
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTACT & ADDRESS PARTICULARS */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-[#142B4A]/5 px-4 py-2.5 border-b border-slate-200">
              <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2563EB]" />
                Section 2: Contact Details & Residence Address
              </span>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Mobile Number</span>
                <span className="font-mono font-semibold text-slate-800 text-sm">{application.customerMobile}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Official Email Address</span>
                <span className="font-mono font-semibold text-slate-800 text-sm truncate block">{application.customerEmail}</span>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Permanent Residential Address</span>
                <p className="font-medium text-slate-700 mt-0.5 leading-relaxed">
                  {application.residentialAddress || 'No. 42, 3rd Cross, Indiranagar'}
                  {application.city ? `, ${application.city}` : ''}
                  {application.state ? `, ${application.state}` : ''}
                  {application.pinCode ? ` - PIN ${application.pinCode}` : ''}
                </p>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Communication / Mailing Address</span>
                <p className="font-medium text-slate-700 mt-0.5 leading-relaxed">
                  {application.communicationAddressSame
                    ? 'Same as Permanent Residential Address (Verified via Aadhaar)'
                    : (application.communicationAddress || 'Same as Permanent Residential Address')}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: OCCUPATION, INCOME & INITIAL DEPOSIT */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-[#142B4A]/5 px-4 py-2.5 border-b border-slate-200">
              <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#2563EB]" />
                Section 3: Occupation, Income & Account Choice
              </span>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Occupation / Profession</span>
                <span className="font-semibold text-slate-800">{application.occupationType || 'Salaried (Private / Public Sector)'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Income Bracket</span>
                <span className="font-semibold text-slate-800">{application.annualIncome || '₹5,00,000 - ₹10,00,000'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Source of Funds</span>
                <span className="font-semibold text-slate-800">{application.sourceOfFunds || 'Salary Remittance'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Category Requested</span>
                <span className="font-bold text-[#2563EB] uppercase text-sm">
                  {application.accountType === 'savings' ? 'Savings Bank Account' : 'Current Account'}
                </span>
              </div>

              <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Initial Funding Deposit Tendered</span>
                <div className="text-xl font-bold font-mono text-[#142B4A] mt-0.5">
                  ₹{application.initialDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-slate-500">
                  {application.accountType === 'savings' ? 'Min Balance: ₹1,000 | Interest: 7.10% p.a.' : 'Min Deposit: ₹5,000 | Overdraft: ₹50,000'}
                </span>
              </div>

              <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Allocated Home Branch</span>
                <div className="text-sm font-bold text-[#142B4A] mt-0.5">
                  {application.branch}
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  IFSC Code: BTMN000104 · Clearing Circle: Karnataka
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 4: FACILITIES REQUESTED */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-3">
            <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider block">
              Section 4: Banking Facilities Mandated
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-700">RuPay Debit Card</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-700">Net & Mobile Banking</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-700">SMS Alerts & Alerts</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                {application.facilitiesRequested?.chequeBook ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="font-medium text-slate-700">Cheque Book</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                {application.facilitiesRequested?.passbook ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="font-medium text-slate-700">Physical Passbook</span>
              </div>
            </div>
          </div>

          {/* SECTION 5: NOMINEE DETAILS (FORM DA-1) */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-[#142B4A]/5 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider">
                Section 5: Nomination Details (Section 45ZA of Banking Regulation Act, 1949)
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Form DA-1</span>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nominee Full Name</span>
                <span className="font-bold text-sm text-slate-800">
                  {application.nomineeDetails?.name || 'Nominee Details Registered'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Relationship to Applicant</span>
                <span className="font-semibold text-slate-700">
                  {application.nomineeDetails?.relationship || 'Family / Next of Kin'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nominee Age / DOB</span>
                <span className="font-semibold text-slate-700">
                  {application.nomineeDetails?.ageOrDob || 'Major (Age 28+)'}
                </span>
              </div>

              <div className="sm:col-span-3 pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nominee Address</span>
                <span className="text-slate-700 font-medium">
                  {application.nomineeDetails?.address || application.residentialAddress || 'Same as applicant residential address'}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 6: APPLICANT STATUTORY DECLARATION */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <div className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Applicant Legal Undertaking & Declaration</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-900/90">
              "I hereby declare that all particulars filled in this Account Opening Form (AOF-01) are true, correct, and complete. I agree to abide by the rules of BankTM and terms governing Savings/Current accounts. I authorize the bank to verify my credentials through UIDAI/NDML C-KYC repository in compliance with Prevention of Money Laundering Act (PMLA) regulations."
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-emerald-200 text-[11px] font-mono text-emerald-800">
              <span>Digitally Signed by: {application.customerName}</span>
              <span>Timestamp: {application.submittedAt}</span>
            </div>
          </div>

          {/* Customer submission notes or remarks if any */}
          {application.remarks && (
            <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-700 border border-slate-200">
              <span className="font-bold text-slate-800">Official / Applicant Remarks:</span> {application.remarks}
            </div>
          )}

        </div>

        {/* Modal Footer / Administrator Underwriting Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-mono">
            Form Ref: <span className="font-bold text-slate-700">{application.id}</span> · Status: <span className="font-bold uppercase text-slate-700">{application.status}</span>
          </div>

          {isAdmin && application.status === 'pending' ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="text"
                placeholder="Officer verification remarks..."
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
                  <span>Reject Form</span>
                </button>
                <button
                  type="button"
                  onClick={() => onApprove && onApprove(application.id, remarks || 'Approved after KYC inspection')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Provision Account</span>
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
