import React, { useState } from 'react';
import { 
  User, 
  KeyRound, 
  Globe, 
  HelpCircle, 
  ShieldCheck, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { Language } from '../../types';

export const CustomerSettings: React.FC = () => {
  const { 
    currentRole,
    currentCustomer, 
    currentAdmin,
    updateCustomerPassword, 
    language, 
    setLanguage, 
    resetAllData,
    t 
  } = useBanking();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const isAdminSession = currentRole === 'admin' && !!currentAdmin;

  if (!currentCustomer && !isAdminSession) return null;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }
    updateCustomerPassword(newPassword);
    setPasswordMessage({ type: 'success', text: 'Password successfully updated!' });
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-[#142B4A]">
          {isAdminSession ? 'Administrator Settings' : t.settingsTitle}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isAdminSession
            ? 'Manage administrator session details, portal language, and system state'
            : 'Manage your BankTM profile credentials, language preference, and security'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            {isAdminSession ? (
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            ) : (
              <User className="w-4 h-4 text-[#2563EB]" />
            )}
            <h3 className="font-bold text-sm text-[#142B4A]">
              {isAdminSession ? 'Administrator Profile' : t.navMyProfile}
            </h3>
          </div>

          {isAdminSession && currentAdmin ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Administrator ID</span>
                <span className="font-mono font-bold text-slate-800">{currentAdmin.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Officer Name</span>
                <span className="font-semibold text-slate-800">{currentAdmin.fullName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Terminal Username</span>
                <span className="font-mono text-slate-700">{currentAdmin.username}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Official Email</span>
                <span className="text-slate-800">{currentAdmin.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Access Privilege</span>
                <span className="font-mono uppercase text-emerald-700 font-semibold">{currentAdmin.role}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Session Timestamp</span>
                <span className="font-mono text-slate-700">{currentAdmin.lastLogin}</span>
              </div>
            </div>
          ) : currentCustomer ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Customer Identification Number</span>
                <span className="font-mono font-bold text-slate-800">{currentCustomer.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Full Legal Name</span>
                <span className="font-semibold text-slate-800">{currentCustomer.fullName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Registered Username</span>
                <span className="font-mono text-slate-700">{currentCustomer.username}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email Address</span>
                <span className="text-slate-800">{currentCustomer.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Mobile Phone</span>
                <span className="font-mono text-slate-800">{currentCustomer.mobile}</span>
              </div>
              <div className="py-1.5">
                <span className="text-slate-500 block mb-1">Permanent Residential Address</span>
                <span className="text-slate-700 leading-relaxed block">{currentCustomer.address}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Language Preferences */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-sm text-[#142B4A]">{t.languagePreference}</h3>
          </div>

          <p className="text-xs text-slate-500">
            Select your preferred regional language. All banking screens, forms, notifications, and transactions will adapt automatically.
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-[#2563EB] bg-blue-50/60 ring-1 ring-[#2563EB]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-sm text-[#142B4A]">{lang.nativeName}</div>
                  <div className="text-[11px] text-slate-400">{lang.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Change Password (Customer Only) */}
        {!isAdminSession && (
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <KeyRound className="w-4 h-4 text-[#2563EB]" />
              <h3 className="font-bold text-sm text-[#142B4A]">{t.changePassword}</h3>
            </div>

            {passwordMessage && (
              <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                passwordMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}>
                {passwordMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.newPassword}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.confirmPassword}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#142B4A] hover:bg-[#1f3f6b] rounded-lg transition-colors shadow-xs"
              >
                {t.updatePassword}
              </button>
            </form>
          </div>
        )}

        {/* 24x7 Support & Helpline */}
        <div className={`bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4 ${isAdminSession ? 'lg:col-span-2' : ''}`}>
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HelpCircle className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-sm text-[#142B4A]">{t.customerSupport}</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <PhoneCall className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block text-xs">
                  {t.tollFreeHelpline}
                </span>
                <span className="text-[11px] text-slate-400">Available 24 hours a day, 7 days a week</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <MapPin className="w-5 h-5 text-[#2563EB] shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block text-xs">
                  Karnataka Zonal Office
                </span>
                <span className="text-[11px] text-slate-500">
                  BankTM Towers, 100 Feet Road, Indiranagar, Bengaluru - 560038
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-between items-center gap-2 text-[11px] text-slate-400 border-t border-slate-100">
              <span>{t.simulatedNotice}</span>
              {confirmReset ? (
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-semibold">Reset all data?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmReset(false);
                      resetAllData();
                    }}
                    className="px-2.5 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="text-red-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo State</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
