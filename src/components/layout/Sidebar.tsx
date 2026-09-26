import React from 'react';
import {
  Home,
  Compass,
  MessageSquareQuote,
  PlusCircle,
  Library,
  Users,
  Bell,
  User,
  Settings,
  LogOut,
  PenTool,
  Award,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    navigateTo,
    unreadNotificationsCount,
    logout,
    currentUser,
  } = useApp();

  const navItems: { label: string; view: AppView; icon: React.ReactNode; badge?: number }[] = [
    { label: 'Início', view: 'inicio', icon: <Home size={18} /> },
    { label: 'Explorar', view: 'explorar', icon: <Compass size={18} /> },
    { label: 'Resenhas', view: 'resenhas', icon: <MessageSquareQuote size={18} /> },
    { label: 'Biblioteca', view: 'biblioteca', icon: <Library size={18} /> },
    { label: 'Artistas', view: 'artistas', icon: <Users size={18} /> },
    {
      label: 'Notificações',
      view: 'notificacoes',
      icon: <Bell size={18} />,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { label: 'Conquistas', view: 'achievements', icon: <Award size={18} /> },
    { label: 'Perfil', view: 'perfil', icon: <User size={18} /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E4E4E7] h-screen sticky top-0 px-4 py-6 select-none shrink-0 justify-between">
      <div className="space-y-6">
        {/* Top Logo */}
        <div className="px-2">
          <Logo size="md" showSlogan onClick={() => navigateTo('inicio')} />
        </div>

        {/* Highlighted Create Review CTA button */}
        <div className="px-1">
          <button
            onClick={() => navigateTo('create-review')}
            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md shadow-[#7C3AED]/20 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PenTool size={16} />
            <span>Criar Resenha</span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => navigateTo(item.view)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#EDE9FE] text-[#4C1D95] font-bold'
                    : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F8F7FC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#7C3AED]' : 'text-current'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="bg-[#7C3AED] text-white text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-[#F4F4F5] space-y-1">
        <button
          onClick={() => navigateTo('configuracoes')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            currentView === 'configuracoes'
              ? 'bg-[#EDE9FE] text-[#4C1D95] font-bold'
              : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F8F7FC]'
          }`}
        >
          <Settings size={18} />
          <span>Configurações</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#71717A] hover:text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>

        {/* Compact User Bar */}
        <div
          onClick={() => navigateTo('perfil')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8F7FC] transition-colors cursor-pointer mt-2"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#EDE9FE] border border-[#DDD6FE] shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-[#18181B] truncate">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-[#71717A] truncate">
              @{currentUser.username}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
