import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReviewCard } from '../components/music/ReviewCard';
import { Button } from '../components/common/Button';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { PenTool, MessageSquareQuote, ChevronDown, Check } from 'lucide-react';
import { ContentType } from '../types';

export const ReviewsView: React.FC = () => {
  const { reviews, openCreateReview } = useApp();

  const [sortFilter, setSortFilter] = useState<'recentes' | 'curtidas' | 'notas'>('recentes');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('todos');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(rev => {
      if (contentTypeFilter === 'todos') return true;
      if (contentTypeFilter === 'album') return rev.contentType === 'album' || rev.contentType === 'ep';
      if (contentTypeFilter === 'musica') return rev.contentType === 'musica';
      if (contentTypeFilter === 'artista') return rev.contentType === 'artista' || rev.contentType === 'banda';
      return true;
    })
    .sort((a, b) => {
      if (sortFilter === 'curtidas') {
        return b.likesCount - a.likesCount;
      }
      if (sortFilter === 'notas') {
        return b.rating - a.rating;
      }
      return 0; // Default is order of creation
    });

  const paginatedReviews = filteredReviews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReviews.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 400);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header with Title and Create CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#18181B] tracking-tight">
              Feed de Resenhas da Comunidade
            </h1>
            <span className="text-xs bg-[#EDE9FE] text-[#7C3AED] font-bold px-2.5 py-0.5 rounded-full">
              {reviews.length} publicadas
            </span>
          </div>
          <p className="text-xs text-[#71717A] mt-0.5">
            Descubra opiniões sinceras, avaliações de 0 a 10 e recomendações de ouvintes
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={() => openCreateReview()}
          leftIcon={<PenTool size={16} />}
        >
          Escrever Resenha
        </Button>
      </div>

      {/* Filter and Sorting Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E4E4E7] pb-4">
        {/* Content Type Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'todos', label: 'Todas as Resenhas' },
            { id: 'album', label: 'Álbuns & EPs' },
            { id: 'musica', label: 'Faixas & Músicas' },
            { id: 'artista', label: 'Artistas & Bandas' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setContentTypeFilter(tab.id);
                setVisibleCount(6);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                contentTypeFilter === tab.id
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sorting Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-bold text-[#71717A]">Ordenar:</span>
          <div className="flex items-center gap-1 p-1 bg-[#E4E4E7]/40 rounded-xl">
            <button
              onClick={() => setSortFilter('recentes')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                sortFilter === 'recentes'
                  ? 'bg-white text-[#4C1D95] shadow-xs'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Recentes
            </button>
            <button
              onClick={() => setSortFilter('curtidas')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                sortFilter === 'curtidas'
                  ? 'bg-white text-[#4C1D95] shadow-xs'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Populares
            </button>
            <button
              onClick={() => setSortFilter('notas')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                sortFilter === 'notas'
                  ? 'bg-white text-[#4C1D95] shadow-xs'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Melhor avaliadas
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      {paginatedReviews.length === 0 ? (
        <EmptyState
          icon={<MessageSquareQuote size={32} className="text-[#7C3AED]" />}
          title="Nenhuma resenha encontrada"
          description="Seja o primeiro a publicar uma resenha para esta categoria!"
          actionLabel="Publicar Resenha"
          onAction={() => openCreateReview()}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedReviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Pagination / Load more controls */}
          <div className="flex flex-col items-center justify-center pt-4 space-y-2">
            <p className="text-xs text-[#71717A]">
              Mostrando {paginatedReviews.length} de {filteredReviews.length} resenhas
            </p>

            {hasMore ? (
              <Button
                variant="outline"
                size="md"
                onClick={handleLoadMore}
                isLoading={isLoadingMore}
                leftIcon={<ChevronDown size={16} />}
              >
                Carregar mais resenhas
              </Button>
            ) : (
              <p className="text-xs text-[#A1A1AA] italic">
                Você chegou ao fim das resenhas desta seção.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
