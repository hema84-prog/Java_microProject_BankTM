import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Wallet, 
  Activity, 
  CreditCard, 
  Landmark, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useBanking, AdminNavTab } from '../../context/BankingContext';
import { BankLogo } from '../common/BankLogo';

export const AdminSidebar: React.FC = () => {
  const { 
    activeAdminTab, 
    setActiveAdminTab, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    accountApplications,
    cardApplications,
    logout 
  } = useBanking();

  const pendingAccounts = accountApplications.filter(a => a.status === 'pending').length;
  const pendingCards = cardApplications.filter(c => c.status === 'submitted' || c.status === 'under_review').length;

  interface NavItem {
    id: AdminNavTab;
    label: string;
    icon: React.ElementType;
    badgeCount?: number;
  }

  interface NavGroup {
    title: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'CUSTOMER MANAGEMENT',
      items: [
        { id: 'customers', label: 'All Customers', icon: Users },
        { id: 'account_apps', label: 'Account Applications', icon: UserCheck, badgeCount: pendingAccounts },
        { id: 'account_management', label: 'Account Management', icon: Wallet },
      ],
    },
    {
      title: 'BANKING OPERATIONS',
      items: [
        { id: 'transactions', label: 'Transaction Monitoring', icon: Activity },
      ],
    },
    {
      title: 'CARD MANAGEMENT',
      items: [
        { id: 'card_management', label: 'Card Applications', icon: CreditCard, badgeCount: pendingCards },
      ],
    },
    {
      title: 'GOVERNMENT SERVICES',
      items: [
        { id: 'schemes', label: 'Manage Schemes', icon: Landmark },
      ],
    },
    {
      title: 'REPORTS & AUDIT',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'audit_logs', label: 'System Audit Logs', icon: FileText },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Admin Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside 
      className={`bg-[#0E1E34] text-slate-200 border-r border-slate-800 flex flex-col transition-all duration-200 z-40 shrink-0 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0 bg-[#0A1627]">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-white tracking-tight">
                Bank<span className="text-red-400">TM Admin</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Control Console</span>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs">
              ADM
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors hidden lg:block cursor-pointer"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!sidebarCollapsed && (
              <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase select-none">
                {group.title}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeAdminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveAdminTab(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left group cursor-pointer ${
                      isActive 
                        ? 'bg-red-600 text-white shadow-xs' 
                        : 'text-slate-300 hover:text-white hover:bg-white/8'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      }`} />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!sidebarCollapsed && item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white text-red-600' : 'bg-red-500 text-white'
                      }`}>
                        {item.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Logout */}
      <div className="p-3 border-t border-white/10 shrink-0 bg-[#0A1627]">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0 text-red-400" />
          {!sidebarCollapsed && <span>Exit Admin Console</span>}
        </button>
      </div>
    </aside>
  );
};
