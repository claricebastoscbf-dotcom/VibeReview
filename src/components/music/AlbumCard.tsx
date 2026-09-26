import React, { useState } from 'react';
import { Album } from '../../types';
import { RatingBadge } from '../common/RatingBadge';
import { Disc3, Star, PenLine, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AlbumCardProps {
  album: Album;
  layout?: 'grid' | 'compact' | 'featured';
  className?: string;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  layout = 'grid',
  className = '',
}) => {
  const { navigateTo, openCreateReview, toggleFavoriteAlbum, currentUser } = useApp();
  const [imageError, setImageError] = useState(false);

  const isFav = currentUser.favoriteAlbumIds?.includes(album.id);

  const handleCardClick = () => {
    navigateTo('album-detail', { albumId: album.id });
  };

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo('artist-detail', { artistId: album.artistId });
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCreateReview(album);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteAlbum(album.id);
  };

  if (layout === 'compact') {
    return (
      <div
        onClick={handleCardClick}
        className={`group flex items-center gap-3.5 p-2.5 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#C4B5FD] transition-all hover:shadow-sm cursor-pointer ${className}`}
      >
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#2E1065] shrink-0">
          {!imageError ? (
            <img
              src={album.coverUrl}
              alt={album.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#EDE9FE]">
              <Disc3 size={20} className="animate-spin-slow" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-[#18181B] truncate group-hover:text-[#7C3AED] transition-colors">
            {album.title}
          </h4>
          <p
            onClick={handleArtistClick}
            className="text-xs text-[#71717A] truncate hover:text-[#4C1D95]"
          >
            {album.artist} <span aria-hidden="true">·</span> {album.releaseYear}
          </p>
        </div>

        <RatingBadge rating={album.averageRating} size="sm" />
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col bg-white rounded-2xl p-3 border border-[#E4E4E7] hover:border-[#C4B5FD] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer ${className}`}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#2E1065] mb-3">
        {!imageError ? (
          <img
            src={album.coverUrl}
            alt={album.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#4C1D95] to-[#2E1065] text-white p-4 text-center">
            <Disc3 size={32} className="text-[#EDE9FE] mb-1 animate-spin-slow" />
            <span className="text-xs font-semibold text-[#EDE9FE] line-clamp-1">{album.title}</span>
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-[#2E1065]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2">
          <button
            onClick={handleReviewClick}
            className="bg-[#7C3AED] text-white p-2.5 rounded-xl hover:bg-[#6D28D9] transition-transform active:scale-95 shadow-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Escrever Resenha"
          >
            <PenLine size={14} />
            <span>Avaliar</span>
          </button>
          <button
            onClick={handleFavoriteClick}
            className={`p-2.5 rounded-xl transition-transform active:scale-95 shadow-md flex items-center justify-center cursor-pointer ${
              isFav ? 'bg-rose-500 text-white' : 'bg-white text-[#18181B] hover:bg-[#EDE9FE]'
            }`}
            title={isFav ? 'Remover dos favoritos' : 'Favoritar'}
            aria-label="Favoritar álbum"
          >
            <Heart size={14} className={isFav ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Top-Right Badge (Score) */}
        <div className="absolute top-2 right-2">
          <div className="bg-[#18181B]/85 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm tabular-nums">
            <Star size={11} className="fill-[#FBBF24] text-[#FBBF24]" />
            <span>{album.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Info details */}
      <div className="flex flex-col flex-1">
        <h4 className="text-sm font-bold text-[#18181B] line-clamp-1 group-hover:text-[#7C3AED] transition-colors">
          {album.title}
        </h4>
        <p
          onClick={handleArtistClick}
          className="text-xs font-medium text-[#71717A] truncate mt-0.5 hover:text-[#4C1D95]"
        >
          {album.artist}
        </p>

        {/* Unboxed metadata: Year · Genre */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#A1A1AA] mt-2 pt-2 border-t border-[#F4F4F5]">
          <span>{album.releaseYear}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{album.genre}</span>
          <span aria-hidden="true">·</span>
          <span className="shrink-0">{album.reviewsCount} resenhas</span>
        </div>
      </div>
    </div>
  );
};
