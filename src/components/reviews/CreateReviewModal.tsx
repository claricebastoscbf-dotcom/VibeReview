import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Rating } from '../common/Rating';
import { useApp } from '../../context/AppContext';
import { Album } from '../../types';
import { Sparkles, Disc3, Check, Search } from 'lucide-react';

export const CreateReviewModal: React.FC = () => {
  const {
    isCreateReviewOpen,
    closeCreateReview,
    selectedAlbumForReview,
    albums,
    addReview,
  } = useApp();

  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [rating, setRating] = useState<number>(8.5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [favoriteTrack, setFavoriteTrack] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Indie', 'Favorito']);
  const [albumSearch, setAlbumSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedAlbumForReview) {
      setActiveAlbum(selectedAlbumForReview);
      if (selectedAlbumForReview.favoriteTrack) {
        setFavoriteTrack(selectedAlbumForReview.favoriteTrack);
      }
    } else if (albums.length > 0) {
      setActiveAlbum(albums[0]);
      setFavoriteTrack(albums[0].favoriteTrack || '');
    }
  }, [selectedAlbumForReview, albums, isCreateReviewOpen]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(prev => prev.filter(x => x !== t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAlbum) {
      setError('Selecione um álbum para avaliar.');
      return;
    }
    if (!title.trim()) {
      setError('Dê um título para sua resenha.');
      return;
    }
    if (!content.trim() || content.trim().length < 20) {
      setError('A resenha deve ter pelo menos 20 caracteres.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await addReview({
        contentType: activeAlbum.type === 'ep' ? 'ep' : 'album',
        contentId: activeAlbum.id,
        albumTitle: activeAlbum.title,
        albumArtist: activeAlbum.artist,
        albumCover: activeAlbum.coverUrl,
        releaseYear: activeAlbum.releaseYear,
        genre: activeAlbum.genre,
        rating,
        title: title.trim(),
        content: content.trim(),
        favoriteTrack: favoriteTrack.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });

      // Reset form
      setTitle('');
      setContent('');
      setFavoriteTrack('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAlbums = albumSearch.trim()
    ? albums.filter(
        a =>
          a.title.toLowerCase().includes(albumSearch.toLowerCase()) ||
          a.artist.toLowerCase().includes(albumSearch.toLowerCase())
      )
    : albums;

  return (
    <Modal
      isOpen={isCreateReviewOpen}
      onClose={closeCreateReview}
      title="Publicar Resenha"
      description="Compartilhe com a comunidade sua análise crítica e sentimento sobre a obra."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Album Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18181B]">
            Álbum ou Obra
          </label>

          {activeAlbum ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F7FC] border border-[#DDD6FE]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#2E1065] shrink-0">
                  <img
                    src={activeAlbum.coverUrl}
                    alt={activeAlbum.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#18181B] truncate">
                    {activeAlbum.title}
                  </h4>
                  <p className="text-xs text-[#71717A] truncate">
                    {activeAlbum.artist} · {activeAlbum.releaseYear}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveAlbum(null)}
                className="text-xs font-semibold text-[#7C3AED] hover:underline cursor-pointer"
              >
                Trocar
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-[#71717A]" />
                <input
                  type="text"
                  placeholder="Pesquisar outro álbum..."
                  value={albumSearch}
                  onChange={e => setAlbumSearch(e.target.value)}
                  className="w-full bg-[#F8F7FC] text-xs rounded-xl pl-8 pr-3 py-2 border border-[#E4E4E7] outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
                {filteredAlbums.map(alb => (
                  <div
                    key={alb.id}
                    onClick={() => {
                      setActiveAlbum(alb);
                      setFavoriteTrack(alb.favoriteTrack || '');
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl border border-[#E4E4E7] hover:border-[#7C3AED] hover:bg-[#EDE9FE]/30 cursor-pointer text-left"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#2E1065] shrink-0">
                      <img
                        src={alb.coverUrl}
                        alt={alb.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#18181B] truncate">
                        {alb.title}
                      </div>
                      <div className="text-[10px] text-[#71717A] truncate">
                        {alb.artist}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rating Selector */}
        <div className="space-y-1.5 p-3 rounded-2xl bg-[#EDE9FE]/40 border border-[#DDD6FE]">
          <label className="text-xs font-bold text-[#4C1D95] block mb-1">
            Sua Nota (0.0 a 10.0)
          </label>
          <Rating
            value={rating}
            onChange={setRating}
            interactive
            size="md"
          />
        </div>

        {/* Review Title */}
        <Input
          label="Título da Resenha"
          placeholder="ex: Uma aula magnífica de harmonia e sintetizadores"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        {/* Review Body */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18181B]">
            Conteúdo da Resenha
          </label>
          <textarea
            rows={4}
            placeholder="O que tornou esse disco marcante? Fale sobre os arranjos, vocais, produção e a sensação geral..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full bg-white text-sm rounded-xl p-3 border border-[#E4E4E7] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none resize-none"
            required
          />
        </div>

        {/* Favorite Track (Optional) */}
        <Input
          label="Faixa Favorita (Opcional)"
          placeholder="ex: Horizonte Roxo"
          value={favoriteTrack}
          onChange={e => setFavoriteTrack(e.target.value)}
          leftIcon={<Sparkles size={16} />}
          helperText="Destaque a música que mais mexeu com você."
        />

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18181B]">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Adicionar tag (ex: Synth-Pop)"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 bg-white text-xs rounded-xl px-3 py-2 border border-[#E4E4E7] focus:border-[#7C3AED] outline-none"
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
                  className="text-[11px] font-semibold text-[#4C1D95] bg-[#EDE9FE] px-2.5 py-0.5 rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Clique para remover"
                >
                  #{t} ×
                </span>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-xs font-bold text-red-600">{error}</p>}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F4F4F5]">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={closeCreateReview}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="gradient"
            size="md"
            isLoading={isSubmitting}
            leftIcon={<Check size={16} />}
          >
            Publicar Resenha
          </Button>
        </div>
      </form>
    </Modal>
  );
};
