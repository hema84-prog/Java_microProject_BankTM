import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  Wallet, 
  Search, 
  ShieldCheck,
  Filter
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const AccountApproval: React.FC = () => {
  const { 
    accountApplications, 
    accounts, 
    approveAccountApplication, 
    rejectAccountApplication 
  } = useBanking();

  const [activeTab, setActiveTab] = useState<'applications' | 'all_accounts'>('applications');
  const [remarks, setRemarks] = useState<{ [id: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');

  const pendingApps = accountApplications.filter(a => a.status === 'pending');
  const pastApps = accountApplications.filter(a => a.status !== 'pending');

  const handleApprove = (appId: string) => {
    approveAccountApplication(appId, remarks[appId] || 'Approved after KYC verification.');
  };

  const handleReject = (appId: string) => {
    rejectAccountApplication(appId, remarks[appId] || 'Rejected due to incomplete documentation.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            Account Applications & Master Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review customer applications, approve ledger provisioning, and monitor all bank accounts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'applications'
                ? 'bg-[#142B4A] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Applications ({pendingApps.length} pending)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all_accounts')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'all_accounts'
                ? 'bg-[#142B4A] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Bank Accounts ({accounts.length})
          </button>
        </div>
      </div>

      {activeTab === 'applications' ? (
        <div className="space-y-6">
          {/* Pending Applications Queue */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#142B4A] flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pending New Account Requests ({pendingApps.length})</span>
            </h3>

            {pendingApps.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No pending applications currently in queue.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingApps.map((app) => (
                  <div key={app.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-sm text-slate-900">{app.customerName}</span>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Ref: <span className="font-mono">{app.id}</span> · Customer ID: <span className="font-mono">{app.customerId}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-sm uppercase self-start sm:self-auto">
                        {app.accountType} Account
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-white rounded-lg border border-slate-100 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Initial Deposit</span>
                        <span className="font-mono font-bold text-slate-800 text-xs">
                          ₹{app.initialDeposit.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Home Branch</span>
                        <span className="text-slate-700 font-medium">{app.branch.split(',')[0]}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Contact Mobile</span>
                        <span className="font-mono text-slate-700">{app.customerMobile}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Email</span>
                        <span className="text-slate-700 truncate">{app.customerEmail}</span>
                      </div>
                    </div>

                    {app.remarks && (
                      <div className="text-[11px] text-slate-500">
                        Customer Submission Note: {app.remarks}
                      </div>
                    )}

                    {/* Admin Remarks Input & Decision Buttons */}
                    <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <input
                        type="text"
                        placeholder="Administrator approval remarks..."
                        value={remarks[app.id] || ''}
                        onChange={(e) => setRemarks({ ...remarks, [app.id]: e.target.value })}
                        className="w-full sm:w-80 px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleReject(app.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(app.id)}
                          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Activate Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Historical Applications */}
          {pastApps.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Decision History ({pastApps.length})
              </h4>
              <div className="divide-y divide-slate-100 text-xs">
                {pastApps.map(app => (
                  <div key={app.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">{app.customerName}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({app.accountType})</span>
                      <div className="text-[11px] text-slate-500">Remarks: {app.remarks}</div>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm ${
                      app.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* All Master Bank Accounts Table */
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#142B4A]">Institutional Master Accounts</h3>
            <span className="text-xs text-slate-500 font-mono">{accounts.length} Total Ledgers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Account Number</th>
                  <th className="py-3 px-4">Customer ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Branch & IFSC</th>
                  <th className="py-3 px-4 text-right">Cleared Balance</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map(acc => (
                  <tr key={acc.accountNumber} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#142B4A]">
                      {acc.accountNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {acc.customerId}
                    </td>
                    <td className="py-3 px-4 font-semibold uppercase text-[11px]">
                      {acc.accountType}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{acc.branch}</div>
                      <span className="font-mono text-[10px] text-slate-400">{acc.ifscCode}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
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
    </div>
  );
};
