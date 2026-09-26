import React, { useState } from 'react';
import { Review } from '../../types';
import { Avatar } from '../common/Avatar';
import { RatingBadge } from '../common/RatingBadge';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ThumbsUp,
  RotateCcw,
  Trash2,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ReviewCardProps {
  review: Review;
  className?: string;
  showFullText?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  className = '',
  showFullText = false,
}) => {
  const { toggleLikeReview, toggleSaveReview, deleteReview, currentUser, navigateTo, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isMyReview =
    currentUser.id === review.userId ||
    currentUser.username === review.userUsername;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza de que deseja excluir sua resenha?')) {
      setIsDeleting(true);
      await deleteReview(review.id);
      setIsDeleting(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    showToast('Link da resenha copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = () => {
    navigateTo('review-detail', { reviewId: review.id });
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo('user-profile', { username: review.userUsername });
  };

  const handleAlbumClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (review.albumId) {
      navigateTo('album-detail', { albumId: review.albumId });
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl p-5 border border-[#E4E4E7] shadow-xs hover:border-[#C4B5FD] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header: User Info + Album lockup snippet */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div
            onClick={handleAuthorClick}
            className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity"
          >
            <Avatar src={review.userAvatar} name={review.userName} size="md" />
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[#18181B] truncate hover:text-[#7C3AED]">
                {review.userName}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
                <span>@{review.userUsername}</span>
                <span aria-hidden="true">·</span>
                <span>{review.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Album thumbnail lockup */}
          <div
            onClick={handleAlbumClick}
            className="flex items-center gap-2 p-1.5 pr-2.5 bg-[#F8F7FC] rounded-xl border border-[#E4E4E7]/80 hover:border-[#C4B5FD] transition-colors shrink-0"
            title="Ver álbum"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#2E1065] shrink-0">
              <img
                src={review.albumCover}
                alt={review.albumTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={e => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#18181B] truncate max-w-[110px] sm:max-w-[140px]">
                {review.albumTitle}
              </span>
              <span className="text-[10px] text-[#71717A] truncate max-w-[110px] sm:max-w-[140px]">
                {review.albumArtist}
              </span>
            </div>
          </div>
        </div>

        {/* Rating and Title */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <RatingBadge rating={review.rating} size="sm" showLabel />
            {review.recommends && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ThumbsUp size={11} /> Recomenda
              </span>
            )}
            {review.wantToListenAgain && (
              <span className="text-[11px] font-semibold text-[#4C1D95] bg-[#EDE9FE] px-2 py-0.5 rounded-md flex items-center gap-1">
                <RotateCcw size={11} /> Ouviria de novo
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-[#18181B] leading-snug group-hover:text-[#7C3AED] transition-colors">
            {review.title}
          </h3>

          <p
            className={`text-xs sm:text-sm text-[#3F3F46] leading-relaxed ${
              showFullText ? 'whitespace-pre-line' : 'line-clamp-3'
            }`}
          >
            {review.content}
          </p>

          {/* Favorite Track highlight */}
          {review.favoriteTrack && (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4C1D95] bg-[#EDE9FE]/70 px-2.5 py-1 rounded-lg">
              <Sparkles size={12} className="text-[#7C3AED]" />
              <span>Faixa favorita: {review.favoriteTrack}</span>
            </div>
          )}

          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-[#71717A] pt-1 flex-wrap">
              {review.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  <span className="hover:text-[#7C3AED] transition-colors">
                    #{tag}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#F4F4F5]">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              toggleLikeReview(review.id);
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              review.isLikedByMe
                ? 'text-rose-600'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
            aria-label="Curtir"
          >
            <Heart
              size={15}
              className={review.isLikedByMe ? 'fill-current' : ''}
            />
            <span className="tabular-nums">{review.likesCount}</span>
          </button>

          {/* Comment */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              navigateTo('review-detail', { reviewId: review.id });
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
            aria-label="Comentários"
          >
            <MessageSquare size={15} />
            <span className="tabular-nums">{review.commentsCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Delete (RLS owner only) */}
          {isMyReview && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Excluir minha resenha"
            >
              <Trash2 size={15} />
            </button>
          )}

          {/* Save / Bookmark */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              toggleSaveReview(review.id);
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              review.isSavedByMe
                ? 'text-[#7C3AED] bg-[#EDE9FE]'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F8F7FC]'
            }`}
            title={review.isSavedByMe ? 'Remover dos salvos' : 'Salvar resenha'}
          >
            {review.isSavedByMe ? (
              <BookmarkCheck size={16} />
            ) : (
              <Bookmark size={16} />
            )}
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="text-xs text-[#71717A] hover:text-[#7C3AED] transition-colors p-1.5 rounded-lg hover:bg-[#F8F7FC] cursor-pointer flex items-center gap-1"
            title="Compartilhar"
          >
            <Share2 size={15} />
            <span className="hidden sm:inline text-[11px] font-semibold">
              {copied ? 'Copiado!' : 'Compartilhar'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
