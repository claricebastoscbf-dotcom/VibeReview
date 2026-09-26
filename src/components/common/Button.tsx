import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3 rounded-lg gap-1.5 min-h-[34px]',
    md: 'text-sm py-2.5 px-4 rounded-xl gap-2 min-h-[42px]',
    lg: 'text-base py-3 px-6 rounded-xl gap-2.5 min-h-[48px]',
  };

  const variantClasses = {
    primary:
      'bg-[#7C3AED] text-white hover:bg-[#6D28D9] active:bg-[#4C1D95] shadow-sm shadow-[#7C3AED]/20 focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2',
    secondary:
      'bg-[#EDE9FE] text-[#4C1D95] hover:bg-[#DDD6FE] active:bg-[#C4B5FD] font-semibold focus-visible:ring-2 focus-visible:ring-[#7C3AED]',
    gradient:
      'bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white hover:opacity-95 shadow-md shadow-[#7C3AED]/25 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#7C3AED]',
    outline:
      'border border-[#E4E4E7] bg-white text-[#18181B] hover:bg-[#F8F7FC] hover:border-[#D4D4D8] active:bg-[#EDE9FE]/40 focus-visible:ring-2 focus-visible:ring-[#7C3AED]',
    ghost:
      'text-[#71717A] hover:text-[#18181B] hover:bg-[#EDE9FE]/50 active:bg-[#EDE9FE] focus-visible:ring-2 focus-visible:ring-[#7C3AED]',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm focus-visible:ring-2 focus-visible:ring-red-500',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none whitespace-nowrap outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Carregando...</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span className="truncate">{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
