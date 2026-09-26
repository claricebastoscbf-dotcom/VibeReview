import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Disc3,
  User,
  Music,
  Users,
  MessageSquareQuote,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SearchBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  const {
    albums,
    artists,
    tracks,
    reviews,
    communityUsers,
    navigateTo,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce implementation (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Shortcut key "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const q = debouncedQuery;

  // Search in Músicas
  const matchTracks = q
    ? tracks
        .filter(
          t =>
            t.title.toLowerCase().includes(q) ||
            t.artist.toLowerCase().includes(q) ||
            t.albumTitle.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  // Search in Álbuns
  const matchAlbums = q
    ? albums
        .filter(
          a =>
            a.title.toLowerCase().includes(q) ||
            a.artist.toLowerCase().includes(q) ||
            a.genre.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  // Search in Artistas & Bandas
  const matchArtists = q
    ? artists
        .filter(
          art =>
            art.name.toLowerCase().includes(q) ||
            art.genres.some(g => g.toLowerCase().includes(q))
        )
        .slice(0, 3)
    : [];

  // Search in Usuários
  const matchUsers = q
    ? communityUsers
        .filter(
          u =>
            u.name.toLowerCase().includes(q) ||
            u.username.toLowerCase().includes(q) ||
            u.bio?.toLowerCase().includes(q)
        )
        .slice(0, 2)
    : [];

  // Search in Resenhas
  const matchReviews = q
    ? reviews
        .filter(
          r =>
            r.title.toLowerCase().includes(q) ||
            r.content.toLowerCase().includes(q) ||
            r.albumTitle.toLowerCase().includes(q)
        )
        .slice(0, 2)
    : [];

  const totalResults =
    matchTracks.length +
    matchAlbums.length +
    matchArtists.length +
    matchUsers.length +
    matchReviews.length;

  return (
    <div ref={containerRef} className={`relative w-full max-w-lg ${className}`}>
      <div className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-3.5 text-[#71717A] pointer-events-none"
        />

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar músicas, álbuns, artistas ou usuários..."
          className="w-full bg-[#F4F4F6] text-[#18181B] placeholder-[#A1A1AA] text-xs sm:text-sm rounded-xl pl-9 pr-12 py-2 border border-transparent focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-[#EDE9FE] transition-all outline-none"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsOpen(false);
              }}
              className="text-[#71717A] hover:text-[#18181B] p-0.5 cursor-pointer"
              aria-label="Limpar busca"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] font-mono font-semibold text-[#A1A1AA] bg-white border border-[#E4E4E7] rounded px-1.5 py-0.5 shadow-2xs">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Global Categorized Results Dropdown */}
      {isOpen && q && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E4E4E7] shadow-2xl z-50 overflow-hidden divide-y divide-[#F4F4F5] max-h-[80vh] overflow-y-auto">
          {totalResults > 0 ? (
            <div className="p-2 space-y-3">
              {/* Category: Álbuns */}
              {matchAlbums.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                    <Disc3 size={13} className="text-[#7C3AED]" />
                    <span>Álbuns</span>
                  </div>
                  {matchAlbums.map(alb => (
                    <div
                      key={alb.id}
                      onClick={() => {
                        setIsOpen(false);
                        navigateTo('album-detail', { albumId: alb.id });
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8F7FC] cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#2E1065] shrink-0">
                        <img
                          src={alb.coverUrl}
                          alt={alb.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#18181B] truncate">
                          {alb.title}
                        </h4>
                        <p className="text-[11px] text-[#71717A] truncate">
                          {alb.artist} · {alb.releaseYear}
                        </p>
                      </div>
                      <span className="text-[11px] text-[#7C3AED] font-bold">
                        {alb.averageRating.toFixed(1)} ★
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Category: Músicas */}
              {matchTracks.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                    <Music size={13} className="text-[#7C3AED]" />
                    <span>Músicas</span>
                  </div>
                  {matchTracks.map(trk => (
                    <div
                      key={trk.id}
                      onClick={() => {
                        setIsOpen(false);
                        navigateTo('track-detail', { trackId: trk.id });
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8F7FC] cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#EDE9FE] shrink-0 flex items-center justify-center text-[#7C3AED]">
                        <Music size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#18181B] truncate">
                          {trk.title}
                        </h4>
                        <p className="text-[11px] text-[#71717A] truncate">
                          {trk.artist} · {trk.albumTitle} ({trk.duration})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Category: Artistas & Bandas */}
              {matchArtists.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                    <Users size={13} className="text-[#7C3AED]" />
                    <span>Artistas & Bandas</span>
                  </div>
                  {matchArtists.map(art => (
                    <div
                      key={art.id}
                      onClick={() => {
                        setIsOpen(false);
                        navigateTo('artist-detail', { artistId: art.id });
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8F7FC] cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#EDE9FE] shrink-0">
                        <img
                          src={art.avatarUrl}
                          alt={art.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#18181B] truncate">
                          {art.name}
                        </h4>
                        <p className="text-[11px] text-[#71717A] truncate">
                          {art.type === 'banda' ? 'Banda' : 'Artista'} · {art.genres.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Category: Usuários */}
              {matchUsers.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                    <User size={13} className="text-[#7C3AED]" />
                    <span>Usuários da Comunidade</span>
                  </div>
                  {matchUsers.map(u => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setIsOpen(false);
                        navigateTo('user-profile', { username: u.username });
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8F7FC] cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#EDE9FE] shrink-0">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#18181B] truncate">
                          {u.name}
                        </h4>
                        <p className="text-[11px] text-[#71717A] truncate">
                          @{u.username} · {u.reviewsCount} resenhas
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Category: Resenhas */}
              {matchReviews.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                    <MessageSquareQuote size={13} className="text-[#7C3AED]" />
                    <span>Resenhas</span>
                  </div>
                  {matchReviews.map(r => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setIsOpen(false);
                        navigateTo('review-detail', { reviewId: r.id });
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8F7FC] cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#18181B] truncate">
                          {r.title}
                        </h4>
                        <p className="text-[11px] text-[#71717A] truncate">
                          por @{r.userUsername} sobre {r.albumTitle}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#7C3AED]">
                        {r.rating.toFixed(1)}/10
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigateTo('explorar');
                }}
                className="w-full text-center py-2 text-xs font-bold text-[#7C3AED] hover:bg-[#EDE9FE]/50 rounded-xl transition-colors cursor-pointer"
              >
                Ver todos os resultados no Explorar →
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[#71717A] space-y-1">
              <p className="font-semibold text-[#18181B]">
                Nenhum resultado para "{searchQuery}"
              </p>
              <p className="text-[11px]">
                Tente buscar por nome de faixa, artista, banda, usuário ou estilo musical.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
