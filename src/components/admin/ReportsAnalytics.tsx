import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Users, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  PieChart
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const ReportsAnalytics: React.FC = () => {
  const { customers, accounts, transactions, cardApplications } = useBanking();

  const totalDeposits = transactions
    .filter(tx => tx.type === 'deposit' || tx.type === 'transfer_in')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawals = transactions
    .filter(tx => tx.type === 'withdrawal' || tx.type === 'transfer_out')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSavingsBalance = accounts
    .filter(a => a.accountType === 'savings')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalCurrentBalance = accounts
    .filter(a => a.accountType === 'current')
    .reduce((sum, a) => sum + a.balance, 0);

  const rupayCount = cardApplications.filter(c => c.cardNetwork === 'RuPay').length;
  const visaCount = cardApplications.filter(c => c.cardNetwork === 'Visa').length;
  const mastercardCount = cardApplications.filter(c => c.cardNetwork === 'Mastercard').length;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-[#142B4A]">
          Institutional Analytics & Audited Reports
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Macro statistics on balance sheets, transaction velocity, card issuance, and liquidity
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Total Ledger Reserves</span>
          <div className="text-2xl font-bold text-[#142B4A] font-mono tabular-nums mt-2">
            ₹{(totalSavingsBalance + totalCurrentBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active on-balance liabilities</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Net Transaction Volume</span>
          <div className="text-2xl font-bold text-blue-700 font-mono tabular-nums mt-2">
            ₹{(totalDeposits + totalWithdrawals).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">{transactions.length} cleared settlements</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Card Issuance Volume</span>
          <div className="text-2xl font-bold text-slate-800 font-mono tabular-nums mt-2">
            {cardApplications.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Debit & Credit instruments</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Active Customer Base</span>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-2">
            {customers.filter(c => c.status === 'active').length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">100% KYC verified</span>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Liquidity Ratio */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#142B4A]">
            Deposit Breakdown by Product Type
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Savings Accounts (CASA)</span>
                <span className="font-mono font-bold text-[#142B4A]">
                  ₹{totalSavingsBalance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2563EB]"
                  style={{ width: `${Math.round((totalSavingsBalance / (totalSavingsBalance + totalCurrentBalance || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Current Accounts (Commercial Overdraft)</span>
                <span className="font-mono font-bold text-[#142B4A]">
                  ₹{totalCurrentBalance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-600"
                  style={{ width: `${Math.round((totalCurrentBalance / (totalSavingsBalance + totalCurrentBalance || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card Network Distribution */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#142B4A]">
            Card Network Distribution
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">RuPay (National Payments Corporation of India)</span>
                <span className="font-mono font-bold text-slate-800">{rupayCount} cards</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: `${(rupayCount / (cardApplications.length || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Visa Worldwide</span>
                <span className="font-mono font-bold text-slate-800">{visaCount} cards</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#2563EB]" style={{ width: `${(visaCount / (cardApplications.length || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Mastercard International</span>
                <span className="font-mono font-bold text-slate-800">{mastercardCount} cards</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${(mastercardCount / (cardApplications.length || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
