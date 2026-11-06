import React, { useState } from 'react';
import { 
  Landmark, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Users, 
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BadgePercent,
  Check,
  Building2,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  IndianRupee
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { GovernmentScheme } from '../../types';

export const GovernmentSchemes: React.FC = () => {
  const { schemes, setActiveCustomerTab, t } = useBanking();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);

  const categories = [
    { id: 'all', label: 'All Schemes & Loans' },
    { id: 'business', label: 'Business & MSME Loans' },
    { id: 'agriculture', label: 'Agriculture & Farm Loans' },
    { id: 'education', label: 'Student & Education Loans' },
    { id: 'women', label: 'Women & SHG Empowerment' },
    { id: 'karnataka', label: 'Karnataka State Schemes' },
  ];

  const filteredSchemes = schemes.filter(s => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchDesc = s.description.toLowerCase().includes(q);
      const matchBen = s.targetBeneficiaries.toLowerCase().includes(q);
      const matchDept = s.department.toLowerCase().includes(q);
      const matchAmt = s.loanOrSubsidyAmount?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchBen && !matchDept && !matchAmt) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#002C6C] text-xs font-bold border border-blue-200 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-[#002C6C]" />
              Official Government Welfare & Loan Assistance Portal
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Direct Official Gov Links
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142B4A] tracking-tight">
            Government Schemes & Banking Loan Assistance
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Explore verified Central and Karnataka state government credit programs, subsidies, educational grants, and collateral-free MSME loans. Review eligibility criteria, required documents, step-by-step application instructions, and apply directly on official government websites.
          </p>
        </div>

        {/* Loan Finder & EMI Calculator Callout */}
        <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2">
          <button
            type="button"
            onClick={() => setActiveCustomerTab('loan_finder')}
            className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-[#002C6C] hover:bg-[#003B95] rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Smart Loan Finder & EMI Calculator</span>
          </button>
        </div>
      </div>

      {/* 2. Official Citizen Notice & Regulatory Safety Box */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800">
            Citizen Advisory & Zero-Intermediary Guarantee:
          </p>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            BankTM and Government of India never charge any middleman fees, commission, or processing charges for government scheme facilitation. All links provided below redirect strictly to verified official government portals (<code className="font-mono text-amber-900 font-bold">.gov.in</code>, <code className="font-mono text-amber-900 font-bold">.nic.in</code>, and apex state portals).
          </p>
        </div>
      </div>

      {/* 3. Category Filter Tabs & Instant Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Segmented Category Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#002C6C] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search scheme, loan amount, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002C6C] bg-white text-slate-800"
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
          <span>Showing <strong>{filteredSchemes.length}</strong> government schemes & loan programs</span>
          <span>Category: <strong className="text-slate-700 capitalize">{selectedCategory.replace('_', ' ')}</strong></span>
        </div>
      </div>

      {/* 4. Schemes Grid with Detailed Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all space-y-5"
          >
            <div className="space-y-4">
              {/* Category, Department & State Tag */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-[#002C6C] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {scheme.categoryLabel}
                </span>

                {scheme.isStateScheme ? (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Karnataka State
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400">
                    Verified: {scheme.lastVerifiedDate}
                  </span>
                )}
              </div>

              {/* Title & Department */}
              <div>
                <h3 className="font-extrabold text-lg text-[#142B4A] leading-snug">
                  {scheme.title}
                </h3>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{scheme.department}</span>
                </div>
              </div>

              {/* Loan / Subsidy Amount Banner (Highlight) */}
              <div className="p-3.5 rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <IndianRupee className="w-3 h-3 text-emerald-700" />
                    Loan / Financial Benefit
                  </span>
                  <div className="font-extrabold text-sm sm:text-base text-emerald-950">
                    {scheme.loanOrSubsidyAmount || scheme.financialBenefits}
                  </div>
                </div>

                {scheme.interestRateText && (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-white/80 px-2 py-0.5 rounded border border-emerald-300 shrink-0">
                    {scheme.interestRateText.split('(')[0]}
                  </span>
                )}
              </div>

              {/* Purpose & Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {scheme.description}
              </p>

              {/* Target Beneficiaries */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs flex items-start gap-2">
                <Users className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <div className="text-slate-700 leading-tight">
                  <strong className="text-slate-900">Beneficiaries:</strong> {scheme.targetBeneficiaries}
                </div>
              </div>

              {/* Key Eligibility Bullet Points */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                  Key Eligibility Highlights:
                </span>
                <ul className="space-y-1 text-slate-600">
                  {scheme.eligibility.slice(0, 3).map((el, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{el}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents preview */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                  Required Documents:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.requiredDocuments.slice(0, 4).map((doc, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium border border-slate-200">
                      {doc}
                    </span>
                  ))}
                  {scheme.requiredDocuments.length > 4 && (
                    <span className="px-1.5 py-0.5 text-slate-400 text-[10px]">
                      +{scheme.requiredDocuments.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions: Full Dossier Modal & Direct Official Portal Redirect */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedScheme(scheme)}
                className="text-xs font-bold text-[#002C6C] hover:text-[#003B95] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Procedure & Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={scheme.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#002C6C] hover:bg-[#003B95] rounded-xl transition-all shadow-xs cursor-pointer"
                title={`Redirect to ${scheme.portalName || scheme.officialPortalUrl}`}
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Complete Scheme Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#002C6C] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 uppercase tracking-wider">
                  {selectedScheme.categoryLabel}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#142B4A] mt-2 leading-tight">
                  {selectedScheme.title}
                </h3>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedScheme.department}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScheme(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5 text-xs sm:text-sm">
              {/* Financial Benefit Banner */}
              <div className="p-4 rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Approved Benefit & Loan Details
                </span>
                <div className="text-base sm:text-lg font-extrabold text-emerald-950">
                  {selectedScheme.loanOrSubsidyAmount || selectedScheme.financialBenefits}
                </div>
                {selectedScheme.interestRateText && (
                  <p className="text-xs text-emerald-800 font-medium">
                    Interest Terms: {selectedScheme.interestRateText}
                  </p>
                )}
              </div>

              {/* Purpose & Overview */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5">
                  Scheme Purpose & Scope
                </h4>
                <p className="text-slate-600 leading-relaxed">{selectedScheme.description}</p>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                  Comprehensive Eligibility Checklist
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  {selectedScheme.eligibility.map((el, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{el}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Application Procedure */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                  Official Step-by-Step Application Procedure
                </h4>
                <div className="space-y-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  {selectedScheme.applicationProcedure?.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-[#002C6C] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                  Mandatory Required Documents
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedScheme.requiredDocuments.map((doc, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 text-slate-700 rounded-lg text-xs border border-slate-200 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#002C6C] shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification & Portal Metadata */}
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Official Portal: <strong className="font-mono text-slate-700">{selectedScheme.portalName}</strong></span>
                <span>Last Verified by BankTM Compliance: <strong>{selectedScheme.lastVerifiedDate}</strong></span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSelectedScheme(null)}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Close Dossier
              </button>

              <a
                href={selectedScheme.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#002C6C] hover:bg-[#003B95] rounded-xl transition-all shadow-md"
              >
                <span>Proceed to Official Government Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
