import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RatingBadge } from '../components/common/RatingBadge';
import { Button } from '../components/common/Button';
import { AlbumCard } from '../components/music/AlbumCard';
import { TrackCard } from '../components/music/TrackCard';
import { ReviewCard } from '../components/music/ReviewCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { seo } from '../utils/seo';
import {
  Users,
  UserCheck,
  UserPlus,
  ArrowLeft,
  Disc3,
  PenTool,
} from 'lucide-react';

export const ArtistDetailView: React.FC = () => {
  const { routeParams, artists, albums, tracks, reviews, navigateTo, toggleFollowArtist } =
    useApp();

  const artistId = routeParams.artistId;
  const artist = artists.find(a => a.id === artistId) || artists[0];

  useEffect(() => {
    if (artist) {
      seo.artist(artist.name, artist.genres, artist.avatarUrl);
    }
  }, [artist]);

  if (!artist) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-sm font-semibold text-[#71717A]">Artista não encontrado.</p>
        <Button variant="primary" size="sm" onClick={() => navigateTo('artistas')}>
          Voltar para Artistas
        </Button>
      </div>
    );
  }

  // Filter artist albums & EPs
  const artistAlbums = albums.filter(
    a => a.artistId === artist.id && a.type !== 'ep'
  );
  const artistEPs = albums.filter(
    a => a.artistId === artist.id && a.type === 'ep'
  );
  const artistTracks = tracks.filter(t => t.artistId === artist.id);
  const artistReviews = reviews.filter(
    r =>
      r.albumArtist.toLowerCase().includes(artist.name.toLowerCase()) ||
      r.content.toLowerCase().includes(artist.name.toLowerCase())
  );
  const relatedArtists = artists.filter(
    a => a.id !== artist.id && artist.relatedArtistIds?.includes(a.id)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigateTo('artistas')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Voltar para Artistas</span>
        </button>
      </div>

      {/* Artist Hero */}
      <section className="bg-white rounded-3xl border border-[#E4E4E7] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Photo */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden bg-[#EDE9FE] border-4 border-white shadow-xl shadow-[#4C1D95]/15 shrink-0">
          <img
            src={artist.avatarUrl}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bio & Details */}
        <div className="flex-1 flex flex-col justify-between text-center md:text-left space-y-4 w-full">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#4C1D95]">
                {artist.type === 'banda' ? 'Banda' : 'Artista solo'}
              </span>
              <span className="text-xs text-[#71717A]">
                {artist.genres.join(' · ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] tracking-tight">
              {artist.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed mt-2 max-w-2xl">
              {artist.bio}
            </p>
          </div>

          {/* Stats: Seguidores, Ouvintes, Nota média */}
          <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap text-xs text-[#71717A]">
            <RatingBadge rating={artist.averageRating} size="md" showLabel />
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#18181B]">
              {artist.monthlyListeners} ouvintes mensais
            </span>
            <span aria-hidden="true">·</span>
            <span>{artist.followersCount.toLocaleString()} seguidores</span>
          </div>

          {/* Follow Button */}
          <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
            <Button
              variant={artist.isFollowed ? 'outline' : 'gradient'}
              size="md"
              onClick={() => toggleFollowArtist(artist.id)}
              leftIcon={
                artist.isFollowed ? (
                  <UserCheck size={16} className="text-[#7C3AED]" />
                ) : (
                  <UserPlus size={16} />
                )
              }
            >
              {artist.isFollowed ? 'Seguindo artista' : 'Seguir artista'}
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => navigateTo('create-review')}
              leftIcon={<PenTool size={16} />}
            >
              Escrever resenha sobre o artista
            </Button>
          </div>
        </div>
      </section>

      {/* Músicas populares */}
      {artistTracks.length > 0 && (
        <section className="bg-white rounded-3xl border border-[#E4E4E7] p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#18181B]">Músicas populares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {artistTracks.slice(0, 6).map((track, i) => (
              <div
                key={track.id}
                onClick={() => navigateTo('track-detail', { trackId: track.id })}
                className="cursor-pointer"
              >
                <TrackCard track={track} index={i} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Álbuns */}
      {artistAlbums.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
            Álbuns de estúdio
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {artistAlbums.map(album => (
              <div
                key={album.id}
                onClick={() => navigateTo('album-detail', { albumId: album.id })}
                className="cursor-pointer"
              >
                <AlbumCard album={album} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EPs */}
      {artistEPs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#18181B] tracking-tight">EPs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {artistEPs.map(ep => (
              <div
                key={ep.id}
                onClick={() => navigateTo('album-detail', { albumId: ep.id })}
                className="cursor-pointer"
              >
                <AlbumCard album={ep} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Resenhas sobre o artista */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
            Resenhas da comunidade
          </h2>
          <span className="text-xs text-[#71717A]">
            {artistReviews.length} resenhas
          </span>
        </div>

        {artistReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artistReviews.map(r => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#E4E4E7] space-y-2">
            <Disc3 size={32} className="mx-auto text-[#7C3AED]" />
            <p className="text-sm font-bold text-[#18181B]">
              Ainda não há resenhas registradas para este artista.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigateTo('create-review')}
            >
              Escrever primeira resenha
            </Button>
          </div>
        )}
      </section>

      {/* Artistas relacionados */}
      {relatedArtists.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
            Artistas relacionados
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedArtists.map(rel => (
              <div
                key={rel.id}
                onClick={() => navigateTo('artist-detail', { artistId: rel.id })}
                className="cursor-pointer"
              >
                <ArtistCard artist={rel} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
