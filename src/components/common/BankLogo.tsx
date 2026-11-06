import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface BankLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BankLogo: React.FC<BankLogoProps> = ({ 
  variant = 'dark', 
  size = 'md',
  showTagline = false 
}) => {
  const isDark = variant === 'dark';
  
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`flex items-center justify-center rounded-lg ${iconSizes[size]} ${
        isDark ? 'bg-[#142B4A] text-white shadow-sm' : 'bg-white text-[#142B4A] shadow-sm'
      }`}>
        <ShieldCheck className={size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} />
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className={`font-bold tracking-tight ${textSizes[size]} ${
            isDark ? 'text-[#142B4A]' : 'text-white'
          }`}>
            Bank<span className="text-[#2563EB]">TM</span>
          </span>
        </div>
        {showTagline && (
          <span className={`text-[11px] font-medium tracking-wide -mt-1 ${
            isDark ? 'text-[#64748B]' : 'text-blue-100'
          }`}>
            Banking Made Simple for Everyone
          </span>
        )}
      </div>
    </div>
  );
};
