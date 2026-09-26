import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { ArrowRight, CheckCircle2, Lock, Mail, Sparkles, Database } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, loginWithGoogle, requestPasswordReset, setAuthMode, isSupabaseActive } = useApp();

  const [credential, setCredential] = useState('dante@vibereview.com');
  const [password, setPassword] = useState('viber123456');
  const [errors, setErrors] = useState<{ credential?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { credential?: string; password?: string; general?: string } = {};

    if (!credential.trim()) {
      newErrors.credential = 'Informe seu e-mail ou nome de usuário.';
    }

    if (!password) {
      newErrors.password = 'Informe sua senha.';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      const res = await login(credential, password);
      setIsLoading(false);
      if (!res.success) {
        setErrors({ general: res.error || 'Credenciais inválidas. Tente novamente.' });
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await loginWithGoogle();
    setIsLoading(false);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) return;
    setIsResetting(true);
    const res = await requestPasswordReset(forgotEmail);
    setIsResetting(false);
    if (res.success) {
      setForgotSent(true);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotSent(false);
        setForgotEmail('');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4E4E7] shadow-xl space-y-6">
          {/* Logo & Slogan */}
          <div className="flex flex-col items-center text-center space-y-2">
            <Logo size="lg" />
            <p className="text-sm font-medium text-[#71717A] max-w-xs">
              Sua opinião também faz parte da música.
            </p>
          </div>

          {/* General Error Banner */}
          {errors.general && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium animate-in fade-in duration-200">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail ou nome de usuário"
              type="text"
              placeholder="ex: dante@vibereview.com ou @dante"
              value={credential}
              onChange={e => {
                setCredential(e.target.value);
                if (errors.credential || errors.general)
                  setErrors(prev => ({ ...prev, credential: undefined, general: undefined }));
              }}
              error={errors.credential}
              leftIcon={<Mail size={16} />}
              autoComplete="username"
            />

            <div className="space-y-1">
              <Input
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errors.password || errors.general)
                    setErrors(prev => ({ ...prev, password: undefined, general: undefined }));
                }}
                error={errors.password}
                leftIcon={<Lock size={16} />}
                autoComplete="current-password"
              />

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-semibold text-[#7C3AED] hover:text-[#4C1D95] transition-colors cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Entrar
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
            onClick={handleGoogleLogin}
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

          {/* Switch to Register link */}
          <div className="text-center pt-2 border-t border-[#F4F4F5]">
            <p className="text-xs text-[#71717A]">
              Ainda não faz parte?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="font-bold text-[#7C3AED] hover:text-[#4C1D95] underline cursor-pointer"
              >
                Não tenho uma conta
              </button>
            </p>
          </div>
        </div>

        {/* Supabase status badge */}
        <div className="mt-4 p-3 bg-[#EDE9FE]/50 rounded-2xl border border-[#DDD6FE] flex items-center justify-between text-xs text-[#4C1D95]">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-[#7C3AED]" />
            <span>
              {isSupabaseActive
                ? 'Conectado ao Supabase PostgreSQL'
                : 'Modo seguro local / demo ativo'}
            </span>
          </div>
          <button
            onClick={() => login('dante@vibereview.com')}
            className="font-bold hover:underline cursor-pointer flex items-center gap-1 text-[#7C3AED]"
          >
            Acessar direto <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Recuperação de Senha"
        description="Digite o e-mail cadastrado para receber instruções de recuperação via Supabase Auth."
      >
        {forgotSent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 size={40} className="text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-[#18181B]">E-mail enviado com sucesso!</p>
            <p className="text-xs text-[#71717A]">
              Verifique sua caixa de entrada para redefinir sua senha com segurança.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <Input
              label="E-mail cadastrado"
              type="email"
              placeholder="seu@email.com"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsForgotModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isResetting}>
                Enviar instruções
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
