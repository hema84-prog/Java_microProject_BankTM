import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  FileText, 
  Check, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Filter, 
  Calendar, 
  ShieldCheck, 
  Printer, 
  X,
  CreditCard,
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BankingTransaction } from '../../types';

export const TransactionHistory: React.FC = () => {
  const { 
    customerTransactions, 
    customerAccounts, 
    currentCustomer,
    selectedAccountNumber, 
    setLastTransactionReceipt,
    t 
  } = useBanking();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [creditDebitTab, setCreditDebitTab] = useState<'all' | 'credit' | 'debit'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [accountFilter, setAccountFilter] = useState<string>(selectedAccountNumber || 'all');

  // Selected Transaction for Complete Detail Modal
  const [selectedTx, setSelectedTx] = useState<BankingTransaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return customerTransactions.filter(tx => {
      // Account Filter
      if (accountFilter !== 'all' && tx.accountNumber !== accountFilter) return false;

      // Credit / Debit Tab Filter
      const isCredit = tx.type === 'deposit' || tx.type === 'transfer_in';
      if (creditDebitTab === 'credit' && !isCredit) return false;
      if (creditDebitTab === 'debit' && isCredit) return false;

      // Granular Type Filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

      // Date Range Filter
      const txDateOnly = tx.date.slice(0, 10);
      if (startDate && txDateOnly < startDate) return false;
      if (endDate && txDateOnly > endDate) return false;

      // Search by Transaction ID, Description, Sender, or Payee
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesId = tx.id.toLowerCase().includes(term);
        const matchesDesc = tx.description.toLowerCase().includes(term);
        const matchesSender = tx.senderName?.toLowerCase().includes(term) || tx.senderAccount?.toLowerCase().includes(term);
        const matchesBeneficiary = tx.recipientName?.toLowerCase().includes(term) || tx.recipientAccount?.toLowerCase().includes(term);
        const matchesSource = tx.sourceOfMoney?.toLowerCase().includes(term);
        const matchesDest = tx.destinationOfMoney?.toLowerCase().includes(term);
        const matchesRef = tx.referenceNumber?.toLowerCase().includes(term);
        if (!matchesId && !matchesDesc && !matchesSender && !matchesBeneficiary && !matchesSource && !matchesDest && !matchesRef) return false;
      }
      return true;
    });
  }, [customerTransactions, accountFilter, creditDebitTab, typeFilter, startDate, endDate, searchTerm]);

  // Aggregate Totals
  const { totalCredits, totalDebits, creditCount, debitCount } = useMemo(() => {
    let credits = 0;
    let debits = 0;
    let cCount = 0;
    let dCount = 0;

    filteredTransactions.forEach(tx => {
      const isCredit = tx.type === 'deposit' || tx.type === 'transfer_in';
      if (isCredit) {
        credits += tx.amount;
        cCount++;
      } else {
        debits += tx.amount;
        dCount++;
      }
    });

    return { totalCredits: credits, totalDebits: debits, creditCount: cCount, debitCount: dCount };
  }, [filteredTransactions]);

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = [
      'Transaction ID',
      'Date & Time',
      'Classification',
      'Type',
      'Sender Name',
      'Sender Account / Channel',
      'Receiver Name',
      'Receiver Account / Channel',
      'Source of Money',
      'Destination of Money',
      'Channel / Rails',
      'Amount (INR)',
      'Net Balance After (INR)',
      'Status',
      'Narration / Purpose',
      'UTR Reference Number'
    ];

    const rows = filteredTransactions.map(tx => {
      const isCredit = tx.type === 'deposit' || tx.type === 'transfer_in';
      return [
        tx.id,
        `"${tx.date}"`,
        isCredit ? 'CREDIT' : 'DEBIT',
        tx.type,
        `"${tx.senderName || currentCustomer?.fullName || ''}"`,
        `"${tx.senderAccount || tx.accountNumber}"`,
        `"${tx.recipientName || currentCustomer?.fullName || ''}"`,
        `"${tx.recipientAccount || tx.accountNumber}"`,
        `"${tx.sourceOfMoney || (isCredit ? 'Inward Clearing Counter' : 'Account Balance')}"`,
        `"${tx.destinationOfMoney || (isCredit ? 'Operating Account' : 'Disbursement / Payee')}"`,
        `"${tx.channel || 'Internal'}"`,
        tx.amount,
        tx.balanceAfter,
        tx.status.toUpperCase(),
        `"${tx.description.replace(/"/g, '""')}"`,
        tx.referenceNumber,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BankTM-Transaction-Statement-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSingleSlip = (tx: BankingTransaction) => {
    const isCredit = tx.type === 'deposit' || tx.type === 'transfer_in';
    const text = `
======================================================
               BANKTM ADVICE SLIP
       Official Electronic Settlement Receipt
======================================================
Transaction ID:      ${tx.id}
Reference UTR No:    ${tx.referenceNumber}
Timestamp:           ${tx.date}
Classification:      ${isCredit ? 'CREDIT (+)' : 'DEBIT (-)'}
Type:                ${tx.type.toUpperCase()}
Status:              ${tx.status.toUpperCase()}
Channel:             ${tx.channel || 'Internal Rails'}

SENDER (ORIGIN):
Name:                ${tx.senderName || currentCustomer?.fullName}
Account / Channel:   ${tx.senderAccount || tx.accountNumber}
Source of Money:     ${tx.sourceOfMoney || 'Tendered Funds'}

RECEIVER (DESTINATION):
Name:                ${tx.recipientName || currentCustomer?.fullName}
Account / Channel:   ${tx.recipientAccount || tx.accountNumber}
Destination:         ${tx.destinationOfMoney || 'Cleared Ledger'}

FINANCIAL DETAILS:
Transaction Amount:  INR ₹${tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Updated Net Balance: INR ₹${tx.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Purpose / Memo:      ${tx.description}
======================================================
Clearing & Settlement Interface · BankTM Core Banking
======================================================
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BankTM-Receipt-${tx.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header and Download Statement Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A] tracking-tight">
            Complete Customer Transaction History & Records
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Permanent double-entry electronic journal with complete source and destination traceability
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#142B4A] bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Download Statement (.CSV)</span>
        </button>
      </div>

      {/* Credit / Debit Summary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Credits */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
              Total Inward Credits ({creditCount})
            </span>
            <div className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums">
              +₹{totalCredits.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
            Deposits & Inward
          </span>
        </div>

        {/* Debits */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
              Total Outward Debits ({debitCount})
            </span>
            <div className="text-xl font-extrabold text-rose-700 font-mono tabular-nums">
              -₹{totalDebits.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 font-bold text-xs border border-rose-200">
            Withdrawals & Transfers
          </span>
        </div>

        {/* Total Ledger Count */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Filtered Records
            </span>
            <div className="text-xl font-extrabold text-[#142B4A] font-mono tabular-nums">
              {filteredTransactions.length} <span className="text-xs text-slate-400 font-normal">transactions</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] font-bold text-xs border border-blue-200 font-mono">
            Audit Verified
          </span>
        </div>
      </div>

      {/* Credit / Debit Indicator Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCreditDebitTab('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                creditDebitTab === 'all' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records ({customerTransactions.length})
            </button>
            <button
              type="button"
              onClick={() => setCreditDebitTab('credit')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                creditDebitTab === 'credit' ? 'bg-emerald-700 text-white shadow-xs' : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Credits Only</span>
            </button>
            <button
              type="button"
              onClick={() => setCreditDebitTab('debit')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                creditDebitTab === 'debit' ? 'bg-rose-700 text-white shadow-xs' : 'text-rose-800 hover:bg-rose-50'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Debits Only</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Click on any transaction record to inspect full audit details
          </span>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search by Transaction ID / Payee */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Transaction ID (TXN-...)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Account Filter */}
          <div>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">All Linked Accounts</option>
              {customerAccounts.map(a => (
                <option key={a.accountNumber} value={a.accountNumber}>
                  {a.accountType.toUpperCase()} - {a.accountNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Granular Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">All Sub-Types</option>
              <option value="deposit">Cash Deposits (Credit)</option>
              <option value="withdrawal">Cash Withdrawals (Debit)</option>
              <option value="transfer_in">Inward Bank Transfers (Credit)</option>
              <option value="transfer_out">Outward Bank Transfers (Debit)</option>
            </select>
          </div>

          {/* Date Filter (Start Date) */}
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Filter by Start Date"
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            {startDate && (
              <button
                type="button"
                onClick={() => setStartDate('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-1"
                title="Clear date"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-800">No transaction records match your filters</p>
            <p className="mt-1">Try resetting the search bar, date filter, or Credit/Debit indicator.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4 font-mono">TXN ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Origin / Sender</th>
                  <th className="py-3 px-4">Destination / Receiver</th>
                  <th className="py-3 px-4">Source of Money</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-right">Net Balance</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => {
                  const isCredit = tx.type === 'deposit' || tx.type === 'transfer_in';
                  return (
                    <tr 
                      key={tx.id} 
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                    >
                      {/* TXN ID */}
                      <td className="py-3 px-4 font-mono font-bold text-[#142B4A] whitespace-nowrap">
                        {tx.id}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                        {tx.date}
                      </td>

                      {/* Separate Credit and Debit Indicators */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isCredit 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {isCredit ? <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> : <ArrowUpRight className="w-3 h-3 text-rose-600" />}
                          <span>{isCredit ? 'CREDIT' : 'DEBIT'}</span>
                        </span>
                      </td>

                      {/* Sender Details */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 truncate max-w-[130px]">
                          {tx.senderName || currentCustomer?.fullName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">
                          {tx.senderAccount || tx.accountNumber}
                        </div>
                      </td>

                      {/* Receiver Details */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 truncate max-w-[130px]">
                          {tx.recipientName || currentCustomer?.fullName || 'Self'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">
                          {tx.recipientAccount || tx.accountNumber}
                        </div>
                      </td>

                      {/* Source of Money */}
                      <td className="py-3 px-4 text-slate-600 text-[11px] truncate max-w-[140px]">
                        {tx.sourceOfMoney || (isCredit ? 'Tendered Cash / Inward Rails' : 'Operating Account Balance')}
                      </td>

                      {/* Channel */}
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap text-[11px] font-medium">
                        {tx.channel || (isCredit ? 'Cash Deposit' : 'Internal Transfer')}
                      </td>

                      {/* Amount with distinct color indicator */}
                      <td className={`py-3 px-4 text-right font-mono tabular-nums font-extrabold whitespace-nowrap ${
                        isCredit ? 'text-emerald-700' : 'text-slate-900'
                      }`}>
                        {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Balance After */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap">
                        ₹{tx.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Successful</span>
                        </span>
                      </td>

                      {/* Inspect Detail Button */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Inspect Complete Audit Record"
                        >
                          <Eye className="w-4 h-4" />
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

      {/* COMPLETE TRANSACTION DETAILS MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#142B4A] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Complete Transaction Audit Dossier</h3>
                  <p className="text-[11px] text-slate-300 font-mono">ID: {selectedTx.id} · UTR: {selectedTx.referenceNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Financial Highlight Banner */}
              {(() => {
                const isCredit = selectedTx.type === 'deposit' || selectedTx.type === 'transfer_in';
                return (
                  <div className={`p-4 rounded-xl border text-center ${
                    isCredit 
                      ? 'bg-emerald-50/70 border-emerald-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Settled Transaction Amount
                    </span>
                    <div className={`text-3xl font-extrabold font-mono tabular-nums mt-0.5 ${
                      isCredit ? 'text-emerald-700' : 'text-[#142B4A]'
                    }`}>
                      {isCredit ? '+' : '-'}₹{selectedTx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                        isCredit ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {isCredit ? 'CREDIT' : 'DEBIT'} · {selectedTx.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 font-mono">
                        {selectedTx.channel || 'Internal Clearing'}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Sender & Receiver Traceability Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Sender Details */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Origin / Sender Details
                  </span>
                  <div className="font-bold text-[#142B4A]">
                    {selectedTx.senderName || currentCustomer?.fullName}
                  </div>
                  <div className="text-[11px] font-mono text-slate-600">
                    Account/Channel: <strong>{selectedTx.senderAccount || selectedTx.accountNumber}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    Source of Money: <strong className="text-slate-700">{selectedTx.sourceOfMoney || 'Tendered Funds'}</strong>
                  </div>
                </div>

                {/* Receiver Details */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Destination / Receiver Details
                  </span>
                  <div className="font-bold text-[#142B4A]">
                    {selectedTx.recipientName || currentCustomer?.fullName || 'Self'}
                  </div>
                  <div className="text-[11px] font-mono text-slate-600">
                    Account/Channel: <strong>{selectedTx.recipientAccount || selectedTx.accountNumber}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    Destination of Money: <strong className="text-slate-700">{selectedTx.destinationOfMoney || 'Credited Account'}</strong>
                  </div>
                </div>
              </div>

              {/* Audit Metadata Table */}
              <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs bg-white">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono font-bold text-[#142B4A]">{selectedTx.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Timestamp</span>
                  <span className="font-mono text-slate-700">{selectedTx.date}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Transaction Classification</span>
                  <span className="font-bold uppercase text-[#142B4A]">{selectedTx.type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Clearing Channel</span>
                  <span className="font-medium text-slate-800">{selectedTx.channel || 'Internal Settlement'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">UTR / Reference No</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedTx.referenceNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Purpose / Narration</span>
                  <span className="font-medium text-slate-800 text-right max-w-[240px] truncate">{selectedTx.description}</span>
                </div>
                <div className="flex justify-between py-2 bg-blue-50/70 px-2.5 rounded-lg mt-1 border border-blue-100">
                  <span className="font-bold text-[#142B4A]">Net Account Balance After</span>
                  <span className="font-extrabold text-[#142B4A] font-mono tabular-nums">
                    ₹{selectedTx.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>Verified double-entry record. Protected by RBI core clearing standards.</span>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDownloadSingleSlip(selectedTx)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#142B4A] bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Download Slip (.TXT)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLastTransactionReceipt(selectedTx);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Official Advice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1E3A8A] rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
