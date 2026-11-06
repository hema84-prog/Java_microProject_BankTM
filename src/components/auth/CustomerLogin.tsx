import React, { useState } from 'react';
import { 
  User, 
  KeyRound, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BankLogo } from '../common/BankLogo';
import { LanguageSelector } from '../common/LanguageSelector';

export const CustomerLogin: React.FC = () => {
  const { customerLogin, setAuthView, t } = useBanking();

  const [username, setUsername] = useState('rajesh');
  const [password, setPassword] = useState('Password@123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotDemoNotice, setForgotDemoNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const res = customerLogin(username, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Login failed.');
    }
  };

  const autofillDemo = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F7FA]">
      {/* Left Branding & Image Section */}
      <div className="lg:w-1/2 relative bg-[#142B4A] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
        <div className="relative z-10">
          <BankLogo variant="light" size="lg" showTagline={true} />
        </div>

        <div className="relative z-10 my-6 space-y-5">
          <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900">
            <img 
              src="/public/assets/aistudio/image_d2b1dd33.png" 
              alt="BankTM Customer Banking – Empowering Women Citizens" 
              className="w-full aspect-[4/3] sm:aspect-[16/11] max-h-[440px] object-cover object-top"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('/src/assets/images/banktm_community_hero.png')) {
                  target.src = '/src/assets/images/banktm_community_hero.png';
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {t.tagline}
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed max-w-lg">
              {t.welcomeDesc}
            </p>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-blue-300/70 border-t border-white/10 pt-4 flex items-center justify-between">
          <span>Customer Authentication Gateway</span>
          <span>Security Protocol TLS 1.3</span>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-between">
        {/* Top Header with Back Button and Language Selector */}
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

        {/* Centered Form */}
        <div className="my-auto max-w-sm w-full mx-auto space-y-6 py-6">
          <div>
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
              Customer Portal
            </span>
            <h2 className="text-2xl font-bold text-[#142B4A] tracking-tight mt-1">
              {t.loginTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in with your registered customer credentials
            </p>
          </div>

          {/* Quick Demo Autofill Switcher */}
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-[#142B4A]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Demo Customer Logins</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => autofillDemo('rajesh', 'Password@123')}
                className="px-2.5 py-1 bg-white hover:bg-blue-100 text-[#142B4A] font-medium rounded-md border border-slate-200 text-[11px] transition-colors"
              >
                Rajesh (English)
              </button>
              <button
                type="button"
                onClick={() => autofillDemo('anita', 'Password@123')}
                className="px-2.5 py-1 bg-white hover:bg-blue-100 text-[#142B4A] font-medium rounded-md border border-slate-200 text-[11px] transition-colors"
              >
                Anita (ಕನ್ನಡ)
              </button>
              <button
                type="button"
                onClick={() => autofillDemo('priya', 'Password@123')}
                className="px-2.5 py-1 bg-white hover:bg-blue-100 text-[#142B4A] font-medium rounded-md border border-slate-200 text-[11px] transition-colors"
              >
                Priya (தமிழ்)
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-50 text-red-800 rounded-lg text-xs flex items-start gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {forgotDemoNotice && (
            <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-xs border border-amber-200 space-y-1">
              <p className="font-semibold">Password Reset Demonstration:</p>
              <p className="text-[11px]">
                In this demo environment, your registered password is <strong>Password@123</strong>. Alternatively, contact branch administration or register a new customer profile.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.username}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter username"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  {t.password}
                </label>
                <button
                  type="button"
                  onClick={() => setForgotDemoNotice(!forgotDemoNotice)}
                  className="text-[11px] text-[#2563EB] hover:underline"
                >
                  {t.forgotPassword}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#142B4A] hover:bg-[#1f3f6b] rounded-lg transition-colors shadow-xs"
            >
              {t.loginButton}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setAuthView('customer_register')}
              className="text-xs text-[#2563EB] hover:underline font-medium"
            >
              {t.noAccountYet}
            </button>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400">
          BankTM Digital Banking System · Unified Core Multi-Currency Architecture
        </div>
      </div>
    </div>
  );
};
