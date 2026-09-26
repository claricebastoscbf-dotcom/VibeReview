import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RatingBadge } from '../components/common/RatingBadge';
import { Button } from '../components/common/Button';
import { TrackCard } from '../components/music/TrackCard';
import { ReviewCard } from '../components/music/ReviewCard';
import { seo } from '../utils/seo';
import {
  Heart,
  Bookmark,
  BookmarkCheck,
  PenTool,
  Clock,
  Disc3,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';

export const AlbumDetailView: React.FC = () => {
  const {
    routeParams,
    albums,
    tracks,
    reviews,
    navigateTo,
    currentUser,
    toggleFavoriteAlbum,
    toggleWatchlistAlbum,
    toggleListenedAlbum,
  } = useApp();

  const albumId = routeParams.albumId;
  const album = albums.find(a => a.id === albumId) || albums[0];

  useEffect(() => {
    if (album) {
      seo.album(album.title, album.artist, album.coverUrl);
    }
  }, [album]);

  if (!album) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-sm font-semibold text-[#71717A]">Álbum não encontrado.</p>
        <Button variant="primary" size="sm" onClick={() => navigateTo('explorar')}>
          Voltar para Explorar
        </Button>
      </div>
    );
  }

  const albumTracks = tracks.filter(t => t.albumId === album.id);
  const albumReviews = reviews.filter(r => r.albumId === album.id);

  const isFav = currentUser.favoriteAlbumIds?.includes(album.id);
  const isWatchlist = currentUser.watchlistAlbumIds?.includes(album.id);
  const isListened = currentUser.listenedAlbumIds?.includes(album.id);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigateTo('explorar')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Voltar ao Explorar</span>
        </button>
      </div>

      {/* Album Hero Block */}
      <section className="bg-white rounded-3xl border border-[#E4E4E7] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Cover Art */}
        <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden bg-[#2E1065] shadow-xl shadow-[#4C1D95]/15 shrink-0">
          <img
            src={album.coverUrl}
            alt={album.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Column */}
        <div className="flex-1 flex flex-col justify-between text-center md:text-left space-y-4 w-full">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#4C1D95]">
                {album.type === 'ep' ? 'EP' : 'Álbum'}
              </span>
              <span className="text-xs text-[#71717A]">
                {album.releaseYear} · {album.genre}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] tracking-tight">
              {album.title}
            </h1>

            <button
              onClick={() => navigateTo('artist-detail', { artistId: album.artistId })}
              className="text-base font-bold text-[#7C3AED] hover:underline cursor-pointer inline-block mt-1"
            >
              {album.artist}
            </button>
          </div>

          {/* Rating and Reviews Counter */}
          <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
            <RatingBadge rating={album.averageRating} size="lg" showLabel showMax />
            <span className="text-xs text-[#71717A] font-medium">
              {album.reviewsCount} resenhas na comunidade
            </span>
          </div>

          {/* Action Buttons: Quero ouvir, Favoritar, Escrever resenha */}
          <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap pt-2">
            <Button
              variant="gradient"
              size="md"
              onClick={() => navigateTo('create-review')}
              leftIcon={<PenTool size={16} />}
            >
              Escrever resenha
            </Button>

            <Button
              variant={isWatchlist ? 'secondary' : 'outline'}
              size="md"
              onClick={() => toggleWatchlistAlbum(album.id)}
              leftIcon={
                isWatchlist ? (
                  <BookmarkCheck size={16} className="text-[#7C3AED]" />
                ) : (
                  <Bookmark size={16} />
                )
              }
            >
              {isWatchlist ? 'Na lista Quero Ouvir' : 'Quero ouvir'}
            </Button>

            <Button
              variant={isFav ? 'secondary' : 'outline'}
              size="md"
              onClick={() => toggleFavoriteAlbum(album.id)}
              leftIcon={
                <Heart
                  size={16}
                  className={isFav ? 'fill-rose-500 text-rose-500' : ''}
                />
              }
            >
              {isFav ? 'Favoritado' : 'Favoritar'}
            </Button>

            <button
              onClick={() => toggleListenedAlbum(album.id)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isListened
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-white border-[#E4E4E7] text-[#71717A] hover:bg-[#F8F7FC]'
              }`}
              title="Marcar como ouvido"
            >
              <Check size={15} />
              <span>{isListened ? 'Ouvido' : 'Marcar ouvido'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Sobre o Álbum */}
      {album.description && (
        <section className="bg-white rounded-3xl border border-[#E4E4E7] p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-[#18181B]">Sobre o álbum</h2>
          <p className="text-sm text-[#3F3F46] leading-relaxed">
            {album.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-[#71717A] pt-2">
            <span>{album.tracksCount} faixas no disco</span>
            {album.duration && (
              <>
                <span aria-hidden="true">·</span>
                <span>Duração aproximada: {album.duration}</span>
              </>
            )}
          </div>
        </section>
      )}

      {/* Lista de Faixas */}
      <section className="bg-white rounded-3xl border border-[#E4E4E7] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#18181B]">Lista de faixas</h2>
          <span className="text-xs text-[#71717A]">
            {albumTracks.length} faixas catalogadas
          </span>
        </div>

        <div className="space-y-2">
          {albumTracks.length > 0 ? (
            albumTracks.map((track, idx) => (
              <div
                key={track.id}
                onClick={() => navigateTo('track-detail', { trackId: track.id })}
                className="cursor-pointer"
              >
                <TrackCard track={track} index={idx} />
              </div>
            ))
          ) : (
            <p className="text-xs text-[#71717A] text-center py-4">
              Nenhuma faixa detalhada para este álbum.
            </p>
          )}
        </div>
      </section>

      {/* Resenhas da Comunidade */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
              Resenhas da comunidade
            </h2>
            <p className="text-xs text-[#71717A]">
              O que outros amantes de música acharam desta obra
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('create-review')}
            leftIcon={<PenTool size={14} />}
          >
            Avaliar álbum
          </Button>
        </div>

        {albumReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {albumReviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#E4E4E7] space-y-3">
            <Disc3 size={32} className="mx-auto text-[#7C3AED]" />
            <h4 className="text-sm font-bold text-[#18181B]">
              Seja o primeiro a resenhar este álbum!
            </h4>
            <p className="text-xs text-[#71717A] max-w-sm mx-auto">
              Compartilhe suas percepções com a comunidade do VibeReview.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigateTo('create-review')}
            >
              Publicar resenha
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
