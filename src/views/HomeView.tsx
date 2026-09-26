import React from 'react';
import { useApp } from '../context/AppContext';
import { AlbumCard } from '../components/music/AlbumCard';
import { ReviewCard } from '../components/music/ReviewCard';
import { TrackCard } from '../components/music/TrackCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { Button } from '../components/common/Button';
import {
  Sparkles,
  Flame,
  Disc3,
  TrendingUp,
  ArrowRight,
  Music,
  Compass,
  Star,
  PenTool,
} from 'lucide-react';
import { MOCK_TRACKS } from '../data/mockData';

export const HomeView: React.FC = () => {
  const {
    currentUser,
    albums,
    reviews,
    artists,
    setCurrentView,
    openCreateReview,
  } = useApp();

  const forYouAlbums = albums.filter(a => a.isRecommended);
  const trendingAlbums = albums.filter(a => a.isTrending);
  const popularAlbums = albums.filter(a => a.isPopular);
  const newReleases = albums.filter(a => a.isNewRelease);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2E1065] via-[#4C1D95] to-[#7C3AED] p-6 sm:p-10 text-white shadow-xl shadow-[#4C1D95]/15">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-[#7C3AED]/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-[#EDE9FE]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#EDE9FE]">
            <Sparkles size={13} className="text-[#EDE9FE]" />
            <span>Sua opinião também faz parte da música.</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Olá, {currentUser.name.split(' ')[0]}!
            </h1>
            <p className="text-sm sm:text-base text-[#EDE9FE]/90 font-medium">
              Descubra novas vibes. O que você está ouvindo hoje?
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => openCreateReview()}
              className="bg-white text-[#4C1D95] hover:bg-[#EDE9FE] font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <PenTool size={16} />
              <span>Avaliar um álbum</span>
            </button>

            <button
              onClick={() => setCurrentView('explorar')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Compass size={16} />
              <span>Explorar catálogo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Seção: Para você */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
              Para você
            </h2>
            <p className="text-xs text-[#71717A]">
              Recomendações baseadas nos seus gêneros e artistas favoritos
            </p>
          </div>

          <button
            onClick={() => setCurrentView('explorar')}
            className="text-xs font-bold text-[#7C3AED] hover:text-[#4C1D95] flex items-center gap-1 cursor-pointer"
          >
            <span>Ver mais</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {forYouAlbums.slice(0, 4).map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      {/* Seção: Resenhas recentes (Feed da comunidade) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
              Resenhas recentes
            </h2>
            <p className="text-xs text-[#71717A]">
              Opiniões sinceras e análises críticas publicadas pela comunidade
            </p>
          </div>

          <button
            onClick={() => setCurrentView('resenhas')}
            className="text-xs font-bold text-[#7C3AED] hover:text-[#4C1D95] flex items-center gap-1 cursor-pointer"
          >
            <span>Feed completo</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.slice(0, 4).map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* Seção: Em alta (Trending) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Flame size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
                Em alta
              </h2>
              <p className="text-xs text-[#71717A]">
                Discos e faixas que estão dominando as discussões nesta semana
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trending Albums (2 cols on lg) */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {trendingAlbums.slice(0, 3).map(album => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>

          {/* Trending Tracks list */}
          <div className="bg-white rounded-2xl p-4 border border-[#E4E4E7] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
              Faixas mais votadas
            </h3>
            <div className="space-y-2">
              {MOCK_TRACKS.slice(0, 4).map((trk, i) => (
                <TrackCard key={trk.id} track={trk} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Álbuns populares */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
                Álbuns populares
              </h2>
              <p className="text-xs text-[#71717A]">
                Obras mais aclamadas e resenhadas de todos os tempos
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularAlbums.slice(0, 4).map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      {/* Seção: Novos lançamentos */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Disc3 size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
                Novos lançamentos
              </h2>
              <p className="text-xs text-[#71717A]">
                Acabaram de sair do forno: seja um dos primeiros a resenhar
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {newReleases.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      {/* Seção: Artistas em destaque */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
              Artistas no radar
            </h2>
            <p className="text-xs text-[#71717A]">
              Siga criadores para acompanhar seus lançamentos de perto
            </p>
          </div>

          <button
            onClick={() => setCurrentView('artistas')}
            className="text-xs font-bold text-[#7C3AED] hover:text-[#4C1D95] flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todos</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {artists.slice(0, 4).map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </div>
  );
};
