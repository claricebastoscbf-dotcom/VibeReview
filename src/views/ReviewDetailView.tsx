import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/common/Avatar';
import { RatingBadge } from '../components/common/RatingBadge';
import { Button } from '../components/common/Button';
import { ReviewCard } from '../components/music/ReviewCard';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ThumbsUp,
  RotateCcw,
  ArrowLeft,
  Send,
  CornerDownRight,
  Disc3,
  Trash2,
} from 'lucide-react';

export const ReviewDetailView: React.FC = () => {
  const {
    routeParams,
    reviews,
    navigateTo,
    currentUser,
    toggleLikeReview,
    toggleSaveReview,
    addCommentToReview,
    addReplyToComment,
    toggleLikeComment,
    toggleLikeReply,
    deleteReview,
    deleteComment,
    showToast,
  } = useApp();

  const reviewId = routeParams.reviewId;
  const review = reviews.find(r => r.id === reviewId) || reviews[0];

  const isMyReview =
    currentUser.id === review?.userId ||
    currentUser.username === review?.userUsername;

  const [commentInput, setCommentInput] = useState('');
  const [replyInput, setReplyInput] = useState<{ [commentId: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  if (!review) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-sm font-semibold text-[#71717A]">Resenha não encontrada.</p>
        <Button variant="primary" size="sm" onClick={() => navigateTo('resenhas')}>
          Voltar para feed de resenhas
        </Button>
      </div>
    );
  }

  // Related reviews (same album or same author, excluding this review)
  const relatedReviews = reviews
    .filter(
      r =>
        r.id !== review.id &&
        (r.albumId === review.albumId || r.userId === review.userId)
    )
    .slice(0, 2);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addCommentToReview(review.id, commentInput);
    setCommentInput('');
  };

  const handleSendReply = (commentId: string) => {
    const text = replyInput[commentId];
    if (!text || !text.trim()) return;
    addReplyToComment(review.id, commentId, text);
    setReplyInput(prev => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link da resenha copiado para a área de transferência!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Top Bar with Back action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('resenhas')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Voltar para resenhas</span>
        </button>

        <span className="text-xs text-[#A1A1AA]">
          VibeReview · Crítica da Comunidade
        </span>
      </div>

      {/* Main Review Card */}
      <article className="bg-white rounded-3xl border border-[#E4E4E7] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Author row */}
        <div className="flex items-center justify-between gap-4 border-b border-[#F4F4F5] pb-5">
          <div
            onClick={() => navigateTo('user-profile', { username: review.userUsername })}
            className="flex items-center gap-3.5 cursor-pointer hover:opacity-85 transition-opacity"
          >
            <Avatar src={review.userAvatar} name={review.userName} size="lg" />
            <div>
              <h3 className="text-base font-bold text-[#18181B] hover:text-[#7C3AED]">
                {review.userName}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
                <span>@{review.userUsername}</span>
                <span aria-hidden="true">·</span>
                <span>{review.createdAt}</span>
              </div>
            </div>
          </div>

          <RatingBadge rating={review.rating} size="lg" showLabel showMax />
        </div>

        {/* Album Header Banner */}
        <div
          onClick={() => review.albumId && navigateTo('album-detail', { albumId: review.albumId })}
          className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F7FC] border border-[#E4E4E7] hover:border-[#C4B5FD] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#2E1065] shadow-xs shrink-0">
              <img
                src={review.albumCover}
                alt={review.albumTitle}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#EDE9FE] text-[#4C1D95]">
                {review.contentType}
              </span>
              <h2 className="text-base font-bold text-[#18181B] truncate group-hover:text-[#7C3AED] transition-colors mt-0.5">
                {review.albumTitle}
              </h2>
              <p className="text-xs text-[#71717A] truncate">
                {review.albumArtist} {review.releaseYear ? `· ${review.releaseYear}` : ''} {review.genre ? `· ${review.genre}` : ''}
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#7C3AED] hidden sm:block shrink-0">
            Ver obra completa →
          </span>
        </div>

        {/* Title & Body */}
        <div className="space-y-4">
          <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight leading-snug">
            {review.title}
          </h1>

          <div className="text-sm sm:text-base text-[#27272A] leading-relaxed whitespace-pre-line font-normal">
            {review.content}
          </div>

          {/* Special badges */}
          <div className="flex items-center gap-3 flex-wrap pt-2">
            {review.favoriteTrack && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4C1D95] bg-[#EDE9FE] px-3 py-1.5 rounded-xl">
                <Sparkles size={14} className="text-[#7C3AED]" />
                <span>Faixa favorita: {review.favoriteTrack}</span>
              </div>
            )}

            {review.recommends && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl">
                <ThumbsUp size={13} /> Recomenda a obra
              </span>
            )}

            {review.wantToListenAgain && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4C1D95] bg-[#EDE9FE]/70 px-3 py-1.5 rounded-xl">
                <RotateCcw size={13} /> Pretende ouvir novamente
              </span>
            )}
          </div>

          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-[#71717A] pt-2">
              {review.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  <span className="text-[#7C3AED] font-semibold hover:underline cursor-pointer">
                    #{tag}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between pt-5 border-t border-[#F4F4F5]">
          <div className="flex items-center gap-3">
            {/* Like */}
            <button
              onClick={() => toggleLikeReview(review.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                review.isLikedByMe
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-[#F8F7FC] text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              <Heart
                size={16}
                className={review.isLikedByMe ? 'fill-current' : ''}
              />
              <span className="tabular-nums">{review.likesCount} curtidas</span>
            </button>

            {/* Save */}
            <button
              onClick={() => toggleSaveReview(review.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                review.isSavedByMe
                  ? 'bg-[#EDE9FE] text-[#7C3AED]'
                  : 'bg-[#F8F7FC] text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              {review.isSavedByMe ? (
                <BookmarkCheck size={16} />
              ) : (
                <Bookmark size={16} />
              )}
              <span>{review.isSavedByMe ? 'Salva' : 'Salvar'}</span>
            </button>

            {/* Delete Review (RLS Owner only) */}
            {isMyReview && (
              <button
                onClick={() => {
                  if (window.confirm('Deseja realmente excluir sua resenha? Esta ação é irreversível.')) {
                    deleteReview(review.id);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                title="Excluir minha resenha"
              >
                <Trash2 size={15} />
                <span>Excluir</span>
              </button>
            )}
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#7C3AED] transition-colors cursor-pointer p-2 rounded-xl hover:bg-[#F8F7FC]"
          >
            <Share2 size={16} />
            <span>Compartilhar</span>
          </button>
        </div>
      </article>

      {/* Seção de Comentários e Respostas Aninhadas */}
      <section className="bg-white rounded-3xl border border-[#E4E4E7] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-[#7C3AED]" />
            <h3 className="text-base font-bold text-[#18181B]">
              Comentários ({review.comments?.length || 0})
            </h3>
          </div>
          <span className="text-xs text-[#71717A]">
            Participe da conversa com respeito e entusiasmo musical.
          </span>
        </div>

        {/* Input para novo comentário */}
        <form onSubmit={handleSendComment} className="flex gap-2">
          <input
            type="text"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder="Adicione um comentário à resenha..."
            className="flex-1 bg-[#F8F7FC] text-xs sm:text-sm rounded-xl px-4 py-2.5 border border-[#E4E4E7] focus:border-[#7C3AED] outline-none"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<Send size={14} />}
          >
            Comentar
          </Button>
        </form>

        {/* Lista de Comentários */}
        <div className="space-y-4 pt-2">
          {review.comments && review.comments.length > 0 ? (
            review.comments.map(comment => (
              <div
                key={comment.id}
                className="p-4 rounded-2xl bg-[#F8F7FC] border border-[#E4E4E7]/70 space-y-3"
              >
                {/* Comment header */}
                <div className="flex items-start justify-between">
                  <div
                    onClick={() => navigateTo('user-profile', { username: comment.userUsername })}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <Avatar
                      src={comment.userAvatar}
                      name={comment.userName}
                      size="sm"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#18181B] hover:text-[#7C3AED]">
                        {comment.userName}
                      </span>
                      <span className="text-[11px] text-[#71717A] ml-2">
                        {comment.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLikeComment(review.id, comment.id)}
                      className={`flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                        comment.isLikedByMe ? 'text-rose-600' : 'text-[#71717A] hover:text-[#18181B]'
                      }`}
                    >
                      <Heart
                        size={13}
                        className={comment.isLikedByMe ? 'fill-current' : ''}
                      />
                      <span className="tabular-nums">{comment.likesCount}</span>
                    </button>

                    {(comment.userId === currentUser.id || comment.userUsername === currentUser.username) && (
                      <button
                        onClick={() => {
                          if (window.confirm('Excluir este comentário?')) {
                            deleteComment(review.id, comment.id);
                          }
                        }}
                        className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                        title="Excluir meu comentário"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#27272A] leading-relaxed">
                  {comment.text}
                </p>

                {/* Reply trigger button */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() =>
                      setActiveReplyId(
                        activeReplyId === comment.id ? null : comment.id
                      )
                    }
                    className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <CornerDownRight size={12} />
                    <span>Responder</span>
                  </button>
                </div>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="pl-4 sm:pl-6 border-l-2 border-[#DDD6FE] space-y-3 pt-2">
                    {comment.replies.map(reply => (
                      <div
                        key={reply.id}
                        className="p-3 bg-white rounded-xl border border-[#E4E4E7]/70 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            onClick={() =>
                              navigateTo('user-profile', { username: reply.userUsername })
                            }
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Avatar
                              src={reply.userAvatar}
                              name={reply.userName}
                              size="xs"
                            />
                            <span className="text-xs font-bold text-[#18181B] hover:text-[#7C3AED]">
                              {reply.userName}
                            </span>
                            <span className="text-[10px] text-[#A1A1AA]">
                              {reply.createdAt}
                            </span>
                          </div>

                          <button
                            onClick={() =>
                              toggleLikeReply(review.id, comment.id, reply.id)
                            }
                            className={`flex items-center gap-1 text-[11px] font-semibold cursor-pointer ${
                              reply.isLikedByMe ? 'text-rose-600' : 'text-[#71717A]'
                            }`}
                          >
                            <Heart
                              size={12}
                              className={reply.isLikedByMe ? 'fill-current' : ''}
                            />
                            <span className="tabular-nums">{reply.likesCount}</span>
                          </button>
                        </div>
                        <p className="text-xs text-[#3F3F46] leading-relaxed">
                          {reply.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input Form */}
                {activeReplyId === comment.id && (
                  <div className="pt-2 flex gap-2">
                    <input
                      type="text"
                      value={replyInput[comment.id] || ''}
                      onChange={e =>
                        setReplyInput(prev => ({
                          ...prev,
                          [comment.id]: e.target.value,
                        }))
                      }
                      placeholder={`Responder para ${comment.userName}...`}
                      className="flex-1 bg-white text-xs rounded-xl px-3 py-2 border border-[#E4E4E7] focus:border-[#7C3AED] outline-none"
                    />
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleSendReply(comment.id)}
                    >
                      Enviar resposta
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-[#71717A] text-center py-4">
              Nenhum comentário publicado ainda. Seja o primeiro a opinar!
            </p>
          )}
        </div>
      </section>

      {/* Resenhas Relacionadas */}
      {relatedReviews.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#18181B]">
              Resenhas relacionadas
            </h3>
            <button
              onClick={() => navigateTo('resenhas')}
              className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
            >
              Ver feed completo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedReviews.map(r => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
