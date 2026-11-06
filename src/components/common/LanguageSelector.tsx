import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { Language } from '../../types';

interface LanguageSelectorProps {
  variant?: 'light' | 'dark' | 'header';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { language, setLanguage } = useBanking();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2563EB] ${
          variant === 'dark' 
            ? 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700'
            : variant === 'light'
            ? 'bg-white/90 text-slate-800 hover:bg-white shadow-xs border border-slate-200'
            : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs'
        }`}
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
        <span>Language: <strong>{currentLang.nativeName}</strong></span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 rounded-lg bg-white border border-slate-200 shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            Select Language / ಭಾಷೆ
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                  isSelected 
                    ? 'bg-blue-50 text-[#2563EB] font-semibold' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-[13px]">{lang.nativeName}</span>
                  <span className="text-[11px] text-slate-400">{lang.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#2563EB]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
