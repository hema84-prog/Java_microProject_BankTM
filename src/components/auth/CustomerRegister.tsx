import React, { useState } from 'react';
import { 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  UserPlus, 
  Sparkles 
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BankLogo } from '../common/BankLogo';
import { LanguageSelector } from '../common/LanguageSelector';

export const CustomerRegister: React.FC = () => {
  const { registerCustomer, setAuthView, t } = useBanking();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    const res = registerCustomer({
      fullName,
      username,
      email,
      mobile,
      address,
      password,
    });

    if (!res.success) {
      setErrorMessage(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F7FA]">
      {/* Left Branding & Highlights */}
      <div className="lg:w-2/5 relative bg-[#142B4A] text-white p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
        <div className="relative z-10">
          <BankLogo variant="light" size="lg" showTagline={true} />
        </div>

        <div className="relative z-10 my-8 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest font-mono">
              Welcome to BankTM
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
              Open Your Instant Digital BankTM Account in Minutes
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              Enjoy zero-paperwork onboarding, instant ₹10,000 opening savings balance, complimentary debit card eligibility, and direct discovery of Indian government welfare schemes.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs text-blue-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Unique Customer Identification Number</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Savings Account with ₹10,000 Initial Demo Credit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multilingual Support in 6 Native Indian Languages</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-blue-300/70 border-t border-white/10 pt-4 flex items-center justify-between">
          <span>Protected by BankTM Core Integrity Engine</span>
          <span>IFSC: BTMN000104</span>
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="lg:w-3/5 p-6 sm:p-12 flex flex-col justify-between overflow-y-auto">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setAuthView('welcome')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#142B4A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Role Selection</span>
          </button>
          <LanguageSelector variant="light" />
        </div>

        <div className="my-auto max-w-lg w-full mx-auto space-y-5 py-6">
          <div>
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
              New Customer Onboarding
            </span>
            <h2 className="text-2xl font-bold text-[#142B4A] tracking-tight mt-1">
              {t.registerTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your details to create your secure digital banking profile
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-50 text-red-800 rounded-lg text-xs flex items-start gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.username} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Choose unique username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.email} *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.mobile} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.address} *
              </label>
              <textarea
                rows={2}
                required
                placeholder="House / Flat No., Street, City, State, PIN Code"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.password} *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.confirmPassword} *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-lg text-xs text-slate-600 flex items-start gap-2 border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                By registering, a standard Savings Account will be auto-provisioned at BankTM Indiranagar Branch with an initial ₹10,000 demo credit.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              {t.registerButton}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setAuthView('customer_login')}
              className="text-xs text-[#2563EB] hover:underline font-medium"
            >
              {t.alreadyHaveAccount}
            </button>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400">
          BankTM Digital Banking System
        </div>
      </div>
    </div>
  );
};
