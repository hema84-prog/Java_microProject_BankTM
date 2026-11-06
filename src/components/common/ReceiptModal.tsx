import React from 'react';
import { CheckCircle2, Download, Printer, X, ShieldCheck } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const ReceiptModal: React.FC = () => {
  const { lastTransactionReceipt, setLastTransactionReceipt, t } = useBanking();

  if (!lastTransactionReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate simple plain text receipt file
    const receiptText = `
======================================================
                  BankTM ADVICE SLIP
        Banking Made Simple for Everyone
======================================================
Transaction ID:    ${lastTransactionReceipt.id}
Reference Number:  ${lastTransactionReceipt.referenceNumber}
Date & Time:       ${lastTransactionReceipt.date}
Account Number:    ${lastTransactionReceipt.accountNumber}
Transaction Type:  ${lastTransactionReceipt.type.toUpperCase()}
Amount:            INR ₹${lastTransactionReceipt.amount.toLocaleString()}
Post-Txn Balance:  INR ₹${lastTransactionReceipt.balanceAfter.toLocaleString()}
Status:            ${lastTransactionReceipt.status.toUpperCase()}
Description:       ${lastTransactionReceipt.description}
${lastTransactionReceipt.recipientAccount ? `Beneficiary Account: ${lastTransactionReceipt.recipientAccount}` : ''}
${lastTransactionReceipt.recipientName ? `Beneficiary Name:    ${lastTransactionReceipt.recipientName}` : ''}
======================================================
This is a computer-generated simulated banking advice.
No signature is required. BankTM 24x7 Support: 1800-425-2026
======================================================
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BankTM-Receipt-${lastTransactionReceipt.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Banner */}
        <div className="bg-[#142B4A] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base tracking-tight">{t.transactionSuccess}</h3>
              <p className="text-xs text-blue-200">Ref: {lastTransactionReceipt.referenceNumber}</p>
            </div>
          </div>
          <button
            onClick={() => setLastTransactionReceipt(null)}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-5" id="printable-receipt">
          {/* Amount Badge */}
          <div className="text-center py-4 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Amount Transacted</span>
            <div className="text-3xl font-bold text-[#142B4A] font-mono tabular-nums mt-1">
              ₹{lastTransactionReceipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-2">
              Status: Successful / Cleared
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t.transactionId}</span>
              <span className="font-mono font-medium text-slate-800">{lastTransactionReceipt.id}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t.date}</span>
              <span className="font-mono text-slate-800">{lastTransactionReceipt.date}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Source Account</span>
              <span className="font-mono text-slate-800">{lastTransactionReceipt.accountNumber}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t.type}</span>
              <span className="font-semibold text-[#142B4A] uppercase tracking-wide">
                {lastTransactionReceipt.type.replace('_', ' ')}
              </span>
            </div>

            {lastTransactionReceipt.recipientAccount && (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{t.beneficiaryAccount}</span>
                <span className="font-mono text-slate-800">{lastTransactionReceipt.recipientAccount}</span>
              </div>
            )}

            {lastTransactionReceipt.recipientName && (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{t.beneficiaryName}</span>
                <span className="font-medium text-slate-800">{lastTransactionReceipt.recipientName}</span>
              </div>
            )}

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t.description}</span>
              <span className="text-slate-800 max-w-[240px] text-right truncate">{lastTransactionReceipt.description}</span>
            </div>

            <div className="flex justify-between py-2 bg-blue-50/60 px-3 rounded-md">
              <span className="font-medium text-blue-900">Updated Available Balance</span>
              <span className="font-bold text-[#142B4A] font-mono tabular-nums">
                ₹{lastTransactionReceipt.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>BankTM Core Settlement System verified. 128-bit encrypted digital advice.</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{t.downloadReceipt}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>{t.printReceipt}</span>
            </button>
            <button
              type="button"
              onClick={() => setLastTransactionReceipt(null)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#142B4A] hover:bg-[#1f3f6b] rounded-md transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
