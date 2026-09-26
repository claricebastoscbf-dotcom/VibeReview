import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { User, AtSign, Mail, Lock } from 'lucide-react';

export const RegisterView: React.FC = () => {
  const { register, loginWithGoogle, setAuthMode } = useApp();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  // Email validation regex
  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Nome completo é obrigatório.';
    }

    if (!username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório.';
    } else if (username.length < 3) {
      newErrors.username = 'O nome de usuário deve ter pelo menos 3 caracteres.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Use apenas letras, números e sublinhados (_).';
    }

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Informe um endereço de e-mail válido.';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória.';
    } else if (password.length < 8) {
      newErrors.password = 'A senha deve ter no mínimo 8 caracteres.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      const res = await register(
        name.trim(),
        username.trim().toLowerCase(),
        email.trim().toLowerCase(),
        password
      );
      setIsLoading(false);
      if (!res.success) {
        setErrors({ general: res.error || 'Erro ao criar conta no Supabase.' });
      }
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    await loginWithGoogle();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-4 sm:p-6 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4E4E7] shadow-xl space-y-6">
          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center space-y-2">
            <Logo size="lg" />
            <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
              Crie sua conta no VibeReview
            </h2>
            <p className="text-xs text-[#71717A] max-w-sm">
              Sua opinião também faz parte da música. Conecte-se com outros amantes de sons e vibrações.
            </p>
          </div>

          {/* General Error Banner */}
          {errors.general && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium animate-in fade-in duration-200">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome completo"
                type="text"
                placeholder="ex: Sofia Andrade"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (errors.name || errors.general)
                    setErrors(prev => ({ ...prev, name: undefined, general: undefined }));
                }}
                error={errors.name}
                leftIcon={<User size={16} />}
              />

              <Input
                label="Nome de usuário"
                type="text"
                placeholder="ex: sofiamusic"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  if (errors.username || errors.general)
                    setErrors(prev => ({ ...prev, username: undefined, general: undefined }));
                }}
                error={errors.username}
                leftIcon={<AtSign size={16} />}
              />
            </div>

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email || errors.general)
                  setErrors(prev => ({ ...prev, email: undefined, general: undefined }));
              }}
              error={errors.email}
              leftIcon={<Mail size={16} />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Senha (mínimo 8 caracteres)"
                type="password"
                placeholder="Crie uma senha forte"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errors.password || errors.general)
                    setErrors(prev => ({ ...prev, password: undefined, general: undefined }));
                }}
                error={errors.password}
                leftIcon={<Lock size={16} />}
              />

              <Input
                label="Confirmar senha"
                type="password"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword || errors.general)
                    setErrors(prev => ({ ...prev, confirmPassword: undefined, general: undefined }));
                }}
                error={errors.confirmPassword}
                leftIcon={<Lock size={16} />}
              />
            </div>

            {/* Password strength checklist hint */}
            <div className="p-3 bg-[#F8F7FC] rounded-xl border border-[#E4E4E7] text-[11px] text-[#71717A] space-y-1">
              <div className="flex items-center gap-1.5">
                <span className={password.length >= 8 ? 'text-emerald-600 font-bold' : 'text-[#A1A1AA]'}>
                  ✓ Mínimo de 8 caracteres
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={password && confirmPassword && password === confirmPassword ? 'text-emerald-600 font-bold' : 'text-[#A1A1AA]'}>
                  ✓ Senhas coincidem
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Criar minha conta
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E4E4E7] w-full" />
            <span className="bg-white px-3 text-xs text-[#71717A] uppercase tracking-wider font-semibold">
              ou
            </span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#E4E4E7] bg-white text-sm font-semibold text-[#18181B] hover:bg-[#F8F7FC] hover:border-[#D4D4D8] active:bg-[#EDE9FE]/30 transition-all cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>

          {/* Switch to Login */}
          <div className="text-center pt-2 border-t border-[#F4F4F5]">
            <p className="text-xs text-[#71717A]">
              Já possui uma conta?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-[#7C3AED] hover:text-[#4C1D95] underline cursor-pointer"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
