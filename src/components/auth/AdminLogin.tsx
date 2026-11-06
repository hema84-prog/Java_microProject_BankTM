import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  ArrowLeft, 
  AlertCircle, 
  Lock, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BankLogo } from '../common/BankLogo';

export const AdminLogin: React.FC = () => {
  const { adminLogin, setAuthView, t } = useBanking();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('BankTM@2026');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const res = adminLogin(username, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Invalid administrator credentials.');
    }
  };

  const handleAutofill = () => {
    setUsername('admin');
    setPassword('BankTM@2026');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0A1627]">
      {/* Left Branding / Security Pillar */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between text-white border-r border-slate-800">
        <div>
          <div className="flex items-center gap-2 select-none">
            <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">
              Bank<span className="text-red-500">TM Admin</span>
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono mt-1 block">
            Centralized Core Banking Operations Console
          </span>
        </div>

        <div className="my-8 space-y-5 max-w-md">
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Restricted Institutional Access</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This terminal is reserved strictly for authorized BankTM compliance officers, branch managers, and credit underwriting administrators.
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-400">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Full audit logging of account provisioning</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Debit & credit card lifecycle approval</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Central welfare scheme directory governance</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono border-t border-slate-800 pt-4 flex items-center justify-between">
          <span>Security Enclave: ACTIVE</span>
          <span>Compliance Standard: ISO 27001</span>
        </div>
      </div>

      {/* Right Login Portal */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-between bg-[#0E1E34]">
        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => setAuthView('welcome')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Role Selection</span>
          </button>
        </div>

        <div className="my-auto max-w-sm w-full mx-auto space-y-6 py-6">
          <div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest font-mono">
              Administrative Control Console
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              Administrator Login
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign in with your master banking administration credentials
            </p>
          </div>

          {/* Preset Demo Credentials Reminder */}
          <div className="p-3 bg-red-950/40 rounded-xl border border-red-900/60 text-xs text-red-200 flex items-start justify-between gap-3">
            <div>
              <span className="font-semibold block text-red-300">Default Demo Credentials:</span>
              <span className="font-mono text-[11px] text-slate-300">
                User: <strong>admin</strong> · Pass: <strong>BankTM@2026</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutofill}
              className="px-2 py-1 bg-red-800/60 hover:bg-red-800 text-white rounded text-[10px] font-semibold transition-colors shrink-0"
            >
              Autofill
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-950 text-red-200 rounded-lg text-xs flex items-start gap-2 border border-red-800">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Administrator Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-700 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Master Security Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-700 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
            >
              Authorize Administrative Access
            </button>
          </form>

          <div className="text-center text-[11px] text-slate-500">
            Internal operations system. Unauthorized attempts are monitored and audited.
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          BankTM Core Banking Engine · Institutional Governance
        </div>
      </div>
    </div>
  );
};
