import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  PenTool,
  Sparkles,
  Heart,
  Flame,
  Compass,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { achievements, currentUser, navigateTo } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'PenTool':
        return <PenTool size={22} />;
      case 'Sparkles':
        return <Sparkles size={22} />;
      case 'Heart':
        return <Heart size={22} />;
      case 'Flame':
        return <Flame size={22} />;
      case 'Compass':
        return <Compass size={22} />;
      default:
        return <Award size={22} />;
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigateTo('perfil')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Voltar ao Perfil</span>
        </button>
      </div>

      {/* Gamification Hero Banner */}
      <section className="bg-gradient-to-br from-[#2E1065] via-[#4C1D95] to-[#7C3AED] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#4C1D95]/15 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#EDE9FE]">
            <Award size={14} />
            <span>Nível Crítico da Comunidade</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Suas Conquistas Musicais
          </h1>
          <p className="text-xs sm:text-sm text-[#EDE9FE]/90 max-w-md">
            Desbloqueie insígnias exclusivas à medida que explora novos timbres e contribui com resenhas no VibeReview.
          </p>
        </div>

        {/* Global Progress Dial / Bar */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center shrink-0 w-full sm:w-56">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#EDE9FE]">
            Progresso Geral
          </span>
          <div className="text-3xl font-black mt-1 tabular-nums">
            {unlockedCount} / {achievements.length}
          </div>
          <div className="w-full bg-black/20 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-[#EDE9FE]/80 mt-1 inline-block tabular-nums">
            {progressPercent}% completado
          </span>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
          Todas as insígnias
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all ${
                ach.unlocked
                  ? 'bg-white border-[#DDD6FE] shadow-xs'
                  : 'bg-[#F8F7FC] border-[#E4E4E7] opacity-80'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    ach.unlocked
                      ? 'bg-gradient-to-tr from-[#7C3AED] to-[#4C1D95] text-white shadow-[#7C3AED]/25'
                      : 'bg-[#E4E4E7] text-[#71717A]'
                  }`}
                >
                  {getIcon(ach.iconName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#18181B] truncate">
                      {ach.title}
                    </h3>
                    {ach.unlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle2 size={12} />
                        Desbloqueado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#71717A] bg-[#E4E4E7] px-2 py-0.5 rounded-full shrink-0">
                        <Lock size={11} />
                        Bloqueado
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
                    {ach.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-[#71717A] tabular-nums">
                      <span>
                        Progresso: {ach.progress} / {ach.maxProgress}
                      </span>
                      {ach.unlockedDate && (
                        <span className="text-[#4C1D95] font-bold">
                          Conquistado em {ach.unlockedDate}
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-[#E4E4E7] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          ach.unlocked ? 'bg-[#7C3AED]' : 'bg-[#A1A1AA]'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            (ach.progress / ach.maxProgress) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
