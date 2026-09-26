import React from 'react';
import { Star, Sparkles } from 'lucide-react';
import { getRatingLabel, formatRating, getRatingColorClasses } from '../../utils/rating';

interface RatingBadgeProps {
  rating: number; // 0.0 to 10.0 (or normalized to 10 if <= 5)
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showMax?: boolean;
  className?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  max = 10,
  size = 'md',
  showLabel = false,
  showMax = false,
  className = '',
}) => {
  // Normalize if passed on 0-5 scale
  const normalizedRating = rating <= 5.0 && rating > 0 && max === 5 ? rating * 2 : rating;
  const safeScore = Math.min(10, Math.max(0, Math.round(normalizedRating * 2) / 2));
  const label = getRatingLabel(safeScore);
  const colors = getRatingColorClasses(safeScore);

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-0.5 rounded-md',
    sm: 'text-xs px-2 py-0.5 gap-1 rounded-lg',
    md: 'text-sm px-2.5 py-1 gap-1.5 rounded-xl font-bold',
    lg: 'text-base px-3 py-1.5 gap-2 rounded-xl font-black',
  };

  const starSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className={`inline-flex items-center font-bold tabular-nums border ${sizeClasses[size]} ${colors.badgeBg}`}
      >
        <Star size={starSizes[size]} className="fill-current shrink-0" />
        <span>{formatRating(safeScore)}</span>
        {showMax && (
          <span className="opacity-70 font-normal text-[10px]">/{max}</span>
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold text-[#71717A]">
          {label}
        </span>
      )}
    </div>
  );
};
