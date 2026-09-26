import React from 'react';
import { Star, Minus, Plus, Sparkles } from 'lucide-react';
import { getRatingLabel, formatRating, getRatingColorClasses } from '../../utils/rating';

interface RatingProps {
  value: number; // 0.0 to 10.0
  onChange?: (value: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  interactive = false,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const safeValue = Math.min(10, Math.max(0, Math.round(value * 2) / 2));
  const label = getRatingLabel(safeValue);
  const colors = getRatingColorClasses(safeValue);

  const handleStep = (delta: number) => {
    if (!interactive || !onChange) return;
    const next = Math.min(10, Math.max(0, Math.round((safeValue + delta) * 2) / 2));
    onChange(next);
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!interactive || !onChange) return;
    onChange(parseFloat(e.target.value));
  };

  const presets = [5.0, 7.0, 8.5, 9.5, 10.0];

  if (!interactive) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold tabular-nums text-xs sm:text-sm ${colors.pillBg}`}
        >
          <Star size={14} className="fill-current" />
          <span>{formatRating(safeValue)}</span>
          <span className="opacity-60 text-[10px]">/10</span>
        </div>

        {showLabel && (
          <span className="text-xs font-semibold text-[#71717A]">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3.5 p-4 rounded-2xl bg-[#EDE9FE]/30 border border-[#DDD6FE] ${className}`}>
      {/* Top Value Display & Classification */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#2E1065] tabular-nums tracking-tight">
              {formatRating(safeValue)}
            </span>
            <span className="text-xs font-bold text-[#71717A]">/ 10.0</span>
          </div>

          <div
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${colors.badgeBg}`}
          >
            {safeValue >= 9.0 && <Sparkles size={13} className="text-amber-300" />}
            <span>{label}</span>
          </div>
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E4E4E7]">
          <button
            type="button"
            onClick={() => handleStep(-0.5)}
            disabled={safeValue <= 0}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F8F7FC] disabled:opacity-30 cursor-pointer"
            aria-label="Diminuir 0.5"
          >
            <Minus size={14} />
          </button>
          <div className="h-4 w-px bg-[#E4E4E7]" />
          <button
            type="button"
            onClick={() => handleStep(0.5)}
            disabled={safeValue >= 10}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F8F7FC] disabled:opacity-30 cursor-pointer"
            aria-label="Aumentar 0.5"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Slider Control */}
      <div className="space-y-1.5">
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={safeValue}
          onChange={handleSlider}
          className="w-full h-2 bg-[#DDD6FE] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
        />

        <div className="flex justify-between text-[10px] font-semibold text-[#71717A] tabular-nums px-0.5">
          <span>0.0</span>
          <span>2.0</span>
          <span>4.0</span>
          <span>6.0</span>
          <span>8.0</span>
          <span>10.0</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-1.5 pt-1">
        <span className="text-[11px] font-semibold text-[#71717A] mr-1">Atalhos:</span>
        {presets.map(p => (
          <button
            key={p}
            type="button"
            onClick={() => onChange && onChange(p)}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border ${
              safeValue === p
                ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                : 'bg-white text-[#4C1D95] border-[#E4E4E7] hover:border-[#C4B5FD]'
            }`}
          >
            {formatRating(p)}
          </button>
        ))}
      </div>
    </div>
  );
};
