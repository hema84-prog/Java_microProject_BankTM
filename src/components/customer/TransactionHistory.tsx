import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ArrowDownLeft, 
  ArrowUpRight,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { TransactionType } from '../../types';

export const TransactionHistory: React.FC = () => {
  const { 
    customerTransactions, 
    customerAccounts, 
    selectedAccountNumber, 
    setSelectedAccountNumber,
    setLastTransactionReceipt,
    t 
  } = useBanking();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState<string>(selectedAccountNumber || 'all');

  const filteredTransactions = useMemo(() => {
    return customerTransactions.filter(tx => {
      // Account filter
      if (accountFilter !== 'all' && tx.accountNumber !== accountFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }
      // Date filter (e.g. YYYY-MM-DD)
      if (dateFilter && !tx.date.startsWith(dateFilter)) {
        return false;
      }
      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesId = tx.id.toLowerCase().includes(term);
        const matchesDesc = tx.description.toLowerCase().includes(term);
        const matchesRef = tx.referenceNumber.toLowerCase().includes(term);
        const matchesBeneficiary = tx.recipientName?.toLowerCase().includes(term) || tx.recipientAccount?.toLowerCase().includes(term);
        if (!matchesId && !matchesDesc && !matchesRef && !matchesBeneficiary) {
          return false;
        }
      }
      return true;
    });
  }, [customerTransactions, accountFilter, typeFilter, dateFilter, searchTerm]);

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ['Transaction ID', 'Date Time', 'Account Number', 'Type', 'Amount', 'Balance After', 'Status', 'Description', 'Reference'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      `"${tx.date}"`,
      tx.accountNumber,
      tx.type,
      tx.amount,
      tx.balanceAfter,
      tx.status,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.referenceNumber,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BankTM-Statement-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            {t.navTransactionHistory}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete audited electronic ledger and statements of accounts
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Export Statement (.CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, remark, or payee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>

        {/* Account Filter */}
        <div>
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="all">All Linked Accounts</option>
            {customerAccounts.map(a => (
              <option key={a.accountNumber} value={a.accountNumber}>
                {a.accountType.toUpperCase()} - {a.accountNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="all">All Transaction Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="transfer_in">Transfers In (Credits)</option>
            <option value="transfer_out">Transfers Out (Debits)</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-600">No transactions found</p>
            <p className="mt-1">Try adjusting your filters or date range.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">{t.transactionId}</th>
                  <th className="py-3 px-4">{t.date}</th>
                  <th className="py-3 px-4">Account</th>
                  <th className="py-3 px-4">{t.type}</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">{t.amount}</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4 text-center">{t.status}</th>
                  <th className="py-3 px-4 text-center">Advice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => {
                  const isCredit = tx.type === 'deposit' || tx.type === 'transfer_in';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-800 whitespace-nowrap">
                        {tx.id}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {tx.accountNumber}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-[11px] uppercase tracking-wide text-slate-700">
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-[220px] truncate" title={tx.description}>
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
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Cleared
                        </span>
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
        )}
      </div>
    </div>
  );
};
