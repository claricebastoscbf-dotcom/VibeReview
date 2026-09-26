import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Avatar } from '../components/common/Avatar';
import {
  Bell,
  Database,
  Shield,
  Check,
  Upload,
  User,
  MapPin,
  FileText,
  AlertCircle,
  HardDrive,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { uploadAvatar, MAX_FILE_SIZE_BYTES } from '../services/storageService';
import { getSupabaseStatus } from '../services/supabase';

export const SettingsView: React.FC = () => {
  const { currentUser, updateProfile, logout, isSupabaseActive, showToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar);

  const [notifyLikes, setNotifyLikes] = useState(true);
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyReleases, setNotifyReleases] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabaseStatus = getSupabaseStatus();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    const { url, error } = await uploadAvatar(currentUser.id, file);
    setIsUploading(false);

    if (error) {
      setUploadError(error);
      return;
    }

    if (url) {
      setAvatarUrl(url);
      updateProfile({ avatar: url });
      showToast('Avatar atualizado com sucesso! 📷');
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || currentUser.name,
      bio: bio.trim(),
      location: location.trim(),
      avatar: avatarUrl,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#18181B] tracking-tight">
          Configurações da Conta
        </h1>
        <p className="text-xs text-[#71717A]">
          Gerencie seu perfil público, preferências de banco de dados, storage e notificações
        </p>
      </div>

      {/* Supabase Status Card */}
      <div className="bg-gradient-to-br from-[#7C3AED]/10 via-[#EDE9FE]/40 to-white rounded-2xl border border-[#DDD6FE] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDD6FE]/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#7C3AED] text-white">
              <Database size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#18181B]">Status da Conexão Supabase</h2>
              <p className="text-[11px] text-[#71717A]">
                PostgreSQL + Supabase Auth + Supabase Storage (RLS Ativo)
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              isSupabaseActive
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {isSupabaseActive ? '● Supabase Conectado' : '● Modo Seguro Local / Demo'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white/80 rounded-xl border border-[#E4E4E7]">
            <span className="font-bold text-[#18181B] flex items-center gap-1.5 mb-1">
              <Shield size={14} className="text-[#7C3AED]" />
              Row Level Security
            </span>
            <p className="text-[11px] text-[#71717A]">
              17 tabelas protegidas. Usuários só podem alterar dados próprios.
            </p>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-[#E4E4E7]">
            <span className="font-bold text-[#18181B] flex items-center gap-1.5 mb-1">
              <HardDrive size={14} className="text-[#7C3AED]" />
              Storage Buckets
            </span>
            <p className="text-[11px] text-[#71717A]">
              <code>avatars</code>, <code>album-covers</code>, <code>artist-images</code> (limite 5MB).
            </p>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-[#E4E4E7]">
            <span className="font-bold text-[#18181B] flex items-center gap-1.5 mb-1">
              <RefreshCw size={14} className="text-[#7C3AED]" />
              Variáveis de Ambiente
            </span>
            <p className="text-[11px] text-[#71717A] truncate">
              VITE_SUPABASE_URL &amp; VITE_SUPABASE_ANON_KEY configuráveis.
            </p>
          </div>
        </div>
      </div>

      {/* Profile & Avatar Editing Form */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F4F4F5]">
          <User size={18} className="text-[#7C3AED]" />
          <h2 className="text-sm font-bold text-[#18181B]">Perfil do Usuário</h2>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#F8F7FC] rounded-2xl border border-[#E4E4E7]">
            <Avatar src={avatarUrl} name={name} size="xl" className="shadow-md" />
            <div className="space-y-1 text-center sm:text-left flex-1">
              <p className="text-xs font-bold text-[#18181B]">Foto de Perfil</p>
              <p className="text-[11px] text-[#71717A]">
                Formatos suportados: JPG, PNG ou WebP. Tamanho máximo: 5 MB.
              </p>
              {uploadError && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 justify-center sm:justify-start">
                  <AlertCircle size={12} /> {uploadError}
                </p>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0"
            >
              <Upload size={14} className="mr-1.5" /> Escolher Foto
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome de Exibição"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome"
              leftIcon={<User size={16} />}
              required
            />

            <Input
              label="Localização"
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="ex: São Paulo, Brasil"
              leftIcon={<MapPin size={16} />}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#18181B] block">
              Bio / Apresentação Musical
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Compartilhe seus gostos musicais, instrumentos que toca ou estilo favorito..."
              rows={3}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-xs text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {saveSuccess && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Check size={14} /> Perfil salvo com sucesso!
                </span>
              )}
            </div>
            <Button type="submit" variant="gradient" size="md">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F4F4F5]">
          <Bell size={18} className="text-[#7C3AED]" />
          <h2 className="text-sm font-bold text-[#18181B]">Notificações do Aplicativo</h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#F8F7FC] rounded-xl transition-colors">
            <div>
              <p className="text-xs font-semibold text-[#18181B]">Curtidas em resenhas</p>
              <p className="text-[11px] text-[#71717A]">
                Receber aviso quando alguém curtir sua opinião
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyLikes}
              onChange={e => setNotifyLikes(e.target.checked)}
              className="accent-[#7C3AED] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#F8F7FC] rounded-xl transition-colors">
            <div>
              <p className="text-xs font-semibold text-[#18181B]">Comentários e respostas</p>
              <p className="text-[11px] text-[#71717A]">
                Avisar quando outros ouvintes interagirem no seu feed
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyComments}
              onChange={e => setNotifyComments(e.target.checked)}
              className="accent-[#7C3AED] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#F8F7FC] rounded-xl transition-colors">
            <div>
              <p className="text-xs font-semibold text-[#18181B]">Lançamentos de artistas seguidos</p>
              <p className="text-[11px] text-[#71717A]">
                Notificações quando seus artistas lançarem singles ou álbuns novos
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyReleases}
              onChange={e => setNotifyReleases(e.target.checked)}
              className="accent-[#7C3AED] w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Logout Action */}
      <div className="p-4 bg-white rounded-2xl border border-rose-200 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-rose-700">Encerrar Sessão</h3>
          <p className="text-[11px] text-[#71717A]">
            Você precisará fazer login novamente para acessar o VibeReview.
          </p>
        </div>
        <Button variant="danger" size="sm" onClick={() => logout()}>
          <LogOut size={14} className="mr-1.5" /> Sair da Conta
        </Button>
      </div>
    </div>
  );
};
