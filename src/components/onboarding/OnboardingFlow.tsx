import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';
import { GENRES_LIST, MOCK_ARTISTS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Headphones,
  Check,
  ArrowRight,
  ArrowLeft,
  Music,
  Compass,
  Heart,
  Disc3,
} from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const { currentUser, finishOnboarding, skipOnboarding } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    'MPB',
    'Indie',
    'R&B',
  ]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([
    'Clara Vibe',
    'Marcos Soul',
  ]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleArtist = (name: string) => {
    setSelectedArtists(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  const handleFinish = () => {
    finishOnboarding(selectedGenres, selectedArtists);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header with Progress and Skip */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between py-2">
        <Logo size="sm" />

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-[#7C3AED]'
                  : s < step
                  ? 'w-4 bg-[#7C3AED]/40'
                  : 'w-4 bg-[#E4E4E7]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={skipOnboarding}
          className="text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          Pular
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl w-full mx-auto my-auto py-6">
        {/* ================= STEP 1: Bem-vindo ================= */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E4E4E7] shadow-xl text-center space-y-6 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#4C1D95] text-white flex items-center justify-center mx-auto shadow-md shadow-[#7C3AED]/25">
              <Headphones size={32} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight">
                Bem-vindo ao VibeReview!
              </h1>
              <p className="text-sm text-[#71717A] max-w-md mx-auto leading-relaxed">
                Aqui, sua sensibilidade musical tem voz. Avalie álbuns, compartilhe resenhas sinceras, monte sua discoteca e troque ideias com quem vibra na mesma frequência.
              </p>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
              <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E4E4E7]/60">
                <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-2 font-bold text-xs">
                  <Disc3 size={15} />
                </div>
                <h4 className="text-xs font-bold text-[#18181B]">Descubra sons</h4>
                <p className="text-[11px] text-[#71717A] mt-0.5">
                  Recomendações curadas pelo gosto da comunidade.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E4E4E7]/60">
                <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-2 font-bold text-xs">
                  <Sparkles size={15} />
                </div>
                <h4 className="text-xs font-bold text-[#18181B]">Escreva resenhas</h4>
                <p className="text-[11px] text-[#71717A] mt-0.5">
                  Atribua notas, destaque faixas e expresse o que sentiu.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E4E4E7]/60">
                <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-2 font-bold text-xs">
                  <Heart size={15} />
                </div>
                <h4 className="text-xs font-bold text-[#18181B]">Comunidade real</h4>
                <p className="text-[11px] text-[#71717A] mt-0.5">
                  Sem algoritmos frios: paixão pura pela música.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="gradient"
                size="lg"
                fullWidth
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight size={18} />}
              >
                Configurar minhas preferências
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: Gêneros ================= */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E4E4E7] shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                Passo 2 de 4
              </span>
              <h2 className="text-2xl font-black text-[#18181B] tracking-tight">
                Quais gêneros você gosta?
              </h2>
              <p className="text-xs text-[#71717A]">
                Selecione quantos estilos quiser para alimentarmos sua timeline de resenhas.
              </p>
            </div>

            {/* Interactive Grid of Genres */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
              {GENRES_LIST.map(genre => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-left ${
                      isSelected
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs'
                        : 'bg-[#F8F7FC] text-[#18181B] border-[#E4E4E7] hover:border-[#C4B5FD] hover:bg-white'
                    }`}
                  >
                    <span>{genre}</span>
                    {isSelected && <Check size={14} className="text-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#F4F4F5]">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft size={16} />}
              >
                Voltar
              </Button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#71717A] tabular-nums">
                  {selectedGenres.length} selecionados
                </span>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(3)}
                  disabled={selectedGenres.length === 0}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: Artistas ================= */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E4E4E7] shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                Passo 3 de 4
              </span>
              <h2 className="text-2xl font-black text-[#18181B] tracking-tight">
                Quais artistas você gosta?
              </h2>
              <p className="text-xs text-[#71717A]">
                Escolha referências musicais para receber novidades e resenhas relevantes.
              </p>
            </div>

            {/* Demonstration Artists List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
              {MOCK_ARTISTS.map(artist => {
                const isSelected = selectedArtists.includes(artist.name);
                return (
                  <div
                    key={artist.id}
                    onClick={() => toggleArtist(artist.name)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#EDE9FE] border-[#7C3AED]'
                        : 'bg-[#F8F7FC] border-[#E4E4E7] hover:border-[#C4B5FD]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2E1065] shrink-0">
                      <img
                        src={artist.avatarUrl}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#18181B] truncate">
                        {artist.name}
                      </div>
                      <div className="text-[11px] text-[#71717A] truncate">
                        {artist.genres.slice(0, 2).join(' · ')}
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                          : 'border-[#D4D4D8] bg-white'
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#F4F4F5]">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setStep(2)}
                leftIcon={<ArrowLeft size={16} />}
              >
                Voltar
              </Button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#71717A] tabular-nums">
                  {selectedArtists.length} selecionados
                </span>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(4)}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: Pronto ================= */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E4E4E7] shadow-xl text-center space-y-6 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mx-auto shadow-sm">
              <Sparkles size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight">
                Pronto! Vamos personalizar sua experiência.
              </h2>
              <p className="text-sm text-[#71717A] max-w-md mx-auto">
                Tudo configurado, {currentUser.name}! Seu feed inicial já foi ajustado com as frequências sonoras que você mais curte.
              </p>
            </div>

            {/* Summary preview */}
            <div className="p-4 bg-[#F8F7FC] rounded-2xl border border-[#E4E4E7]/70 text-left space-y-3">
              <div>
                <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  Seus estilos preferidos:
                </span>
                <p className="text-xs text-[#18181B] font-semibold">
                  {selectedGenres.join(' · ')}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  Artistas no radar:
                </span>
                <p className="text-xs text-[#18181B] font-semibold">
                  {selectedArtists.join(' · ')}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="gradient"
                size="lg"
                fullWidth
                onClick={handleFinish}
                rightIcon={<Compass size={18} />}
              >
                Começar a explorar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Slogan Footer */}
      <div className="max-w-2xl w-full mx-auto text-center py-2">
        <p className="text-xs text-[#A1A1AA]">
          VibeReview · "Sua opinião também faz parte da música."
        </p>
      </div>
    </div>
  );
};
