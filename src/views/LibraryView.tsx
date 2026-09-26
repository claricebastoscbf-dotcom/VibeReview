import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlbumCard } from '../components/music/AlbumCard';
import { TrackCard } from '../components/music/TrackCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { ReviewCard } from '../components/music/ReviewCard';
import { EmptyState } from '../components/common/EmptyState';
import {
  Heart,
  Bookmark,
  CheckCircle2,
  BookmarkCheck,
  Disc3,
  Music,
  Users,
  PenTool,
} from 'lucide-react';

export const LibraryView: React.FC = () => {
  const {
    currentUser,
    albums,
    tracks,
    artists,
    reviews,
    navigateTo,
  } = useApp();

  type LibraryCategory =
    | 'favoritos'
    | 'quero_ouvir'
    | 'ouvidos'
    | 'salvas'
    | 'albuns'
    | 'musicas'
    | 'artistas';

  const [category, setCategory] = useState<LibraryCategory>('favoritos');

  // Categorized collections
  const favoriteAlbums = albums.filter(a =>
    currentUser.favoriteAlbumIds?.includes(a.id)
  );

  const favoriteTracks = tracks.filter(t =>
    currentUser.favoriteTrackIds?.includes(t.id)
  );

  const watchlistAlbums = albums.filter(a =>
    currentUser.watchlistAlbumIds?.includes(a.id)
  );

  const listenedAlbums = albums.filter(a =>
    currentUser.listenedAlbumIds?.includes(a.id)
  );

  const savedReviews = reviews.filter(r =>
    currentUser.savedReviewIds?.includes(r.id)
  );

  const followedArtists = artists.filter(a => a.isFollowed);

  const userReviews = reviews.filter(
    r => r.userId === currentUser.id || r.userUsername === currentUser.username
  );

  const categories = [
    {
      id: 'favoritos',
      label: `Favoritos (${favoriteAlbums.length + favoriteTracks.length})`,
      icon: <Heart size={14} />,
    },
    {
      id: 'quero_ouvir',
      label: `Quero ouvir (${watchlistAlbums.length})`,
      icon: <Bookmark size={14} />,
    },
    {
      id: 'ouvidos',
      label: `Ouvidos (${listenedAlbums.length})`,
      icon: <CheckCircle2 size={14} />,
    },
    {
      id: 'salvas',
      label: `Resenhas salvas (${savedReviews.length})`,
      icon: <BookmarkCheck size={14} />,
    },
    {
      id: 'albuns',
      label: `Todos os Álbuns (${albums.length})`,
      icon: <Disc3 size={14} />,
    },
    {
      id: 'musicas',
      label: `Músicas (${tracks.length})`,
      icon: <Music size={14} />,
    },
    {
      id: 'artistas',
      label: `Artistas seguidos (${followedArtists.length})`,
      icon: <Users size={14} />,
    },
  ] as const;

  return (
    <div className="space-y-8 pb-20">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight">
          Sua Biblioteca
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] mt-0.5">
          Discoteca pessoal, obras em fila de espera e resenhas salvas para consulta
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-[#E4E4E7]/40 rounded-xl overflow-x-auto">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              category === c.id
                ? 'bg-white text-[#4C1D95] shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* FAVORITOS */}
        {category === 'favoritos' && (
          <div className="space-y-8">
            {/* Albums Favoritos */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-[#18181B]">
                Álbuns Favoritos ({favoriteAlbums.length})
              </h2>
              {favoriteAlbums.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {favoriteAlbums.map(alb => (
                    <div
                      key={alb.id}
                      onClick={() => navigateTo('album-detail', { albumId: alb.id })}
                      className="cursor-pointer"
                    >
                      <AlbumCard album={alb} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#71717A] p-4 bg-white rounded-xl border border-[#E4E4E7]">
                  Você ainda não favoritou nenhum álbum.
                </p>
              )}
            </div>

            {/* Músicas Favoritas */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-[#18181B]">
                Músicas Favoritas ({favoriteTracks.length})
              </h2>
              {favoriteTracks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favoriteTracks.map(trk => (
                    <div
                      key={trk.id}
                      onClick={() => navigateTo('track-detail', { trackId: trk.id })}
                      className="cursor-pointer"
                    >
                      <TrackCard track={trk} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#71717A] p-4 bg-white rounded-xl border border-[#E4E4E7]">
                  Você ainda não favoritou nenhuma faixa individual.
                </p>
              )}
            </div>
          </div>
        )}

        {/* QUERO OUVIR */}
        {category === 'quero_ouvir' && (
          <div>
            {watchlistAlbums.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {watchlistAlbums.map(alb => (
                  <div
                    key={alb.id}
                    onClick={() => navigateTo('album-detail', { albumId: alb.id })}
                    className="cursor-pointer"
                  >
                    <AlbumCard album={alb} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Bookmark size={28} />}
                title="Sua fila de espera está vazia"
                description="Clique no botão 'Quero ouvir' em qualquer álbum no Explorar para salvar aqui."
                actionLabel="Explorar álbuns"
                onAction={() => navigateTo('explorar')}
              />
            )}
          </div>
        )}

        {/* OUVIDOS */}
        {category === 'ouvidos' && (
          <div>
            {listenedAlbums.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {listenedAlbums.map(alb => (
                  <div
                    key={alb.id}
                    onClick={() => navigateTo('album-detail', { albumId: alb.id })}
                    className="cursor-pointer"
                  >
                    <AlbumCard album={alb} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CheckCircle2 size={28} />}
                title="Nenhum álbum marcado como ouvido ainda"
                description="Marque os discos que você já apreciou para alimentar seu histórico estatístico."
              />
            )}
          </div>
        )}

        {/* RESENHAS SALVAS */}
        {category === 'salvas' && (
          <div>
            {savedReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedReviews.map(r => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<BookmarkCheck size={28} />}
                title="Você ainda não salvou nenhuma resenha"
                description="Clique no ícone de marcador nas resenhas do feed para guardá-las para consulta futura."
                actionLabel="Ir para o Feed"
                onAction={() => navigateTo('resenhas')}
              />
            )}
          </div>
        )}

        {/* TODOS OS ÁLBUNS */}
        {category === 'albuns' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {albums.map(alb => (
              <div
                key={alb.id}
                onClick={() => navigateTo('album-detail', { albumId: alb.id })}
                className="cursor-pointer"
              >
                <AlbumCard album={alb} />
              </div>
            ))}
          </div>
        )}

        {/* TODAS AS MÚSICAS */}
        {category === 'musicas' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tracks.map(trk => (
              <div
                key={trk.id}
                onClick={() => navigateTo('track-detail', { trackId: trk.id })}
                className="cursor-pointer"
              >
                <TrackCard track={trk} />
              </div>
            ))}
          </div>
        )}

        {/* ARTISTAS SEGUIDOS */}
        {category === 'artistas' && (
          <div>
            {followedArtists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {followedArtists.map(artist => (
                  <div
                    key={artist.id}
                    onClick={() => navigateTo('artist-detail', { artistId: artist.id })}
                    className="cursor-pointer"
                  >
                    <ArtistCard artist={artist} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Users size={28} />}
                title="Você não segue nenhum artista ainda"
                description="Descubra e siga seus músicos favoritos para acompanhar lançamentos e novidades."
                actionLabel="Explorar artistas"
                onAction={() => navigateTo('artistas')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
