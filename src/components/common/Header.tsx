import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, User, Check, Menu } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BankLogo } from './BankLogo';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  pageTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const { 
    currentRole, 
    currentCustomer, 
    currentAdmin, 
    logout, 
    notifications, 
    markNotificationRead,
    sidebarCollapsed, 
    setSidebarCollapsed,
    t
  } = useBanking();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Zone 1: Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors lg:flex items-center justify-center cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-800 text-sm tracking-tight capitalize">
            {pageTitle}
          </span>
        </div>
      </div>

      {/* Zone 2: Language Selector */}
      <div className="flex items-center gap-3">
        {currentRole === 'customer' && (
          <LanguageSelector variant="header" />
        )}

        {/* Zone 3: Notification Bell, Profile Badge & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-slate-600 hover:text-[#142B4A] hover:bg-slate-100 rounded-lg transition-colors focus:outline-none cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#142B4A] uppercase tracking-wide">
                    Bank Alerts & Updates
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] text-blue-600 font-medium font-mono">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No notifications available.
                    </div>
                  ) : (
                    notifications.map(item => (
                      <div
                        key={item.id}
                        onClick={() => markNotificationRead(item.id)}
                        className={`p-3 text-xs cursor-pointer transition-colors ${
                          item.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-semibold ${item.read ? 'text-slate-800' : 'text-[#142B4A]'}`}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {item.date}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1 line-clamp-2 text-[11px]">
                          {item.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile Info */}
          {currentRole === 'customer' && currentCustomer && (
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs select-none">
                {currentCustomer.fullName
                  .split(' ')
                  .map(part => part[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || 'CU'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[140px]">
                  {currentCustomer.fullName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentCustomer.id}
                </span>
              </div>
            </div>
          )}

          {currentRole === 'admin' && currentAdmin && (
            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-[#142B4A] text-white flex items-center justify-center font-bold text-xs">
                AD
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800">
                  {currentAdmin.fullName}
                </span>
                <span className="text-[10px] text-blue-600 font-mono uppercase tracking-wider font-semibold">
                  Administrator
                </span>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            title="End Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.logout}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
