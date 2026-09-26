import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Backdrop click */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-2xl border border-[#E4E4E7] overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-[#F4F4F5]">
            <div className="space-y-1 pr-6">
              {title && (
                <h3 className="text-xl font-bold text-[#18181B] tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-[#71717A] leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
