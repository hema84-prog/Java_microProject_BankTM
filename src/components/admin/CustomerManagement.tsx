import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Eye, 
  Wallet, 
  Building2,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { CustomerUser } from '../../types';

export const CustomerManagement: React.FC = () => {
  const { customers, accounts, toggleCustomerStatus } = useBanking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);

  const filteredCustomers = customers.filter(c => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.fullName.toLowerCase().includes(q) ||
      c.username.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.mobile.includes(q)
    );
  });

  const getCustomerAccounts = (custId: string) => {
    return accounts.filter(a => a.customerId === custId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            Registered Customer Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit customer accounts, KYC profiles, and activate or suspend access
          </p>
        </div>

        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, name, mobile, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white text-slate-800"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Linked Accounts</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => {
                const custAccs = getCustomerAccounts(cust.id);
                const totalBal = custAccs.reduce((acc, a) => acc + a.balance, 0);
                const isActive = cust.status === 'active';

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[#142B4A] whitespace-nowrap">
                      {cust.id}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{cust.fullName}</div>
                      <span className="text-[11px] text-slate-400 font-mono">@{cust.username}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-700">{cust.email}</div>
                      <div className="text-[11px] font-mono text-slate-400">{cust.mobile}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{custAccs.length} accounts</div>
                      <span className="text-[11px] font-mono text-emerald-600 font-bold">
                        ₹{totalBal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-sm ${
                        isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[#2563EB] bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                          title="View KYC Dossier"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCustomerStatus(cust.id)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                            isActive
                              ? 'text-red-700 bg-red-50 hover:bg-red-100'
                              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {isActive ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Dossier Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400 font-semibold">{selectedCustomer.id}</span>
                <h3 className="text-base font-bold text-[#142B4A]">{selectedCustomer.fullName}</h3>
                <span className="text-xs text-slate-500">Registered: {selectedCustomer.createdAt.slice(0, 10)}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Email</span>
                  <span className="text-slate-800 font-medium">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Mobile</span>
                  <span className="font-mono text-slate-800 font-medium">{selectedCustomer.mobile}</span>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="text-slate-400 block text-[10px] uppercase">Residential Address</span>
                  <span className="text-slate-800">{selectedCustomer.address}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                  Linked Accounts
                </h4>
                <div className="space-y-2">
                  {getCustomerAccounts(selectedCustomer.id).map(acc => (
                    <div key={acc.accountNumber} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800 block text-xs">
                          {acc.accountType.toUpperCase()} - {acc.accountNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">{acc.branch}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#142B4A] hover:bg-[#1f3f6b] rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
