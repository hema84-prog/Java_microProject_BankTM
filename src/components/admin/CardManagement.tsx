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
  ShieldCheck 
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { CardApplicationStatus } from '../../types';

export const CardManagement: React.FC = () => {
  const { cardApplications, updateCardApplicationStatus } = useBanking();

  const [typeFilter, setTypeFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [remarks, setRemarks] = useState<{ [id: string]: string }>({});

  const filteredCards = cardApplications.filter(c => {
    if (typeFilter !== 'all' && c.cardType !== typeFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const handleUpdate = (id: string, status: CardApplicationStatus) => {
    const defaultRemark = status === 'approved' 
      ? 'Approved by Operations Underwriting.' 
      : status === 'dispatched' 
      ? 'Consignment dispatched via Speed Post.' 
      : status === 'delivered' 
      ? 'Card successfully delivered to customer address.' 
      : status === 'rejected' 
      ? 'Declined based on credit policy guidelines.' 
      : 'Under documentation verification.';

    updateCardApplicationStatus(id, status, remarks[id] || defaultRemark);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            Debit & Credit Card Operations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review card applications, underwrite credit limits, and control manufacturing & dispatch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                typeFilter === 'all' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600'
              }`}
            >
              All Cards
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('debit')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                typeFilter === 'debit' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600'
              }`}
            >
              Debit
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('credit')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                typeFilter === 'credit' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600'
              }`}
            >
              Credit
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredCards.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-xs text-slate-400 border border-slate-200">
            No card applications match the specified criteria.
          </div>
        ) : (
          filteredCards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                    card.cardType === 'debit' ? 'bg-blue-50 text-[#2563EB]' : 'bg-purple-50 text-purple-700'
                  }`}>
                    {card.cardType === 'debit' ? <CreditCard className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#142B4A]">{card.customerName}</span>
                      <span className="text-[11px] font-mono font-medium text-slate-400">({card.id})</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {card.cardNetwork} · {card.cardType.toUpperCase()} CARD · Account: <span className="font-mono">{card.accountNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-sm ${
                    card.status === 'approved' || card.status === 'delivered'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : card.status === 'dispatched'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : card.status === 'rejected'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {card.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Specific metadata for Credit cards */}
              {card.cardType === 'credit' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Monthly Income</span>
                    <span className="font-mono font-bold text-slate-800">₹{card.monthlyIncome?.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Requested Limit</span>
                    <span className="font-mono font-bold text-[#142B4A]">₹{card.requestedLimit?.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Employment Category</span>
                    <span className="capitalize text-slate-700 font-medium">{card.employmentCategory?.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Simulated Score</span>
                    <span className="font-mono font-bold text-emerald-600">{card.simulatedScore}/900</span>
                  </div>
                </div>
              )}

              {/* Delivery Address & Card number */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                <div>
                  <strong>Delivery Address:</strong> {card.deliveryAddress}
                </div>
                {card.maskedCardNumber && (
                  <div className="font-mono text-slate-800 font-medium">
                    Issued Number: {card.maskedCardNumber} (Exp: {card.expiryDate})
                  </div>
                )}
              </div>

              {card.remarks && (
                <div className="p-2 bg-slate-50 rounded-md text-[11px] text-slate-600 border border-slate-100">
                  <strong>Current Remarks:</strong> {card.remarks}
                </div>
              )}

              {/* Administrative Lifecycle Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Update underwriter remarks or Speed Post tracking..."
                  value={remarks[card.id] || ''}
                  onChange={(e) => setRemarks({ ...remarks, [card.id]: e.target.value })}
                  className="w-full sm:w-80 px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />

                <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-auto">
                  {card.status !== 'approved' && card.status !== 'dispatched' && card.status !== 'delivered' && (
                    <button
                      type="button"
                      onClick={() => handleUpdate(card.id, 'approved')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
                    >
                      Approve
                    </button>
                  )}

                  {card.status === 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdate(card.id, 'dispatched')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Mark Dispatched</span>
                    </button>
                  )}

                  {card.status === 'dispatched' && (
                    <button
                      type="button"
                      onClick={() => handleUpdate(card.id, 'delivered')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Delivered</span>
                    </button>
                  )}

                  {card.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleUpdate(card.id, 'rejected')}
                      className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
