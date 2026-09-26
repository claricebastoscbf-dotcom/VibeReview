import React, { useState } from 'react';
import { Artist } from '../../types';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { UserCheck, UserPlus, Users } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
  className?: string;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, className = '' }) => {
  const { toggleFollowArtist, navigateTo } = useApp();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    navigateTo('artist-detail', { artistId: artist.id });
  };

  return (
    <div
      onClick={handleCardClick}
      className={`flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-[#E4E4E7] hover:border-[#C4B5FD] transition-all hover:shadow-xs group cursor-pointer ${className}`}
    >
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#EDE9FE] mb-3 border-2 border-white shadow-xs">
        {!imageError ? (
          <img
            src={artist.avatarUrl}
            alt={artist.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#4C1D95]">
            {artist.name.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <h4 className="text-sm font-bold text-[#18181B] truncate max-w-full group-hover:text-[#7C3AED] transition-colors">
        {artist.name}
      </h4>

      {/* Unboxed genre tags */}
      <p className="text-xs text-[#71717A] truncate max-w-full mt-0.5">
        {artist.genres.slice(0, 2).join(' · ')}
      </p>

      <div className="flex items-center gap-1 text-[11px] text-[#A1A1AA] mt-1 mb-3 tabular-nums">
        <Users size={12} />
        <span>{artist.monthlyListeners} ouvintes/mês</span>
      </div>

      <Button
        variant={artist.isFollowed ? 'outline' : 'secondary'}
        size="sm"
        fullWidth
        onClick={e => {
          e.stopPropagation();
          toggleFollowArtist(artist.id);
        }}
        leftIcon={
          artist.isFollowed ? (
            <UserCheck size={14} className="text-[#7C3AED]" />
          ) : (
            <UserPlus size={14} />
          )
        }
      >
        {artist.isFollowed ? 'Seguindo' : 'Seguir'}
      </Button>
    </div>
  );
};
