import React, { useState } from 'react';
import { Track } from '../../types';
import { Play, Pause, Heart, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TrackCardProps {
  track: Track;
  index?: number;
  className?: string;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, index, className = '' }) => {
  const { navigateTo, toggleFavoriteTrack, currentUser } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  const isLiked = currentUser.favoriteTrackIds?.includes(track.id);

  const handleCardClick = () => {
    navigateTo('track-detail', { trackId: track.id });
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group flex items-center justify-between p-3 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#C4B5FD] hover:bg-[#F8F7FC] transition-colors cursor-pointer ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
          className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
          aria-label={isPlaying ? 'Pausar prévia' : 'Ouvir prévia'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>

        {index !== undefined && (
          <span className="text-xs font-semibold text-[#A1A1AA] w-4 text-center tabular-nums">
            {index + 1}
          </span>
        )}

        <div className="min-w-0">
          <h5 className="text-sm font-semibold text-[#18181B] truncate group-hover:text-[#7C3AED] transition-colors">
            {track.title}
          </h5>
          <p className="text-xs text-[#71717A] truncate">
            {track.artist} <span aria-hidden="true">·</span> {track.albumTitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-2">
        <div className="flex items-center gap-1 text-xs font-bold text-[#4C1D95] tabular-nums">
          <Star size={12} className="fill-[#7C3AED] text-[#7C3AED]" />
          <span>{track.averageRating.toFixed(1)}</span>
        </div>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleFavoriteTrack(track.id);
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isLiked ? 'text-rose-500' : 'text-[#A1A1AA] hover:text-rose-500'
          }`}
          aria-label="Curtir faixa"
        >
          <Heart size={14} className={isLiked ? 'fill-current' : ''} />
        </button>

        <span className="text-xs text-[#71717A] tabular-nums font-mono">
          {track.duration}
        </span>
      </div>
    </div>
  );
};
