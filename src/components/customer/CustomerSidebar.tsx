import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  PlusCircle, 
  Wallet, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight, 
  Search, 
  History, 
  CreditCard, 
  Sparkles, 
  Landmark, 
  Compass, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useBanking, CustomerNavTab } from '../../context/BankingContext';
import { BankLogo } from '../common/BankLogo';

export const CustomerSidebar: React.FC = () => {
  const { 
    activeCustomerTab, 
    setActiveCustomerTab, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    logout,
    t 
  } = useBanking();

  interface NavItem {
    id: CustomerNavTab;
    label: string;
    icon: React.ElementType;
  }

  interface NavGroup {
    title: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      title: t.navOverview,
      items: [
        { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
      ],
    },
    {
      title: t.navMyBanking,
      items: [
        { id: 'profile', label: t.navMyProfile, icon: User },
        { id: 'open_account', label: t.navOpenNewAccount, icon: PlusCircle },
        { id: 'my_accounts', label: t.navMyAccounts, icon: Wallet },
        { id: 'deposit', label: t.navDeposit, icon: ArrowDownToLine },
        { id: 'withdraw', label: t.navWithdraw, icon: ArrowUpFromLine },
        { id: 'transfer', label: t.navTransfer, icon: ArrowLeftRight },
        { id: 'balance', label: t.navBalanceEnquiry, icon: Search },
        { id: 'history', label: t.navTransactionHistory, icon: History },
      ],
    },
    {
      title: t.navCardServices,
      items: [
        { id: 'apply_debit', label: t.navApplyDebitCard, icon: CreditCard },
        { id: 'apply_credit', label: t.navApplyCreditCard, icon: Sparkles },
        { id: 'my_cards', label: t.navMyCards, icon: Wallet },
      ],
    },
    {
      title: t.navFinancialAssistance,
      items: [
        { id: 'schemes', label: t.navGovernmentSchemes, icon: Landmark },
        { id: 'loan_finder', label: t.navSmartLoanFinder, icon: Compass },
      ],
    },
    {
      title: t.navOthers,
      items: [
        { id: 'settings', label: t.navSettings, icon: Settings },
        { id: 'help', label: t.navHelpSupport, icon: HelpCircle },
      ],
    },
  ];

  return (
    <aside 
      className={`bg-[#142B4A] text-slate-200 border-r border-[#1a3860] flex flex-col transition-all duration-200 z-40 shrink-0 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
        {!sidebarCollapsed && (
          <BankLogo variant="light" size="sm" showTagline={false} />
        )}
        {sidebarCollapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              TM
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors hidden lg:block cursor-pointer"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!sidebarCollapsed && (
              <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-blue-300 uppercase select-none">
                {group.title}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeCustomerTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveCustomerTab(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left group cursor-pointer ${
                      isActive 
                        ? 'bg-[#2563EB] text-white shadow-xs' 
                        : 'text-slate-300 hover:text-white hover:bg-white/8'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                    }`} />
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile / Logout Quick Bar */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0 text-red-400" />
          {!sidebarCollapsed && <span>{t.logout}</span>}
        </button>
      </div>
    </aside>
  );
};
