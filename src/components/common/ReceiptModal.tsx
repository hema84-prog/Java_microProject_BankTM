import React from 'react';
import { CheckCircle2, Download, Printer, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const ReceiptModal: React.FC = () => {
  const { lastTransactionReceipt, setLastTransactionReceipt, currentCustomer, t } = useBanking();

  if (!lastTransactionReceipt) return null;

  const isCredit = lastTransactionReceipt.type === 'deposit' || lastTransactionReceipt.type === 'transfer_in';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptText = `
======================================================
               BANKTM ADVICE SLIP
       Official Electronic Settlement Receipt
======================================================
Transaction ID:      ${lastTransactionReceipt.id}
Reference UTR No:    ${lastTransactionReceipt.referenceNumber}
Timestamp:           ${lastTransactionReceipt.date}
Channel / Rails:     ${lastTransactionReceipt.channel || 'Internal Settlement'}
Transaction Type:    ${isCredit ? 'CREDIT' : 'DEBIT'}
Status:              ${lastTransactionReceipt.status.toUpperCase()}

SENDER DETAILS:
Name:                ${lastTransactionReceipt.senderName || currentCustomer?.fullName || 'N/A'}
Account / Terminal:  ${lastTransactionReceipt.senderAccount || lastTransactionReceipt.accountNumber}
Source of Money:     ${lastTransactionReceipt.sourceOfMoney || (isCredit ? 'Cash Deposit / Inward Transfer' : 'Account Balance')}

BENEFICIARY DETAILS:
Name:                ${lastTransactionReceipt.recipientName || currentCustomer?.fullName || 'Self'}
Account / Terminal:  ${lastTransactionReceipt.recipientAccount || lastTransactionReceipt.accountNumber}
Destination of Money:${lastTransactionReceipt.destinationOfMoney || (isCredit ? 'Cleared Operating Account' : 'Cash Disbursed')}

FINANCIALS:
Amount:              INR ₹${lastTransactionReceipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Updated Net Balance: INR ₹${lastTransactionReceipt.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Purpose / Narration: ${lastTransactionReceipt.description}
======================================================
Authorized Electronic Transfer · BankTM Core Banking
RBI Clearing & Settlement Framework · 24x7 Help: 1800-425-2026
======================================================
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BankTM-Advice-${lastTransactionReceipt.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#142B4A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Official Transaction Advice</h3>
              <p className="text-[11px] text-slate-300 font-mono">UTR: {lastTransactionReceipt.referenceNumber}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLastTransactionReceipt(null)}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Amount Badge */}
          <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              Settled Transaction Amount
            </span>
            <div className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums mt-0.5 ${
              isCredit ? 'text-emerald-700' : 'text-[#142B4A]'
            }`}>
              {isCredit ? '+' : '-'}₹{lastTransactionReceipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-1.5 flex items-center justify-center gap-2">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                {lastTransactionReceipt.status} · {isCredit ? 'CREDIT' : 'DEBIT'}
              </span>
              <span className="text-[10px] font-medium text-slate-500 font-mono">
                {lastTransactionReceipt.channel || 'Bank Transfer'}
              </span>
            </div>
          </div>

          {/* Double-entry Details */}
          <div className="space-y-2 text-xs border border-slate-200 rounded-xl p-3.5 bg-white">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono font-bold text-[#142B4A]">{lastTransactionReceipt.id}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Timestamp</span>
              <span className="font-mono text-slate-700">{lastTransactionReceipt.date}</span>
            </div>

            {/* Sender row */}
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Sender / Origin</span>
              <div className="text-right">
                <span className="font-semibold text-slate-800">
                  {lastTransactionReceipt.senderName || currentCustomer?.fullName}
                </span>
                <span className="block text-[10px] text-slate-500 font-mono">
                  {lastTransactionReceipt.senderAccount || lastTransactionReceipt.accountNumber}
                </span>
              </div>
            </div>

            {/* Source of Money */}
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Source of Money</span>
              <span className="font-medium text-slate-800 text-right">
                {lastTransactionReceipt.sourceOfMoney || (isCredit ? 'Inward Clearing Counter' : 'Account Balance')}
              </span>
            </div>

            {/* Receiver row */}
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Receiver / Destination</span>
              <div className="text-right">
                <span className="font-semibold text-slate-800">
                  {lastTransactionReceipt.recipientName || currentCustomer?.fullName || 'Self'}
                </span>
                <span className="block text-[10px] text-slate-500 font-mono">
                  {lastTransactionReceipt.recipientAccount || lastTransactionReceipt.accountNumber}
                </span>
              </div>
            </div>

            {/* Destination of Money */}
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Destination of Money</span>
              <span className="font-medium text-slate-800 text-right">
                {lastTransactionReceipt.destinationOfMoney || (isCredit ? 'Cleared Operating Account' : 'Disbursement Channel')}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Purpose / Description</span>
              <span className="text-slate-700 max-w-[220px] text-right truncate">
                {lastTransactionReceipt.description}
              </span>
            </div>

            <div className="flex justify-between py-1.5 bg-blue-50/70 px-2.5 rounded-lg mt-1 border border-blue-100">
              <span className="font-semibold text-[#142B4A]">Post-Transaction Cleared Balance</span>
              <span className="font-bold text-[#142B4A] font-mono tabular-nums">
                ₹{lastTransactionReceipt.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span>BankTM Core Settlement System verified. Safe & legally binding digital advice.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#142B4A] bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Download Slip</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={() => setLastTransactionReceipt(null)}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#142B4A] hover:bg-[#1E3A8A] rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
