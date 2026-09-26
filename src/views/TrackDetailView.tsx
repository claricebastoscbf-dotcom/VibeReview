import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RatingBadge } from '../components/common/RatingBadge';
import { Button } from '../components/common/Button';
import { ReviewCard } from '../components/music/ReviewCard';
import { seo } from '../utils/seo';
import {
  Play,
  Pause,
  Heart,
  Volume2,
  Clock,
  Disc3,
  PenTool,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const TrackDetailView: React.FC = () => {
  const { routeParams, tracks, albums, reviews, navigateTo, currentUser, toggleFavoriteTrack } =
    useApp();

  const trackId = routeParams.trackId;
  const track = tracks.find(t => t.id === trackId) || tracks[0];

  useEffect(() => {
    if (track) {
      seo.track(track.title, track.artist, track.coverUrl);
    }
  }, [track]);

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  if (!track) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-sm font-semibold text-[#71717A]">Música não encontrada.</p>
        <Button variant="primary" size="sm" onClick={() => navigateTo('explorar')}>
          Voltar para Explorar
        </Button>
      </div>
    );
  }

  const album = albums.find(a => a.id === track.albumId);
  const isFav = currentUser.favoriteTrackIds?.includes(track.id);

  // Track reviews
  const trackReviews = reviews.filter(
    r =>
      r.contentId === track.id ||
      (r.favoriteTrack && r.favoriteTrack.toLowerCase() === track.title.toLowerCase())
  );

  const toggleAudioPreview = () => {
    setIsPlayingPreview(!isPlayingPreview);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Back button */}
      <div>
        <button
          onClick={() =>
            track.albumId
              ? navigateTo('album-detail', { albumId: track.albumId })
              : navigateTo('explorar')
          }
          className="flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Voltar ao álbum</span>
        </button>
      </div>

      {/* Track Hero Card */}
      <section className="bg-white rounded-3xl border border-[#E4E4E7] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden bg-[#2E1065] shadow-lg shadow-[#4C1D95]/15 shrink-0 relative group">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={toggleAudioPreview}
            className="absolute inset-0 bg-[#2E1065]/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label={isPlayingPreview ? 'Pausar prévia' : 'Ouvir prévia sonora'}
          >
            {isPlayingPreview ? (
              <Pause size={36} className="text-white" />
            ) : (
              <Play size={36} className="ml-1 text-white" />
            )}
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between text-center sm:text-left space-y-4 w-full">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#4C1D95]">
                Faixa #{track.trackNumber}
              </span>
              <span className="text-xs text-[#71717A]">
                {track.releaseYear} · {track.genre}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight">
              {track.title}
            </h1>

            <button
              onClick={() =>
                track.artistId &&
                navigateTo('artist-detail', { artistId: track.artistId })
              }
              className="text-sm font-bold text-[#7C3AED] hover:underline cursor-pointer inline-block mt-0.5"
            >
              {track.artist}
            </button>

            <p
              onClick={() =>
                track.albumId &&
                navigateTo('album-detail', { albumId: track.albumId })
              }
              className="text-xs text-[#71717A] hover:underline cursor-pointer mt-1"
            >
              Álbum: <span className="font-semibold text-[#18181B]">{track.albumTitle}</span>
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap text-xs text-[#71717A]">
            <RatingBadge rating={track.averageRating} size="md" showLabel showMax />
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Clock size={13} />
              {track.duration}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap pt-1">
            <Button
              variant={isPlayingPreview ? 'secondary' : 'gradient'}
              size="md"
              onClick={toggleAudioPreview}
              leftIcon={
                isPlayingPreview ? (
                  <Pause size={16} />
                ) : (
                  <Volume2 size={16} className="text-white" />
                )
              }
            >
              {isPlayingPreview ? 'Pausar prévia' : 'Ouvir prévia sonora'}
            </Button>

            <Button
              variant={isFav ? 'secondary' : 'outline'}
              size="md"
              onClick={() => toggleFavoriteTrack(track.id)}
              leftIcon={
                <Heart
                  size={16}
                  className={isFav ? 'fill-rose-500 text-rose-500' : ''}
                />
              }
            >
              {isFav ? 'Favoritada' : 'Favoritar música'}
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => navigateTo('create-review')}
              leftIcon={<PenTool size={16} />}
            >
              Avaliar música
            </Button>
          </div>

          {/* Copyright notice indicator */}
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-[#71717A] pt-1">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>
              Respeito aos Direitos Autorais: prévias sintéticas para análise crítica e apreciação sem armazenamento pirata.
            </span>
          </div>
        </div>
      </section>

      {/* Resenhas sobre essa faixa */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
              Resenhas que destacam esta música
            </h2>
            <p className="text-xs text-[#71717A]">
              Opiniões de ouvintes que elegeram "{track.title}" como ponto alto
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('create-review')}
            leftIcon={<PenTool size={14} />}
          >
            Escrever resenha
          </Button>
        </div>

        {trackReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trackReviews.map(r => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#E4E4E7] space-y-2">
            <Sparkles size={32} className="mx-auto text-[#7C3AED]" />
            <h4 className="text-sm font-bold text-[#18181B]">
              Seja o primeiro a avaliar "{track.title}"!
            </h4>
            <p className="text-xs text-[#71717A] max-w-sm mx-auto">
              Diga à comunidade o que torna essa música especial.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigateTo('create-review')}
            >
              Avaliar faixa agora
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
