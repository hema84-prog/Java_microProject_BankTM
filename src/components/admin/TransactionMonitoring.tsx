import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  Building2,
  FileText
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const TransactionMonitoring: React.FC = () => {
  const { transactions, setLastTransactionReceipt } = useBanking();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (dateFilter && !tx.date.startsWith(dateFilter)) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          tx.id.toLowerCase().includes(q) ||
          tx.accountNumber.toLowerCase().includes(q) ||
          tx.customerId.toLowerCase().includes(q) ||
          tx.description.toLowerCase().includes(q) ||
          tx.referenceNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, typeFilter, dateFilter, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            Transaction Monitoring & Audit Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional real-time transaction ledger across all accounts, branches, and settlement rails
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-slate-500">
            {filteredTransactions.length} Cleared Transactions
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Txn ID, Account, Ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Transaction Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="transfer_in">Transfers In</option>
            <option value="transfer_out">Transfers Out</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Central Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Customer & Account</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-right">Balance After</th>
                <th className="py-3 px-4 text-center">Advice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const isCredit = tx.type === 'deposit' || tx.type === 'transfer_in';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#142B4A] whitespace-nowrap">
                      {tx.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono text-slate-800 font-medium">{tx.accountNumber}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{tx.customerId}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-[11px] uppercase tracking-wide text-slate-700">
                        {tx.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate" title={tx.description}>
                      {tx.description}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono tabular-nums font-bold whitespace-nowrap ${
                      isCredit ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                      ₹{tx.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setLastTransactionReceipt(tx)}
                        className="p-1 text-slate-500 hover:text-[#2563EB] hover:bg-slate-100 rounded-sm transition-colors"
                        title="View Official Advice Receipt"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
