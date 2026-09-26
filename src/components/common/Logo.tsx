import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  inverted?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSlogan = false,
  inverted = false,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Visual icon: Sound wave & vinyl record with rating star emblem */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] shadow-sm shadow-[#7C3AED]/25 shrink-0`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5 text-white"
        >
          {/* Stylized vinyl groove and wave bars */}
          <rect x="4" y="11" width="3" height="10" rx="1.5" fill="currentColor" opacity="0.6" />
          <rect x="10" y="6" width="3" height="20" rx="1.5" fill="currentColor" opacity="0.85" />
          <rect x="16" y="3" width="3" height="26" rx="1.5" fill="currentColor" />
          <rect x="22" y="8" width="3" height="16" rx="1.5" fill="currentColor" opacity="0.85" />
          {/* Subtle star / rating mark at top right */}
          <path
            d="M26 4L26.8 5.6L28.5 5.8L27.2 7L27.5 8.7L26 7.9L24.5 8.7L24.8 7L23.5 5.8L25.2 5.6L26 4Z"
            fill="#EDE9FE"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight leading-none ${textSizes[size]} ${
              inverted ? 'text-white' : 'text-[#18181B]'
            }`}
          >
            Vibe<span className="text-[#7C3AED]">Review</span>
          </span>
        </div>
        {showSlogan && (
          <span
            className={`text-xs mt-1 font-medium ${
              inverted ? 'text-[#EDE9FE]/80' : 'text-[#71717A]'
            }`}
          >
            Sua opinião também faz parte da música.
          </span>
        )}
      </div>
    </div>
  );
};
