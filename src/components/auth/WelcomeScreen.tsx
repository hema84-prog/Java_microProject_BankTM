import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  UserPlus, 
  ArrowRight, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Eye, 
  EyeOff,
  Shield,
  Check,
  Lock
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BankLogo } from '../common/BankLogo';
import { LanguageSelector } from '../common/LanguageSelector';
import { speakText, stopSpeech } from '../../utils/speech';
import communityHeroImg from '../../assets/images/banktm_community_hero.png';

export const WelcomeScreen: React.FC = () => {
  const { 
    setAuthView, 
    customerLogin, 
    adminLogin, 
    registerCustomer, 
    language, 
    t 
  } = useBanking();

  // Integrated quick auth state
  const [activePortalTab, setActivePortalTab] = useState<'customer' | 'admin' | 'register'>('customer');
  
  // Login form state
  const [loginUser, setLoginUser] = useState('rajesh');
  const [loginPass, setLoginPass] = useState('Password@123');
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Quick Register state
  const [regName, setRegName] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPass, setRegPass] = useState('');

  // Consent checkboxes (HDFC-style compliance)
  const [consent1, setConsent1] = useState(true);
  const [consent2, setConsent2] = useState(true);

  // Audio speech status
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleQuickCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!consent1) {
      setAuthError('Please agree to the banking authentication consent to proceed.');
      return;
    }
    const res = customerLogin(loginUser, loginPass);
    if (!res.success) {
      setAuthError(res.message || 'Login failed.');
    }
  };

  const handleQuickAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = adminLogin(loginUser, loginPass);
    if (!res.success) {
      setAuthError(res.message || 'Invalid administrator credentials.');
    }
  };

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!consent1) {
      setAuthError('Please agree to the banking authentication consent to proceed.');
      return;
    }
    if (regPass.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    const res = registerCustomer({
      fullName: regName,
      username: regUser,
      email: `${regUser}@banktm.customer`,
      mobile: regMobile || '+91 98765 00000',
      address: 'Karnataka, India',
      password: regPass,
    });
    if (!res.success) {
      setAuthError(res.message || 'Registration failed.');
    }
  };

  const handleAudioVoice = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      const speechContent = `${t.bankName}. ${t.tagline}. ${t.welcomeDesc}`;
      speakText(speechContent, language);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 9000);
    }
  };

  const quickDemoProfiles = [
    { name: 'Rajesh Sharma', user: 'rajesh', pass: 'Password@123', label: 'Customer (English)', role: 'customer' as const },
    { name: 'Anita Desai', user: 'anita', pass: 'Password@123', label: 'SHG Member (ಕನ್ನಡ)', role: 'customer' as const },
    { name: 'Priya Sundaram', user: 'priya', pass: 'Password@123', label: 'Trader (தமிழ்)', role: 'customer' as const },
    { name: 'Suresh Narayanan', user: 'admin', pass: 'BankTM@2026', label: 'Bank Administrator', role: 'admin' as const },
  ];

  const handleSelectDemo = (prof: typeof quickDemoProfiles[0]) => {
    setLoginUser(prof.user);
    setLoginPass(prof.pass);
    setAuthError(null);
    if (prof.role === 'admin') {
      setActivePortalTab('admin');
    } else {
      setActivePortalTab('customer');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172B4D] flex flex-col selection:bg-[#2563EB] selection:text-white">
      {/* 1. Real-time Rate Ticker Bar */}
      <div className="bg-[#071220] text-slate-300 text-[11px] font-mono py-1.5 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4">
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE CLEARING
          </span>
          <span>RBI Repo Rate: <strong>6.50%</strong></span>
          <span>·</span>
          <span>BankTM Savings Rate: <strong className="text-emerald-300">7.10% APY</strong></span>
          <span>·</span>
          <span>Direct Benefit Transfer (DBT): <strong className="text-blue-300">Instant Active</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span>Toll-Free: <strong>1800-425-2026</strong></span>
        </div>
      </div>

      {/* 2. Top Header Navigation (Matching HDFC Bank layout reference) */}
      <header className="sticky top-0 z-30 bg-[#002C6C] text-white px-4 sm:px-8 h-16 sm:h-18 flex items-center justify-between shadow-md">
        {/* Left: BankTM Logo in clean white rectangular badge (like HDFC Bank logo) */}
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-md px-3 py-1.5 shadow-sm border border-slate-200">
            <BankLogo variant="dark" size="sm" showTagline={false} />
          </div>
        </div>

        {/* Right: Audio Voice + Language Selector + 100% Safe & Secure Badge */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Audio Voice Readout Button */}
          <button
            type="button"
            onClick={handleAudioVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer ${
              isSpeaking 
                ? 'bg-amber-400 text-slate-950 animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
            title="Listen to BankTM welcome spoken in your language"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-slate-950" /> : <Volume2 className="w-3.5 h-3.5 text-blue-200" />}
            <span className="hidden sm:inline">
              {isSpeaking ? 'Stop Voice' : 'Voice (ಧ್ವನಿ / आवाज)'}
            </span>
          </button>

          {/* Multilingual Selector */}
          <LanguageSelector variant="header" />

          {/* 100% SAFE & SECURE Badge (Exact styling from HDFC Bank reference image) */}
          <div className="hidden sm:flex items-center gap-2 bg-[#005128] border border-emerald-400/40 text-emerald-100 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-inner">
            <div className="w-4 h-4 rounded-full bg-emerald-400 text-[#005128] flex items-center justify-center font-black text-[10px]">
              ✓
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[11px] tracking-wider font-extrabold text-white">100%</span>
              <span className="text-[8px] tracking-widest text-emerald-200 uppercase">Safe & Secure</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. FULL-WIDTH PROMOTIONAL BANNER PART (Exact reference layout: Top festive banner) */}
      <section className="w-full bg-[#FFF3D6] border-b border-amber-200/80">
        {/* Banner Red Headline Ribbon */}
        <div className="bg-[#FFF8E7] text-center py-2 px-4 border-b border-amber-200 text-xs sm:text-sm font-extrabold text-[#D8232A] tracking-wide uppercase">
          You are close to Bigger Welfare Benefits & 7.10% APY Savings on Every Deposit
        </div>

        {/* Main Banner Body: Festive background with curated perks and the community women photograph */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="relative rounded-2xl overflow-hidden bg-linear-to-r from-[#003B95] via-[#004BBD] to-[#002C6C] text-white shadow-lg border border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6 p-4 sm:p-6 lg:p-8">
            
            {/* Left Promotional Information Box (Festive Treats Card) */}
            <div className="md:w-1/2 space-y-3 z-10 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inclusive Digital Banking Initiative</span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Empowering Indian Citizens with Direct Benefit Transfers (DBT)
              </h1>

              <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-1.5">
                <div className="text-xs sm:text-sm font-bold text-amber-300">
                  BankTM Savings & Current Accounts · Up to 7.10% APY
                </div>
                <div className="text-[11px] sm:text-xs text-blue-100 leading-relaxed">
                  Direct Aadhaar-seeded accounts for PM-KISAN, Karnataka Gruha Lakshmi, Yuva Nidhi, and collateral-free Mudra credit on smartphones in 6 native languages.
                </div>
              </div>

              <div className="text-[10px] text-blue-200/80 font-mono">
                *T&C Apply. RBI Approved Banking Corporation · NPCI & RuPay Clearing Member
              </div>
            </div>

            {/* Right: The Women's Photograph (Faces & Phones 100% Clearly Visible with object-top) */}
            <div className="md:w-1/2 w-full z-10">
              <div className="rounded-xl overflow-hidden border-2 border-amber-300/60 shadow-2xl bg-slate-900">
                <div className="relative w-full aspect-[16/10] sm:aspect-[21/11] max-h-[280px] overflow-hidden">
                  <img 
                    src="/assets/aistudio/image_d2b1dd33.png" 
                    alt="Indian Women Citizens Empowered by Digital Banking and Government Schemes" 
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallbackApplied) {
                        target.dataset.fallbackApplied = 'true';
                        target.src = communityHeroImg;
                      }
                    }}
                  />
                  
                  {/* Subtle lower tag on the photo */}
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[10px] font-semibold flex items-center justify-between">
                    <span className="truncate">Self-Help Groups & DBT Verified</span>
                    <span className="font-mono text-emerald-400 shrink-0">100% Verified</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. BELOW THE BANNER: SIGN IN TO BANKING PART (Exact reference layout: Form below banner) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 lg:p-10 space-y-6">
          
          {/* Header Row: Title on Left, Radio Selectors on Right (Matching reference layout) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#142B4A] tracking-tight">
                {activePortalTab === 'customer' && 'Get Started with BankTM in 3 Easy Steps!'}
                {activePortalTab === 'register' && 'Open Your Digital Savings Account in 3 Easy Steps!'}
                {activePortalTab === 'admin' && 'Bank Administrator Terminal Sign In'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activePortalTab === 'customer' && 'Sign in to access your savings, current accounts, transfers and DBT benefits.'}
                {activePortalTab === 'register' && 'Instant onboarding with ₹10,000 initial credit and zero paperwork.'}
                {activePortalTab === 'admin' && 'Authorized personnel access for branch management and transaction auditing.'}
              </p>
            </div>

            {/* Radio-style Selectors (Matching HDFC screenshot: Pan Card / Date of Birth radio options) */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="portalSelector"
                  checked={activePortalTab === 'customer'}
                  onChange={() => { setActivePortalTab('customer'); setAuthError(null); }}
                  className="w-4 h-4 text-[#002C6C] focus:ring-[#002C6C]"
                />
                <span className={activePortalTab === 'customer' ? 'text-[#002C6C] font-bold' : 'text-slate-600'}>
                  Customer Login
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="portalSelector"
                  checked={activePortalTab === 'register'}
                  onChange={() => { setActivePortalTab('register'); setAuthError(null); }}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-600"
                />
                <span className={activePortalTab === 'register' ? 'text-emerald-700 font-bold' : 'text-slate-600'}>
                  New Customer
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="portalSelector"
                  checked={activePortalTab === 'admin'}
                  onChange={() => { setActivePortalTab('admin'); setAuthError(null); }}
                  className="w-4 h-4 text-red-600 focus:ring-red-600"
                />
                <span className={activePortalTab === 'admin' ? 'text-red-700 font-bold' : 'text-slate-600'}>
                  Bank Admin
                </span>
              </label>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 text-red-800 rounded-lg text-xs border border-red-200 font-medium">
              {authError}
            </div>
          )}

          {/* Form Mode A: Customer Login (Matching HDFC 2-input row layout) */}
          {activePortalTab === 'customer' && (
            <form onSubmit={handleQuickCustomerLogin} className="space-y-5">
              {/* 2 Wide Input Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Field 1: Mobile Number / Username with Indian Flag prefix */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Enter your Registered Username / Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1 text-xs text-slate-500 font-medium select-none border-r border-slate-200 pr-2">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      placeholder="e.g. rajesh or 9876543210"
                      className="w-full pl-20 pr-3 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002C6C] bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* Field 2: Password / MPIN with Show/Hide toggle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Enter Password / MPIN
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="Enter / Select Password"
                      className="w-full px-3 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002C6C] pr-10 bg-white text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={showPass ? 'Hide Password' : 'Show Password'}
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Informational Callout Box (Matching HDFC reference callout) */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">
                  We will be authenticating your session securely.
                </div>
                <div className="text-[11px] text-slate-500">
                  Please enter your BankTM registered mobile number or customer username, if you already have an existing relationship (Savings/Current/KCC Account) with us.
                </div>
              </div>

              {/* 1-Click Instant Demo Login Profiles (For easy immediate testing) */}
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#002C6C] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Quick 1-Click Demo Profiles (Pre-filled):</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Instant evaluation</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {quickDemoProfiles.map((prof, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDemo(prof)}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        loginUser === prof.user
                          ? 'border-[#002C6C] bg-white ring-2 ring-[#002C6C] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs text-[#142B4A] truncate">
                        {prof.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {prof.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Consent Checkboxes (Matching HDFC screenshot: Two checkboxes with hyperlinks) */}
              <div className="space-y-2.5 pt-1 text-xs text-slate-600">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent1}
                    onChange={(e) => setConsent1(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#002C6C] focus:ring-[#002C6C]"
                  />
                  <span>
                    I hereby consent to collection and processing of my credentials for secure digital banking authentication and DBT linking in the manner described in the notice <span className="text-blue-600 hover:underline">here</span>.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent2}
                    onChange={(e) => setConsent2(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#002C6C] focus:ring-[#002C6C]"
                  />
                  <span>
                    I hereby consent to processing of my Data for receiving transaction alerts on WhatsApp & SMS in my preferred regional language as per BankTM citizen charter <span className="text-blue-600 hover:underline">here</span>.
                  </span>
                </label>
              </div>

              {/* Primary Action Button (Matching HDFC blue button) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-64 py-3 text-xs sm:text-sm font-bold text-white bg-[#002C6C] hover:bg-[#003B95] rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In to Banking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-xs text-slate-500">
                  Default credentials: <code className="font-mono text-slate-800 font-bold">rajesh / Password@123</code>
                </div>
              </div>
            </form>
          )}

          {/* Form Mode B: New Customer Registration */}
          {activePortalTab === 'register' && (
            <form onSubmit={handleQuickRegister} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002C6C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Choose Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ramesh"
                    value={regUser}
                    onChange={(e) => setRegUser(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002C6C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002C6C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Set Login Password (Min 6 characters) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  className="w-full max-w-md px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002C6C]"
                />
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant ₹10,000 Opening Demo Credit</span>
                </div>
                <div className="text-[11px] text-emerald-800">
                  Your new Savings Account will be auto-provisioned at Indiranagar Branch with IFSC <span className="font-mono font-bold">BTMN000104</span>.
                </div>
              </div>

              {/* Consent Checkboxes */}
              <div className="space-y-2 text-xs text-slate-600">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent1}
                    onChange={(e) => setConsent1(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#002C6C]"
                  />
                  <span>
                    I hereby consent to creation of my BankTM digital customer profile and agree to terms & conditions.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full sm:w-72 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Create Account & Launch Banking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form Mode C: Admin Terminal */}
          {activePortalTab === 'admin' && (
            <form onSubmit={handleQuickAdminLogin} className="space-y-5">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-xs text-red-900">
                <strong>Pre-configured Administrator Credentials:</strong> <code className="font-mono font-bold">admin</code> / <code className="font-mono font-bold">BankTM@2026</code>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Admin Terminal Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full px-3 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Master Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full px-3 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-72 py-3 text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Enter Administration Console</span>
              </button>
            </form>
          )}

        </div>
      </main>

      {/* 5. Institutional Footer */}
      <footer className="mt-auto bg-[#071220] text-white py-6 px-4 sm:px-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white px-2 py-0.5 rounded text-[#002C6C] font-black text-xs">
              BankTM
            </div>
            <span className="text-slate-400">· Banking Made Simple, Dignified & Accessible for Everyone</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-300 text-[11px]">
            <span>Toll-Free: <strong>1800-425-2026</strong></span>
            <span>·</span>
            <span>Supported Languages: <strong>6 Native Scripts (English, ಕನ್ನಡ, हिन्दी, தமிழ், తెలుగు, മലയാളം)</strong></span>
            <span>·</span>
            <span>256-Bit SSL Secured</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
