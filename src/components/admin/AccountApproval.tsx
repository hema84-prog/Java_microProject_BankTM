import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  Wallet, 
  Search, 
  ShieldCheck,
  Filter,
  Eye,
  FileText,
  User,
  MapPin,
  CheckSquare
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AccountApplication } from '../../types';
import { AccountApplicationModal } from '../common/AccountApplicationModal';

export const AccountApproval: React.FC = () => {
  const { 
    accountApplications, 
    accounts, 
    approveAccountApplication, 
    rejectAccountApplication 
  } = useBanking();

  const [activeTab, setActiveTab] = useState<'applications' | 'all_accounts'>('applications');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [remarks, setRemarks] = useState<{ [id: string]: string }>({});
  const [selectedDossierApp, setSelectedDossierApp] = useState<AccountApplication | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredApps = accountApplications.filter(app => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = app.customerName.toLowerCase().includes(q);
      const matchId = app.id.toLowerCase().includes(q);
      const matchBranch = app.branch.toLowerCase().includes(q);
      const matchPan = app.panNumber?.toLowerCase().includes(q) || false;
      const matchMobile = app.customerMobile.includes(q);
      if (!matchName && !matchId && !matchBranch && !matchPan && !matchMobile) return false;
    }
    return true;
  });

  const pendingCount = accountApplications.filter(a => a.status === 'pending').length;

  const handleApprove = (appId: string, customRemark?: string) => {
    const finalRemark = customRemark || remarks[appId] || 'Approved after KYC inspection and document verification.';
    approveAccountApplication(appId, finalRemark);
    setActionFeedback(`Application ${appId} approved successfully! Operating account provisioned and credited.`);
    setSelectedDossierApp(null);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleReject = (appId: string, customRemark?: string) => {
    const finalRemark = customRemark || remarks[appId] || 'Rejected due to incomplete KYC documentation.';
    rejectAccountApplication(appId, finalRemark);
    setActionFeedback(`Application ${appId} rejected.`);
    setSelectedDossierApp(null);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            Account Opening Applications & Master Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect complete customer application forms (AOF-01), verify KYC documents, and approve core banking ledger accounts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-[#142B4A] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Applications ({pendingCount} pending review)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all_accounts')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'all_accounts'
                ? 'bg-[#142B4A] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Operational Accounts ({accounts.length})
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {activeTab === 'applications' ? (
        <div className="space-y-5">
          {/* Search & Filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer name, application reference ID, PAN, mobile or branch..."
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

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
              >
                <option value="all">All ({accountApplications.length})</option>
                <option value="pending">Pending Review ({pendingCount})</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Applications Queue */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#142B4A] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                <span>Customer Account Applications Queue ({filteredApps.length})</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Click "View Full Bank AOF Form" to inspect complete submitted applicant data
              </span>
            </div>

            {filteredApps.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No account applications match the current search or status filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredApps.map((app) => (
                  <div key={app.id} className="p-5 bg-[#F9FBFC] rounded-xl border border-slate-200 text-xs space-y-4 hover:border-blue-300 transition-colors">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-slate-900">
                            {app.applicantPrefix || 'Mr./Ms.'} {app.customerName}
                          </span>
                          <span className="font-mono text-xs text-slate-500">({app.id})</span>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm font-bold ${
                            app.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : app.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Customer ID: <strong className="font-mono">{app.customerId}</strong> · Submission Date: <strong className="font-mono">{new Date(app.submittedAt).toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setSelectedDossierApp(app)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1E3A8A] rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-300" />
                          <span>View Full Bank AOF Form</span>
                        </button>
                      </div>
                    </div>

                    {/* Snapshot Grid of Customer Information Entered */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-white rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Category</span>
                        <span className="font-bold text-[#2563EB] uppercase text-xs">
                          {app.accountType === 'savings' ? 'Savings Bank (SB)' : 'Current Account (CA)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Initial Funding Deposit</span>
                        <span className="font-mono font-bold text-slate-800 text-xs">
                          ₹{app.initialDeposit.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Income Tax PAN</span>
                        <span className="font-mono font-bold text-slate-800 text-xs">
                          {app.panNumber || 'ABCPS8192K'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Aadhaar (UIDAI)</span>
                        <span className="font-mono text-slate-700">
                          {app.aadhaarNumber || '•••• •••• 8812'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Allocated Branch</span>
                        <span className="text-slate-800 font-medium truncate block">{app.branch.split(',')[0]}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Mobile</span>
                        <span className="font-mono text-slate-800">{app.customerMobile}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Occupation & Income</span>
                        <span className="text-slate-800 truncate block">{app.occupationType || 'Salaried'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Nominee</span>
                        <span className="text-slate-800 truncate block">
                          {app.nomineeDetails?.name || 'Registered (Form DA-1)'}
                        </span>
                      </div>
                    </div>

                    {/* Applicant Address & Remarks */}
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <strong>Address:</strong> {app.residentialAddress || 'Indiranagar, Bengaluru'}
                        {app.city ? `, ${app.city}` : ''} {app.state ? `, ${app.state}` : ''}
                      </div>
                      {app.remarks && (
                        <div className="text-slate-500 font-mono text-[11px]">
                          Note: {app.remarks}
                        </div>
                      )}
                    </div>

                    {/* Admin Actions Bar (For pending applications) */}
                    {app.status === 'pending' && (
                      <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <input
                          type="text"
                          placeholder="Administrator verification remarks..."
                          value={remarks[app.id] || ''}
                          onChange={(e) => setRemarks({ ...remarks, [app.id]: e.target.value })}
                          className="w-full sm:w-80 px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                        />

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleReject(app.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(app.id)}
                            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Provision Account</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ALL OPERATIONAL ACCOUNTS MASTER LEDGER */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-[#142B4A] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2563EB]" />
              <span>Institutional Core Banking Master Ledger ({accounts.length})</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Account Number</th>
                  <th className="py-2.5 px-3">Customer ID</th>
                  <th className="py-2.5 px-3">Account Type</th>
                  <th className="py-2.5 px-3">Branch & IFSC</th>
                  <th className="py-2.5 px-3">Available Balance</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map(acc => (
                  <tr key={acc.accountNumber} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{acc.accountNumber}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{acc.customerId}</td>
                    <td className="py-3 px-3 uppercase font-semibold text-slate-700">{acc.accountType}</td>
                    <td className="py-3 px-3">{acc.branch.split(',')[0]} ({acc.ifscCode})</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#142B4A]">
                      ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {acc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Complete Physical AOF-01 Dossier Modal */}
      <AccountApplicationModal
        application={selectedDossierApp}
        onClose={() => setSelectedDossierApp(null)}
        isAdmin={true}
        onApprove={(id, rem) => handleApprove(id, rem)}
        onReject={(id, rem) => handleReject(id, rem)}
      />
    </div>
  );
};
