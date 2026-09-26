import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { ReviewCard } from '../components/music/ReviewCard';
import { AlbumCard } from '../components/music/AlbumCard';
import { TrackCard } from '../components/music/TrackCard';
import { EmptyState } from '../components/common/EmptyState';
import {
  MapPin,
  Calendar,
  PenTool,
  Edit3,
  Heart,
  Music2,
  Users,
  Check,
  Award,
  BarChart3,
  Bookmark,
  Disc3,
  Activity,
  UserCheck,
  UserPlus,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    communityUsers,
    routeParams,
    reviews,
    albums,
    tracks,
    updateProfile,
    navigateTo,
    toggleFollowUser,
  } = useApp();

  const targetUsername = routeParams.username || currentUser.username;
  const isMe = targetUsername.toLowerCase() === currentUser.username.toLowerCase();

  const displayUser = isMe
    ? currentUser
    : communityUsers.find(
        u => u.username.toLowerCase() === targetUsername.toLowerCase()
      ) || currentUser;

  const [activeTab, setActiveTab] = useState<'resenhas' | 'favoritos' | 'biblioteca' | 'atividade'>('resenhas');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editLocation, setEditLocation] = useState(currentUser.location || '');

  // User Reviews
  const userReviews = reviews.filter(
    r =>
      r.userId === displayUser.id ||
      r.userUsername.toLowerCase() === displayUser.username.toLowerCase()
  );

  // User Favorite Albums
  const favoriteAlbums = albums.filter(a =>
    displayUser.favoriteAlbumIds?.includes(a.id)
  );

  // User Favorite Tracks
  const favoriteTracks = tracks.filter(t =>
    displayUser.favoriteTrackIds?.includes(t.id)
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim(),
      bio: editBio.trim(),
      location: editLocation.trim(),
    });
    setIsEditModalOpen(false);
  };

  // Stats calculation
  const stats = displayUser.stats || {
    topGenre: displayUser.favoriteGenres[0] || 'MPB',
    topArtist: displayUser.favoriteArtists[0] || 'Milton Nascimento',
    averageRatingGiven: 8.8,
    totalReviews: userReviews.length,
    totalAlbumsReviewed: Math.round(userReviews.length * 0.75),
    totalTracksReviewed: Math.round(userReviews.length * 0.25),
    genreDistribution: [
      { genre: 'MPB', count: 12, percentage: 40 },
      { genre: 'Indie', count: 8, percentage: 27 },
      { genre: 'R&B', count: 6, percentage: 20 },
      { genre: 'Eletrônica', count: 4, percentage: 13 },
    ],
    ratingDistribution: [
      { range: '9.0 - 10.0', count: 14 },
      { range: '8.0 - 8.9', count: 9 },
      { range: '6.0 - 7.9', count: 4 },
      { range: '4.0 - 5.9', count: 1 },
      { range: '0.0 - 3.9', count: 0 },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl border border-[#E4E4E7] overflow-hidden shadow-xs">
        {/* Cover Banner */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-[#2E1065] via-[#4C1D95] to-[#7C3AED] relative" />

        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar and Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-4 gap-4">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-[#EDE9FE]">
                <img
                  src={displayUser.avatar}
                  alt={displayUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {isMe ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditName(currentUser.name);
                      setEditBio(currentUser.bio || '');
                      setEditLocation(currentUser.location || '');
                      setIsEditModalOpen(true);
                    }}
                    leftIcon={<Edit3 size={14} />}
                  >
                    Editar perfil
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigateTo('achievements')}
                    leftIcon={<Award size={14} className="text-[#7C3AED]" />}
                  >
                    Conquistas
                  </Button>
                </>
              ) : (
                <Button
                  variant={displayUser.isFollowedByMe ? 'outline' : 'gradient'}
                  size="sm"
                  onClick={() => toggleFollowUser(displayUser.id)}
                  leftIcon={
                    displayUser.isFollowedByMe ? (
                      <UserCheck size={14} className="text-[#7C3AED]" />
                    ) : (
                      <UserPlus size={14} />
                    )
                  }
                >
                  {displayUser.isFollowedByMe ? 'Seguindo' : 'Seguir usuário'}
                </Button>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight">
                {displayUser.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#7C3AED]">
                @{displayUser.username}
              </p>
            </div>

            {displayUser.bio && (
              <p className="text-xs sm:text-sm text-[#3F3F46] max-w-2xl leading-relaxed">
                {displayUser.bio}
              </p>
            )}

            {/* Location & Member info */}
            <div className="flex items-center gap-4 text-xs text-[#71717A] flex-wrap">
              {displayUser.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#A1A1AA]" />
                  <span>{displayUser.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#A1A1AA]" />
                <span>Membro desde {displayUser.joinedDate}</span>
              </div>
            </div>

            {/* Favorite Genres unboxed */}
            {displayUser.favoriteGenres && displayUser.favoriteGenres.length > 0 && (
              <div className="pt-1 flex items-center gap-1.5 text-xs text-[#71717A] flex-wrap">
                <span className="font-bold text-[#18181B]">Estilos no radar:</span>
                {displayUser.favoriteGenres.map((g, idx) => (
                  <React.Fragment key={g}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <span className="text-[#4C1D95] font-semibold">{g}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#F4F4F5] text-center">
            <div className="p-3 rounded-2xl bg-[#F8F7FC]">
              <div className="text-xl font-black text-[#18181B] tabular-nums">
                {userReviews.length}
              </div>
              <div className="text-xs text-[#71717A] font-medium">Resenhas</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8F7FC]">
              <div className="text-xl font-black text-[#18181B] tabular-nums">
                {displayUser.albumsListenedCount}
              </div>
              <div className="text-xs text-[#71717A] font-medium">Álbuns ouvidos</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8F7FC]">
              <div className="text-xl font-black text-[#18181B] tabular-nums">
                {displayUser.followersCount}
              </div>
              <div className="text-xs text-[#71717A] font-medium">Seguidores</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8F7FC]">
              <div className="text-xl font-black text-[#18181B] tabular-nums">
                {displayUser.followingCount}
              </div>
              <div className="text-xs text-[#71717A] font-medium">Seguindo</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE ESTATÍSTICAS E GRÁFICOS (conforme solicitado pelo prompt) */}
      <section className="bg-white rounded-3xl border border-[#E4E4E7] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F5]">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-[#7C3AED]" />
            <h2 className="text-base font-bold text-[#18181B]">
              Estatísticas do Crítico
            </h2>
          </div>
          <span className="text-xs text-[#71717A]">
            Baseado nas resenhas publicadas
          </span>
        </div>

        {/* 6 Key Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E4E4E7]/70">
            <span className="text-[11px] font-semibold text-[#71717A] block">
              Gênero mais avaliado
            </span>
            <span className="text-sm font-black text-[#7C3AED] mt-1 block truncate">
              {stats.topGenre}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E4E4E7]/70">
            <span className="text-[11px] font-semibold text-[#71717A] block">
              Artista mais avaliado
            </span>
            <span className="text-sm font-black text-[#4C1D95] mt-1 block truncate">
              {stats.topArtist}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E4E4E7]/70">
            <span className="text-[11px] font-semibold text-[#71717A] block">
              Nota média dada
            </span>
            <span className="text-sm font-black text-[#2E1065] mt-1 block tabular-nums">
              {stats.averageRatingGiven.toFixed(1)} / 10.0
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E4E4E7]/70">
            <span className="text-[11px] font-semibold text-[#71717A] block">
              Total de resenhas
            </span>
            <span className="text-sm font-black text-[#18181B] mt-1 block tabular-nums">
              {stats.totalReviews} resenhas
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E4E4E7]/70">
            <span className="text-[11px] font-semibold text-[#71717A] block">
              Álbuns avaliados
            </span>
            <span className="text-sm font-black text-[#18181B] mt-1 block tabular-nums">
              {stats.totalAlbumsReviewed} obras
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E4E4E7]/70">
            <span className="text-[11px] font-semibold text-[#71717A] block">
              Músicas avaliadas
            </span>
            <span className="text-sm font-black text-[#18181B] mt-1 block tabular-nums">
              {stats.totalTracksReviewed} faixas
            </span>
          </div>
        </div>

        {/* Simple Clean Bar Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Chart 1: Distribuição de notas */}
          <div className="p-4 rounded-2xl bg-[#F8F7FC] border border-[#E4E4E7]/70 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
              Distribuição de notas dadas
            </h3>
            <div className="space-y-2">
              {stats.ratingDistribution.map(item => {
                const max = 15;
                const widthPercent = Math.min(100, Math.round((item.count / max) * 100));
                return (
                  <div key={item.range} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#71717A] font-medium">
                      <span>{item.range}</span>
                      <span className="tabular-nums font-bold text-[#18181B]">{item.count}</span>
                    </div>
                    <div className="w-full bg-[#E4E4E7] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(4, widthPercent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Gêneros mais resenhados */}
          <div className="p-4 rounded-2xl bg-[#F8F7FC] border border-[#E4E4E7]/70 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
              Gêneros com mais análises
            </h3>
            <div className="space-y-2">
              {stats.genreDistribution.map(g => (
                <div key={g.genre} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#71717A] font-medium">
                    <span>{g.genre}</span>
                    <span className="tabular-nums font-bold text-[#7C3AED]">{g.percentage}%</span>
                  </div>
                  <div className="w-full bg-[#E4E4E7] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#7C3AED] h-full rounded-full transition-all duration-500"
                      style={{ width: `${g.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation: Resenhas, Favoritos, Biblioteca, Atividade */}
      <div className="flex items-center gap-1.5 p-1 bg-[#E4E4E7]/40 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('resenhas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'resenhas'
              ? 'bg-white text-[#4C1D95] shadow-xs'
              : 'text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <PenTool size={14} />
          <span>Resenhas ({userReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favoritos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'favoritos'
              ? 'bg-white text-[#4C1D95] shadow-xs'
              : 'text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <Heart size={14} />
          <span>Favoritos ({favoriteAlbums.length + favoriteTracks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('biblioteca')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'biblioteca'
              ? 'bg-white text-[#4C1D95] shadow-xs'
              : 'text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <Bookmark size={14} />
          <span>Biblioteca</span>
        </button>

        <button
          onClick={() => setActiveTab('atividade')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'atividade'
              ? 'bg-white text-[#4C1D95] shadow-xs'
              : 'text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <Activity size={14} />
          <span>Atividade Recente</span>
        </button>
      </div>

      {/* Tab 1: Resenhas */}
      {activeTab === 'resenhas' && (
        <div className="space-y-4">
          {userReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Music2 size={28} />}
              title="Nenhuma resenha publicada ainda"
              description="Compartilhe seus pensamentos musicais com a comunidade do VibeReview."
              actionLabel={isMe ? 'Escrever primeira resenha' : undefined}
              onAction={isMe ? () => navigateTo('create-review') : undefined}
            />
          )}
        </div>
      )}

      {/* Tab 2: Favoritos */}
      {activeTab === 'favoritos' && (
        <div className="space-y-6">
          {favoriteAlbums.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#18181B]">Álbuns Favoritos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {favoriteAlbums.map(album => (
                  <div
                    key={album.id}
                    onClick={() => navigateTo('album-detail', { albumId: album.id })}
                    className="cursor-pointer"
                  >
                    <AlbumCard album={album} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {favoriteTracks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#18181B]">Músicas Favoritas</h3>
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
            </div>
          )}

          {favoriteAlbums.length === 0 && favoriteTracks.length === 0 && (
            <EmptyState
              icon={<Heart size={28} />}
              title="Nenhum favorito adicionado ainda"
              description="Explore o catálogo musical e favorite as obras que mais tocarem sua alma."
            />
          )}
        </div>
      )}

      {/* Tab 3: Biblioteca */}
      {activeTab === 'biblioteca' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-[#E4E4E7] space-y-2">
            <h3 className="text-sm font-bold text-[#18181B]">
              Resumo da Coleção Pessoal
            </h3>
            <p className="text-xs text-[#71717A]">
              {displayUser.albumsListenedCount} obras ouvidas até o momento ·{' '}
              {displayUser.favoriteAlbumIds?.length || 0} álbuns favoritados ·{' '}
              {displayUser.watchlistAlbumIds?.length || 0} na lista "Quero Ouvir".
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {albums.slice(0, 4).map(album => (
              <div
                key={album.id}
                onClick={() => navigateTo('album-detail', { albumId: album.id })}
                className="cursor-pointer"
              >
                <AlbumCard album={album} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Atividade Recente */}
      {activeTab === 'atividade' && (
        <div className="bg-white rounded-3xl border border-[#E4E4E7] p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#18181B]">Linha do tempo</h3>
          <div className="space-y-4 border-l-2 border-[#DDD6FE] pl-4">
            <div className="space-y-1 relative">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] absolute -left-[21px] top-1.5" />
              <p className="text-xs text-[#18181B]">
                Publicou uma nova resenha sobre o álbum{' '}
                <span className="font-bold text-[#4C1D95]">Discovery</span>
              </p>
              <span className="text-[10px] text-[#A1A1AA]">Há 3 dias</span>
            </div>

            <div className="space-y-1 relative">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4C1D95] absolute -left-[21px] top-1.5" />
              <p className="text-xs text-[#18181B]">
                Adicionou{' '}
                <span className="font-bold text-[#4C1D95]">Neon Serenade</span> aos seus
                álbuns favoritos
              </p>
              <span className="text-[10px] text-[#A1A1AA]">Há 5 dias</span>
            </div>

            <div className="space-y-1 relative">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[21px] top-1.5" />
              <p className="text-xs text-[#18181B]">
                Desbloqueou a insígnia{' '}
                <span className="font-bold text-emerald-700">Crítico Frequente</span>
              </p>
              <span className="text-[10px] text-[#A1A1AA]">Há 1 semana</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Perfil"
        description="Atualize suas informações públicas de ouvinte."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Nome de exibição"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#18181B]">Bio</label>
            <textarea
              rows={3}
              value={editBio}
              onChange={e => setEditBio(e.target.value)}
              className="w-full text-xs bg-white border border-[#E4E4E7] rounded-xl p-2.5 outline-none focus:border-[#7C3AED]"
              placeholder="Fale um pouco sobre o que você costuma ouvir..."
            />
          </div>

          <Input
            label="Localização"
            value={editLocation}
            onChange={e => setEditLocation(e.target.value)}
            placeholder="ex: São Paulo, Brasil"
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-[#F4F4F5]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" leftIcon={<Check size={14} />}>
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
