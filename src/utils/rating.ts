import { RatingLabel } from '../types';

export function getRatingLabel(score: number): RatingLabel {
  const rounded = Math.round(score * 2) / 2;
  if (rounded < 2) return 'Péssimo';
  if (rounded < 4) return 'Fraco';
  if (rounded < 6) return 'Regular';
  if (rounded < 8) return 'Bom';
  if (rounded < 9) return 'Muito bom';
  return 'Excelente';
}

export function formatRating(score: number): string {
  if (Number.isInteger(score)) {
    return `${score}.0`;
  }
  return score.toFixed(1);
}

export function getRatingColorClasses(score: number) {
  if (score >= 9.0) {
    return {
      badgeBg: 'bg-[#2E1065] text-[#EDE9FE] border-[#7C3AED]/40',
      pillBg: 'bg-[#EDE9FE] text-[#4C1D95]',
      starColor: 'text-[#7C3AED]',
      indicator: 'bg-[#7C3AED]',
    };
  }
  if (score >= 8.0) {
    return {
      badgeBg: 'bg-[#7C3AED] text-white border-transparent',
      pillBg: 'bg-[#EDE9FE] text-[#7C3AED]',
      starColor: 'text-[#7C3AED]',
      indicator: 'bg-[#7C3AED]',
    };
  }
  if (score >= 6.0) {
    return {
      badgeBg: 'bg-[#4C1D95] text-white border-transparent',
      pillBg: 'bg-violet-100 text-[#4C1D95]',
      starColor: 'text-[#6D28D9]',
      indicator: 'bg-[#6D28D9]',
    };
  }
  if (score >= 4.0) {
    return {
      badgeBg: 'bg-amber-600 text-white border-transparent',
      pillBg: 'bg-amber-50 text-amber-800',
      starColor: 'text-amber-500',
      indicator: 'bg-amber-500',
    };
  }
  if (score >= 2.0) {
    return {
      badgeBg: 'bg-orange-600 text-white border-transparent',
      pillBg: 'bg-orange-50 text-orange-800',
      starColor: 'text-orange-500',
      indicator: 'bg-orange-500',
    };
  }
  return {
    badgeBg: 'bg-rose-600 text-white border-transparent',
    pillBg: 'bg-rose-50 text-rose-800',
    starColor: 'text-rose-500',
    indicator: 'bg-rose-500',
  };
}
