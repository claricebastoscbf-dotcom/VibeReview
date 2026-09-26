import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ContentType } from '../types';
import { Rating } from '../components/common/Rating';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { searchAlbums, searchTracks, searchArtists } from '../services/musicService';
import { useDebounce } from '../utils/useDebounce';
import {
  Search,
  Check,
  Disc3,
  Music,
  Users,
  Sparkles,
  ThumbsUp,
  RotateCcw,
  Heart,
  Save,
  PenTool,
  ArrowLeft,
  X,
} from 'lucide-react';

export const CreateReviewView: React.FC = () => {
  const {
    albums,
    tracks,
    artists,
    addReview,
    navigateTo,
    selectedAlbumForReview,
    reviewDraft,
    saveReviewDraft,
  } = useApp();

  const [contentType, setContentType] = useState<ContentType>('album');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [apiSearchResults, setApiSearchResults] = useState<{
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    year: number;
    genre: string;
    extraInfo?: string;
  }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    year: number;
    genre: string;
    extraInfo?: string;
  } | null>(null);

  // Form Fields
  const [rating, setRating] = useState<number>(8.5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Destaque']);
  const [recommends, setRecommends] = useState(true);
  const [wantToListenAgain, setWantToListenAgain] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteTrack, setFavoriteTrack] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Live search effect via musicService
  useEffect(() => {
    let active = true;
    const q = debouncedQuery.trim();
    if (!q) {
      setApiSearchResults([]);
      return;
    }

    setIsSearching(true);

    const performSearch = async () => {
      try {
        if (contentType === 'album' || contentType === 'ep') {
          const res = await searchAlbums(q, 8);
          if (active) {
            setApiSearchResults(
              res.data.map(a => ({
                id: a.id,
                title: a.title,
                artist: a.artist,
                coverUrl: a.coverUrl,
                year: a.releaseYear,
                genre: a.genre,
                extraInfo: `${a.tracksCount} faixas · Nota média ${a.averageRating.toFixed(1)}`,
              }))
            );
          }
        } else if (contentType === 'musica') {
          const res = await searchTracks(q, 8);
          if (active) {
            setApiSearchResults(
              res.data.map(t => ({
                id: t.id,
                title: t.title,
                artist: t.artist,
                coverUrl: t.coverUrl,
                year: t.releaseYear,
                genre: t.genre,
                extraInfo: `${t.albumTitle} · Duração: ${t.duration}`,
              }))
            );
          }
        } else {
          const res = await searchArtists(q, 8);
          if (active) {
            setApiSearchResults(
              res.data.map(art => ({
                id: art.id,
                title: art.name,
                artist: art.type === 'banda' ? 'Banda' : 'Artista solo',
                coverUrl: art.avatarUrl,
                year: 2026,
                genre: art.genres.join(', '),
                extraInfo: `${art.monthlyListeners} ouvintes · ${art.followersCount.toLocaleString()} seguidores`,
              }))
            );
          }
        }
      } catch {
        // Keep fallback
      } finally {
        if (active) setIsSearching(false);
      }
    };

    performSearch();

    return () => {
      active = false;
    };
  }, [debouncedQuery, contentType]);

  // Load from draft or preselected item
  useEffect(() => {
    if (selectedAlbumForReview) {
      setContentType(selectedAlbumForReview.type === 'ep' ? 'ep' : 'album');
      setSelectedItem({
        id: selectedAlbumForReview.id,
        title: selectedAlbumForReview.title,
        artist: selectedAlbumForReview.artist,
        coverUrl: selectedAlbumForReview.coverUrl,
        year: selectedAlbumForReview.releaseYear,
        genre: selectedAlbumForReview.genre,
        extraInfo: `${selectedAlbumForReview.tracksCount} faixas · Nota média ${selectedAlbumForReview.averageRating.toFixed(1)}`,
      });
      if (selectedAlbumForReview.favoriteTrack) {
        setFavoriteTrack(selectedAlbumForReview.favoriteTrack);
      }
    } else if (reviewDraft) {
      setContentType(reviewDraft.contentType);
      setSelectedItem(reviewDraft.selectedItem);
      setRating(reviewDraft.rating);
      setTitle(reviewDraft.title);
      setContent(reviewDraft.content);
      setTags(reviewDraft.tags);
      setRecommends(reviewDraft.recommends);
      setWantToListenAgain(reviewDraft.wantToListenAgain);
      setIsFavorite(reviewDraft.isFavorite);
      setFavoriteTrack(reviewDraft.favoriteTrack || '');
    } else {
      // Default to first popular album if none selected
      const defaultAlbum = albums[0];
      if (defaultAlbum) {
        setSelectedItem({
          id: defaultAlbum.id,
          title: defaultAlbum.title,
          artist: defaultAlbum.artist,
          coverUrl: defaultAlbum.coverUrl,
          year: defaultAlbum.releaseYear,
          genre: defaultAlbum.genre,
          extraInfo: `${defaultAlbum.tracksCount} faixas · Nota média ${defaultAlbum.averageRating.toFixed(1)}`,
        });
        if (defaultAlbum.favoriteTrack) {
          setFavoriteTrack(defaultAlbum.favoriteTrack);
        }
      }
    }
  }, [selectedAlbumForReview, reviewDraft, albums]);

  // Content type tabs
  const contentTypes: { id: ContentType; label: string; icon: React.ReactNode }[] = [
    { id: 'album', label: 'Álbum', icon: <Disc3 size={15} /> },
    { id: 'musica', label: 'Música', icon: <Music size={15} /> },
    { id: 'ep', label: 'EP', icon: <Disc3 size={15} /> },
    { id: 'artista', label: 'Artista', icon: <Users size={15} /> },
    { id: 'banda', label: 'Banda', icon: <Users size={15} /> },
  ];

  // Merged Search Results (API + Local)
  const q = searchQuery.toLowerCase().trim();
  const localResults = q
    ? contentType === 'album' || contentType === 'ep'
      ? albums
          .filter(
            a =>
              (contentType === 'ep' ? a.type === 'ep' : a.type !== 'ep') &&
              (a.title.toLowerCase().includes(q) ||
                a.artist.toLowerCase().includes(q) ||
                a.genre.toLowerCase().includes(q))
          )
          .map(a => ({
            id: a.id,
            title: a.title,
            artist: a.artist,
            coverUrl: a.coverUrl,
            year: a.releaseYear,
            genre: a.genre,
            extraInfo: `${a.tracksCount} faixas · Nota média ${a.averageRating.toFixed(1)}`,
          }))
      : contentType === 'musica'
      ? tracks
          .filter(
            t =>
              t.title.toLowerCase().includes(q) ||
              t.artist.toLowerCase().includes(q) ||
              t.albumTitle.toLowerCase().includes(q)
          )
          .map(t => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            coverUrl: t.coverUrl,
            year: t.releaseYear,
            genre: t.genre,
            extraInfo: `${t.albumTitle} · Duração: ${t.duration}`,
          }))
      : artists
          .filter(
            art =>
              (contentType === 'banda'
                ? art.type === 'banda'
                : art.type === 'artista') &&
              (art.name.toLowerCase().includes(q) ||
                art.genres.some(g => g.toLowerCase().includes(q)))
          )
          .map(art => ({
            id: art.id,
            title: art.name,
            artist: art.type === 'banda' ? 'Banda' : 'Artista solo',
            coverUrl: art.avatarUrl,
            year: 2026,
            genre: art.genres.join(', '),
            extraInfo: `${art.monthlyListeners} ouvintes mensais · ${art.followersCount.toLocaleString()} seguidores`,
          }))
    : [];

  const combinedResults = [...localResults, ...apiSearchResults];
  const searchResults = Array.from(new Map(combinedResults.map(i => [i.title.toLowerCase() + i.artist.toLowerCase(), i])).values());

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleSaveDraft = () => {
    saveReviewDraft({
      contentType,
      selectedItem,
      rating,
      title,
      content,
      tags,
      recommends,
      wantToListenAgain,
      isFavorite,
      favoriteTrack,
    });
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) {
      setError('Por favor, selecione uma música, álbum ou artista para avaliar.');
      return;
    }
    if (!title.trim()) {
      setError('Informe um título expressivo para sua resenha.');
      return;
    }
    if (!content.trim() || content.trim().length < 25) {
      setError('Sua resenha deve ter no mínimo 25 caracteres para expressar bem sua opinião.');
      return;
    }

    setError(null);
    setIsPublishing(true);

    try {
      const createdReview = await addReview({
        contentType,
        contentId: selectedItem.id,
        albumTitle: selectedItem.title,
        albumArtist: selectedItem.artist,
        albumCover: selectedItem.coverUrl,
        releaseYear: selectedItem.year,
        genre: selectedItem.genre,
        rating,
        title: title.trim(),
        content: content.trim(),
        tags: tags.length > 0 ? tags : undefined,
        recommends,
        wantToListenAgain,
        isFavorite,
        favoriteTrack: favoriteTrack.trim() || undefined,
      });

      // Navigate to the published review page
      navigateTo('review-detail', { reviewId: createdReview.id });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Back button and Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('inicio')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </button>

        <span className="text-xs text-[#A1A1AA] italic">
          "Sua opinião também faz parte da música."
        </span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight">
          Escreva sua resenha
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] mt-1">
          Avalie e compartilhe sua experiência com o disco, faixa ou discografia completa.
        </p>
      </div>

      {/* 1. Escolher tipo de conteúdo */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-xs space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] block mb-2">
            1. O que você vai avaliar?
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {contentTypes.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setContentType(item.id);
                  setSelectedItem(null);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  contentType === item.id
                    ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs'
                    : 'bg-[#F8F7FC] text-[#71717A] border-[#E4E4E7] hover:border-[#C4B5FD]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Campo de pesquisa */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#18181B] block">
            Procure por uma música, álbum ou artista...
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Digite o nome do ${contentType}...`}
              className="w-full bg-[#F8F7FC] text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 border border-[#E4E4E7] focus:border-[#7C3AED] outline-none focus:bg-white transition-colors"
            />
          </div>

          {/* Search Dropdown / Results */}
          {searchQuery.trim() && (
            <div className="max-h-60 overflow-y-auto divide-y divide-[#F4F4F5] border border-[#E4E4E7] rounded-xl bg-white shadow-md p-1">
              {searchResults.length > 0 ? (
                searchResults.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#EDE9FE]/40 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#2E1065] shrink-0">
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#18181B] truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#71717A] truncate">
                        {item.artist} · {item.genre} ({item.year})
                      </p>
                    </div>
                    <span className="text-xs text-[#7C3AED] font-semibold">
                      Selecionar
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[#71717A]">
                  Nenhum item encontrado com esse nome. Tente outro termo de busca.
                </div>
              )}
            </div>
          )}

          {/* Selected Item Preview Card */}
          {selectedItem && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EDE9FE]/50 border border-[#DDD6FE] mt-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#2E1065] shadow-xs shrink-0">
                  <img
                    src={selectedItem.coverUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#4C1D95] text-white">
                      {contentType}
                    </span>
                    <h3 className="text-sm font-bold text-[#18181B] truncate">
                      {selectedItem.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#4C1D95] font-semibold truncate mt-0.5">
                    {selectedItem.artist}
                  </p>
                  <p className="text-[11px] text-[#71717A] truncate">
                    {selectedItem.genre} · {selectedItem.year} {selectedItem.extraInfo ? `· ${selectedItem.extraInfo}` : ''}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer ml-3 shrink-0"
              >
                Trocar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Editor */}
      <form onSubmit={handlePublish} className="space-y-6">
        {/* Avaliação 0 a 10 */}
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-xs space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] block">
            2. Sua nota e classificação
          </label>
          <Rating
            value={rating}
            onChange={setRating}
            interactive
            size="lg"
            showLabel
          />
        </div>

        {/* Editor de Texto e Título */}
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-xs space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] block">
            3. Sua resenha crítica
          </label>

          <Input
            label="Título da resenha"
            placeholder="ex: Uma aula magistral de sintetizadores e lirismo poético"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#18181B]">
              Texto completo da resenha
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="O que essa obra fez você sentir? Fale sobre os arranjos, mixagem, conceito, letras e momentos altos..."
              className="w-full bg-[#F8F7FC] text-xs sm:text-sm rounded-xl p-3.5 border border-[#E4E4E7] focus:border-[#7C3AED] focus:bg-white outline-none focus:ring-2 focus:ring-[#EDE9FE] transition-all resize-y"
              required
            />
          </div>

          <Input
            label="Faixa favorita (Opcional)"
            placeholder="ex: Horizonte Roxo"
            value={favoriteTrack}
            onChange={e => setFavoriteTrack(e.target.value)}
            leftIcon={<Sparkles size={16} />}
            helperText="Selecione a faixa mais marcante para destacar aos leitores."
          />

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#18181B]">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Adicionar tag (ex: Synth-Pop, Nostalgia)"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 bg-[#F8F7FC] text-xs rounded-xl px-3.5 py-2.5 border border-[#E4E4E7] focus:border-[#7C3AED] outline-none"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                Adicionar
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map(t => (
                  <span
                    key={t}
                    onClick={() => handleRemoveTag(t)}
                    className="text-xs font-semibold text-[#4C1D95] bg-[#EDE9FE] px-2.5 py-1 rounded-lg cursor-pointer hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center gap-1"
                  >
                    <span>#{t}</span>
                    <X size={12} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Opções e Recomendações */}
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-xs space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] block mb-1">
            4. Selos e Recomendações
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setRecommends(!recommends)}
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all cursor-pointer text-left ${
                recommends
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-[#F8F7FC] border-[#E4E4E7] text-[#71717A]'
              }`}
            >
              <ThumbsUp size={16} className={recommends ? 'fill-current' : ''} />
              <span>Recomendo aos ouvintes</span>
            </button>

            <button
              type="button"
              onClick={() => setWantToListenAgain(!wantToListenAgain)}
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all cursor-pointer text-left ${
                wantToListenAgain
                  ? 'bg-[#EDE9FE] border-[#7C3AED] text-[#4C1D95]'
                  : 'bg-[#F8F7FC] border-[#E4E4E7] text-[#71717A]'
              }`}
            >
              <RotateCcw size={16} />
              <span>Quero ouvir novamente</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all cursor-pointer text-left ${
                isFavorite
                  ? 'bg-rose-50 border-rose-500 text-rose-800'
                  : 'bg-[#F8F7FC] border-[#E4E4E7] text-[#71717A]'
              }`}
            >
              <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
              <span>Marcar como favorito</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Botões: Salvar rascunho / Publicar resenha */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleSaveDraft}
            leftIcon={<Save size={16} />}
          >
            Salvar rascunho
          </Button>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            leftIcon={<Check size={18} strokeWidth={2.5} />}
          >
            Publicar resenha
          </Button>
        </div>
      </form>
    </div>
  );
};
