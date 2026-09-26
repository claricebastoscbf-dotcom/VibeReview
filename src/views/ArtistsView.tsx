import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArtistCard } from '../components/music/ArtistCard';
import { GENRES_LIST } from '../data/mockData';
import { Users, Search } from 'lucide-react';

export const ArtistsView: React.FC = () => {
  const { artists } = useApp();
  const [filterGenre, setFilterGenre] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredArtists = artists.filter(a => {
    const matchesSearch =
      !search.trim() ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.genres.some(g => g.toLowerCase().includes(search.toLowerCase()));

    const matchesGenre = !filterGenre || a.genres.includes(filterGenre);

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#18181B] tracking-tight">
          Artistas e Bandas
        </h1>
        <p className="text-xs text-[#71717A]">
          Conheça criadores de várias épocas e vertentes da música brasileira e mundial
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-3 text-[#71717A]" />
          <input
            type="text"
            placeholder="Buscar artista por nome ou estilo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white text-xs rounded-xl pl-8 pr-3 py-2.5 border border-[#E4E4E7] focus:border-[#7C3AED] outline-none"
          />
        </div>

        {/* Quick Genre Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setFilterGenre(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border ${
              filterGenre === null
                ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                : 'bg-white text-[#71717A] border-[#E4E4E7] hover:border-[#C4B5FD]'
            }`}
          >
            Todos ({artists.length})
          </button>
          {[
            'MPB',
            'Rock',
            'Rap',
            'Hip Hop',
            'R&B',
            'Indie',
            'Samba',
            'Metal',
            'Eletrônica',
            'Jazz',
            'Blues',
            'Reggae',
            'K-Pop',
            'Funk',
            'Sertanejo',
            'Música clássica',
          ].map(g => (
            <button
              key={g}
              onClick={() => setFilterGenre(filterGenre === g ? null : g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border ${
                filterGenre === g
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                  : 'bg-white text-[#71717A] border-[#E4E4E7] hover:border-[#C4B5FD]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Counter */}
      <div className="text-xs text-[#71717A]">
        Mostrando <strong className="text-[#18181B]">{filteredArtists.length}</strong> artistas e bandas
        {filterGenre ? ` no gênero ${filterGenre}` : ''}
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredArtists.map(artist => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
};
