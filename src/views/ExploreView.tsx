import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GENRES_LIST } from '../data/mockData';
import { AlbumCard } from '../components/music/AlbumCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { TrackCard } from '../components/music/TrackCard';
import { ReviewCard } from '../components/music/ReviewCard';
import { EmptyState } from '../components/common/EmptyState';
import {
  Compass,
  Filter,
  Flame,
  Star,
  MessageSquare,
  Sparkles,
  Disc3,
  Calendar,
  Layers,
  ArrowUpDown,
  TrendingUp,
} from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { albums, artists, tracks, reviews, searchQuery, setSearchQuery, navigateTo } = useApp();

  // Active section tab: 'secoes' | 'todos'
  const [viewMode, setViewMode] = useState<'secoes' | 'filtro'>('secoes');

  // Filters
  const [selectedGenre, setSelectedGenre] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<string>('todos'); // 'todos', 'album', 'musica', 'ep', 'artista'
  const [selectedYear, setSelectedYear] = useState<string>('todos'); // 'todos', '2026', '2025', '2010s', 'classicos'
  const [selectedRating, setSelectedRating] = useState<number>(0); // 0, 8.0, 9.0, 9.5
  const [sortBy, setSortBy] = useState<'recentes' | 'populares' | 'melhor_avaliados'>('melhor_avaliados');

  // Filtered Albums
  const filteredAlbums = albums.filter(alb => {
    if (selectedGenre !== 'todos' && !alb.genre.toLowerCase().includes(selectedGenre.toLowerCase())) return false;
    if (selectedType === 'ep' && alb.type !== 'ep') return false;
    if (selectedType === 'album' && alb.type === 'ep') return false;
    if (selectedRating > 0 && alb.averageRating < selectedRating) return false;
    if (selectedYear === '2026' && alb.releaseYear !== 2026) return false;
    if (selectedYear === '2025' && alb.releaseYear !== 2025) return false;
    if (selectedYear === '2010s' && (alb.releaseYear < 2010 || alb.releaseYear > 2019)) return false;
    if (selectedYear === 'classicos' && alb.releaseYear >= 2000) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'recentes') return b.releaseYear - a.releaseYear;
    if (sortBy === 'populares') return b.reviewsCount - a.reviewsCount;
    return b.averageRating - a.averageRating;
  });

  // Pagination for filtered albums
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const paginatedFilteredAlbums = filteredAlbums.slice(0, visibleCount);
  const hasMoreFiltered = visibleCount < filteredAlbums.length;

  // Filtered Tracks
  const filteredTracks = tracks.filter(trk => {
    if (selectedGenre !== 'todos' && !trk.genre.toLowerCase().includes(selectedGenre.toLowerCase())) return false;
    if (selectedRating > 0 && trk.averageRating < selectedRating) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'populares') return b.reviewsCount - a.reviewsCount;
    return b.averageRating - a.averageRating;
  });

  // Curated Section Collections:
  const trendingAlbums = albums.filter(a => a.isTrending);
  const topRatedAlbums = [...albums].sort((a, b) => b.averageRating - a.averageRating).slice(0, 4);
  const mostCommentedAlbums = [...albums].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 4);
  const newReleases = albums.filter(a => a.isNewRelease);
  const classicAlbums = albums.filter(a => a.isClassic || a.releaseYear < 2000);
  const discoveries = albums.filter(a => a.isRecommended && !a.isPopular);
  const popularUsersChoice = albums.filter(a => a.isPopular);

  return (
    <div className="space-y-10 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight">
            Explorar
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-0.5">
            Mergulhe em lançamentos, clássicos e seleções recomendadas pela comunidade
          </p>
        </div>

        {/* View Switcher: Seções Curadas vs Modo Filtro Avançado */}
        <div className="flex items-center gap-1.5 p-1 bg-[#E4E4E7]/40 rounded-xl w-fit">
          <button
            onClick={() => setViewMode('secoes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'secoes'
                ? 'bg-white text-[#4C1D95] shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Seções Temáticas
          </button>
          <button
            onClick={() => setViewMode('filtro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'filtro'
                ? 'bg-white text-[#4C1D95] shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Filtros & Catálogo
          </button>
        </div>
      </div>

      {/* ================= MODE 1: SEÇÕES CURADAS ================= */}
      {viewMode === 'secoes' ? (
        <div className="space-y-12">
          {/* Seção: Em alta */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Flame size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#18181B]">Em alta</h2>
                  <p className="text-xs text-[#71717A]">
                    Obras com alto volume de novas resenhas nesta semana
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {trendingAlbums.map(alb => (
                <div
                  key={alb.id}
                  onClick={() => navigateTo('album-detail', { albumId: alb.id })}
                  className="cursor-pointer"
                >
                  <AlbumCard album={alb} />
                </div>
              ))}
            </div>
          </section>

          {/* Seção: Mais avaliados */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
                  <Star size={18} className="fill-[#7C3AED]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#18181B]">Mais avaliados</h2>
                  <p className="text-xs text-[#71717A]">
                    Discos que atingiram as maiores médias da plataforma (9.5+)
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {topRatedAlbums.map(alb => (
                <div
                  key={alb.id}
                  onClick={() => navigateTo('album-detail', { albumId: alb.id })}
                  className="cursor-pointer"
                >
                  <AlbumCard album={alb} />
                </div>
              ))}
            </div>
          </section>

          {/* Seção: Mais comentados */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#18181B]">Mais comentados</h2>
                  <p className="text-xs text-[#71717A]">
                    Álbuns que mais geram debates acalorados entre os críticos
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mostCommentedAlbums.map(alb => (
                <div
                  key={alb.id}
                  onClick={() => navigateTo('album-detail', { albumId: alb.id })}
                  className="cursor-pointer"
                >
                  <AlbumCard album={alb} />
                </div>
              ))}
            </div>
          </section>

          {/* Seção: Novos lançamentos */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Disc3 size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#18181B]">Novos lançamentos (2025/2026)</h2>
                  <p className="text-xs text-[#71717A]">
                    Sons recentes para você ser um dos primeiros a avaliar
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {newReleases.map(alb => (
                <div
                  key={alb.id}
                  onClick={() => navigateTo('album-detail', { albumId: alb.id })}
                  className="cursor-pointer"
                >
                  <AlbumCard album={alb} />
                </div>
              ))}
            </div>
          </section>

          {/* Seção: Clássicos */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center">
                  <Calendar size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#18181B]">Clássicos fundamentais</h2>
                  <p className="text-xs text-[#71717A]">
                    As obras que construíram os pilares da música
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {classicAlbums.map(alb => (
                <div
                  key={alb.id}
                  onClick={() => navigateTo('album-detail', { albumId: alb.id })}
                  className="cursor-pointer"
                >
                  <AlbumCard album={alb} />
                </div>
              ))}
            </div>
          </section>

          {/* Seção: Descobertas */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#18181B]">Descobertas escondidas</h2>
                  <p className="text-xs text-[#71717A]">
                    Pérolas independentes fora do radar convencional
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {discoveries.map(alb => (
                <div
                  key={alb.id}
                  onClick={() => navigateTo('album-detail', { albumId: alb.id })}
                  className="cursor-pointer"
                >
                  <AlbumCard album={alb} />
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* ================= MODE 2: FILTROS AVANÇADOS ================= */
        <div className="space-y-8">
          {/* Controls Panel */}
          <div className="bg-white rounded-3xl border border-[#E4E4E7] p-5 sm:p-6 shadow-xs space-y-4">
            {/* Row 1: Gênero, Tipo, Ano, Nota, Ordenação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Filtro: Gênero */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">
                  Gênero
                </label>
                <select
                  value={selectedGenre}
                  onChange={e => setSelectedGenre(e.target.value)}
                  className="w-full bg-[#F8F7FC] text-xs rounded-xl p-2.5 border border-[#E4E4E7] focus:border-[#7C3AED] outline-none"
                >
                  <option value="todos">Todos os gêneros</option>
                  {GENRES_LIST.map(g => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro: Tipo */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">
                  Tipo
                </label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="w-full bg-[#F8F7FC] text-xs rounded-xl p-2.5 border border-[#E4E4E7] focus:border-[#7C3AED] outline-none"
                >
                  <option value="todos">Todos os tipos</option>
                  <option value="album">Álbum</option>
                  <option value="ep">EP</option>
                  <option value="musica">Música</option>
                </select>
              </div>

              {/* Filtro: Ano */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">
                  Ano
                </label>
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="w-full bg-[#F8F7FC] text-xs rounded-xl p-2.5 border border-[#E4E4E7] focus:border-[#7C3AED] outline-none"
                >
                  <option value="todos">Todas as épocas</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2010s">Anos 2010s</option>
                  <option value="classicos">Clássicos (&lt; 2000)</option>
                </select>
              </div>

              {/* Filtro: Nota Mínima */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">
                  Nota mínima
                </label>
                <select
                  value={selectedRating}
                  onChange={e => setSelectedRating(parseFloat(e.target.value))}
                  className="w-full bg-[#F8F7FC] text-xs rounded-xl p-2.5 border border-[#E4E4E7] focus:border-[#7C3AED] outline-none"
                >
                  <option value="0">Qualquer nota</option>
                  <option value="9.5">Excelente (9.5+)</option>
                  <option value="9.0">Muito bom (9.0+)</option>
                  <option value="8.0">Bom (8.0+)</option>
                </select>
              </div>

              {/* Ordenação */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="w-full bg-[#F8F7FC] text-xs rounded-xl p-2.5 border border-[#E4E4E7] focus:border-[#7C3AED] outline-none font-semibold text-[#4C1D95]"
                >
                  <option value="melhor_avaliados">Melhor avaliados</option>
                  <option value="populares">Mais populares</option>
                  <option value="recentes">Mais recentes</option>
                </select>
              </div>
            </div>

            {/* Clear filters shortcut */}
            {(selectedGenre !== 'todos' ||
              selectedType !== 'todos' ||
              selectedYear !== 'todos' ||
              selectedRating > 0) && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    setSelectedGenre('todos');
                    setSelectedType('todos');
                    setSelectedYear('todos');
                    setSelectedRating(0);
                  }}
                  className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#71717A]">
              <span>
                Exibindo{' '}
                <strong className="text-[#18181B]">
                  {filteredAlbums.length} obras
                </strong>{' '}
                filtradas
              </span>
            </div>

            {filteredAlbums.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {paginatedFilteredAlbums.map(alb => (
                    <div
                      key={alb.id}
                      onClick={() => navigateTo('album-detail', { albumId: alb.id })}
                      className="cursor-pointer"
                    >
                      <AlbumCard album={alb} />
                    </div>
                  ))}
                </div>

                {hasMoreFiltered && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 8)}
                      className="px-4 py-2 text-xs font-bold text-[#7C3AED] bg-[#EDE9FE] hover:bg-[#DDD6FE] rounded-xl transition-colors cursor-pointer"
                    >
                      Carregar mais obras ({filteredAlbums.length - visibleCount} restantes)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                icon={<Compass size={28} />}
                title="Nenhum álbum corresponde a esses filtros"
                description="Tente relaxar os critérios de nota ou gênero para ver mais resultados."
                actionLabel="Resetar filtros"
                onAction={() => {
                  setSelectedGenre('todos');
                  setSelectedType('todos');
                  setSelectedYear('todos');
                  setSelectedRating(0);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
