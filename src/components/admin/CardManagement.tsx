import React, { useState } from 'react';
import { 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Search, 
  Filter, 
  Clock, 
  ShieldCheck,
  User,
  Calendar,
  Layers,
  FileText,
  AlertCircle,
  Eye,
  Building2
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { CardApplicationStatus, CardApplication } from '../../types';
import { CardApplicationModal } from '../common/CardApplicationModal';

export const CardManagement: React.FC = () => {
  const { cardApplications, updateCardApplicationStatus } = useBanking();

  const [typeFilter, setTypeFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [remarks, setRemarks] = useState<{ [id: string]: string }>({});
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [selectedDossierApp, setSelectedDossierApp] = useState<CardApplication | null>(null);

  const filteredCards = cardApplications.filter(c => {
    if (typeFilter !== 'all' && c.cardType !== typeFilter) return false;
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        if (c.status !== 'pending' && c.status !== 'submitted' && c.status !== 'under_review') return false;
      } else if (c.status !== statusFilter) {
        return false;
      }
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = c.customerName.toLowerCase().includes(q);
      const matchAcc = c.accountNumber.toLowerCase().includes(q);
      const matchId = c.id.toLowerCase().includes(q);
      const matchReason = c.reasonForApplying?.toLowerCase().includes(q);
      const matchPan = c.panNumber?.toLowerCase().includes(q);
      if (!matchName && !matchAcc && !matchId && !matchReason && !matchPan) return false;
    }
    return true;
  });

  const handleApprove = (id: string, customRemark?: string) => {
    const finalRemark = customRemark || remarks[id]?.trim() || 'Approved by Banking Operations & Underwriting Desk.';
    updateCardApplicationStatus(id, 'approved', finalRemark);
    setActionFeedback(`Application ${id} approved successfully! Card number generated and assigned.`);
    setSelectedDossierApp(null);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleReject = (id: string, customRemark?: string) => {
    const finalRemark = customRemark || remarks[id]?.trim() || 'Declined in accordance with BankTM card issuance guidelines.';
    updateCardApplicationStatus(id, 'rejected', finalRemark);
    setActionFeedback(`Application ${id} rejected. Remarks recorded.`);
    setSelectedDossierApp(null);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleStatusChange = (id: string, newStatus: CardApplicationStatus) => {
    const customRemark = remarks[id]?.trim() || `Status updated to ${newStatus} by administrator.`;
    updateCardApplicationStatus(id, newStatus, customRemark);
    setActionFeedback(`Application ${id} status updated to ${newStatus.toUpperCase()}.`);
    setTimeout(() => setActionFeedback(null), 3000);
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            Debit & Credit Card Applications Administration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review applicant profiles, evaluate reasons for applying (including 18-year first-time cardholders), inspect full physical forms (AOF-CRD), and approve issuance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Card Type Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'all' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({cardApplications.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('debit')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'debit' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600'
              }`}
            >
              Debit
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('credit')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'credit' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600'
              }`}
            >
              Credit
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by customer name, account number, application ID, PAN, or reason (e.g. 18 years)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs text-slate-800 focus:outline-none bg-transparent"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredCards.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-sm">No card applications match the criteria</p>
            <p className="text-xs mt-1">Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          filteredCards.map((app) => {
            const is18 = app.reasonForApplying?.includes('18 years of age');
            return (
              <div 
                key={app.id} 
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 hover:border-blue-300 transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                      app.cardType === 'debit' 
                        ? 'bg-blue-50 text-[#2563EB]' 
                        : 'bg-purple-50 text-purple-700'
                    }`}>
                      {app.cardType === 'debit' ? <CreditCard className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#142B4A]">
                          {app.cardNetwork} {app.cardType.toUpperCase()} CARD
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">({app.id})</span>
                        {is18 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            18 Yrs First-Time Applicant
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Customer: <strong className="text-slate-800">{app.customerName}</strong> · Linked Account: <strong className="font-mono text-slate-700">{app.accountNumber}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {getStatusBadge(app.status)}
                    <button
                      type="button"
                      onClick={() => setSelectedDossierApp(app)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1E3A8A] rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-300" />
                      <span>View Full Card Form (AOF-CRD)</span>
                    </button>
                  </div>
                </div>

                {/* Applicant Data Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Name on Card</span>
                    <span className="font-semibold text-slate-800 font-mono uppercase">{app.nameOnCard || app.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">PAN Number</span>
                    <span className="font-mono font-bold text-slate-800">{app.panNumber || 'ABCPS8192K'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Submission Date</span>
                    <span className="font-mono text-slate-700">{new Date(app.submittedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Mobile</span>
                    <span className="font-mono text-slate-700">{app.contactMobile || '+91 98450 12345'}</span>
                  </div>
                </div>

                {/* Mandated Reason for Applying */}
                <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  is18 ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Mandated Reason for Applying:
                    </span>
                    {is18 && (
                      <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-100 px-2 py-0.2 rounded">
                        Age Milestone Rule Active
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 font-semibold leading-relaxed">
                    "{app.reasonForApplying || 'Standard Account Opening Card Application'}"
                  </p>
                </div>

                {/* Credit Underwriting particulars if credit card */}
                {app.cardType === 'credit' && (
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-700 block">Employment</span>
                      <span className="font-semibold text-slate-800 capitalize">{app.employmentCategory || 'Salaried'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-700 block">Monthly Income</span>
                      <span className="font-mono font-bold text-slate-900">₹{app.monthlyIncome?.toLocaleString('en-IN') || '85,000'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-700 block">Requested Limit</span>
                      <span className="font-mono font-bold text-[#2563EB]">₹{app.requestedLimit?.toLocaleString('en-IN') || '1,50,000'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-700 block">Risk Score</span>
                      <span className="font-mono font-bold text-emerald-700">{app.simulatedScore || 785} / 900</span>
                    </div>
                  </div>
                )}

                {/* Issued card info if approved */}
                {app.maskedCardNumber && (
                  <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold block">Issued Card Number</span>
                      <span className="font-mono font-bold text-sm tracking-wider text-slate-100">{app.maskedCardNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Expiry: {app.expiryDate || '11/31'} · Speed Post Dispatch Ready
                    </div>
                  </div>
                )}

                {/* Administrator Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Add administrator review remarks..."
                      value={remarks[app.id] || ''}
                      onChange={(e) => setRemarks({ ...remarks, [app.id]: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Status Select dropdown */}
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as CardApplicationStatus)}
                      className="px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    {(app.status === 'pending' || app.status === 'submitted' || app.status === 'under_review') && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReject(app.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(app.id)}
                          className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Issue</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Full Physical Form Dossier Modal */}
      <CardApplicationModal
        application={selectedDossierApp}
        onClose={() => setSelectedDossierApp(null)}
        isAdmin={true}
        onApprove={(id, rem) => handleApprove(id, rem)}
        onReject={(id, rem) => handleReject(id, rem)}
      />
    </div>
  );
};
