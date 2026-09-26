import React, { useState, useRef, useEffect } from 'react';
import { Bell, Moon, Sun, User, Settings, LogOut, Check, Award } from 'lucide-react';
import { Logo } from '../common/Logo';
import { Avatar } from '../common/Avatar';
import { SearchBar } from './SearchBar';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../music/NotificationItem';

export const Header: React.FC = () => {
  const {
    currentUser,
    navigateTo,
    logout,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E4E4E7] px-4 sm:px-6 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Logo */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <Logo size="sm" onClick={() => navigateTo('inicio')} />
          </div>
        </div>

        {/* Center: Search Field */}
        <div className="flex-1 max-w-xl mx-2">
          <SearchBar />
        </div>

        {/* Right Actions: Notifications & User Avatar Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notifications Trigger */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-[#71717A] hover:text-[#18181B] hover:bg-[#F8F7FC] transition-colors cursor-pointer"
              aria-label="Notificações"
            >
              <Bell size={20} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#7C3AED] ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#E4E4E7] shadow-xl p-3 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F4F4F5] px-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#18181B]">Notificações</h4>
                    {unreadNotificationsCount > 0 && (
                      <span className="text-[10px] bg-[#EDE9FE] text-[#7C3AED] font-bold px-2 py-0.5 rounded-full">
                        {unreadNotificationsCount} novas
                      </span>
                    )}
                  </div>

                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-semibold text-[#7C3AED] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Check size={12} />
                      Marcar lidas
                    </button>
                  )}
                </div>

                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {notifications.slice(0, 4).map(notif => (
                    <NotificationItem key={notif.id} notification={notif} />
                  ))}
                </div>

                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigateTo('notificacoes');
                  }}
                  className="w-full text-center py-2 mt-2 text-xs font-semibold text-[#7C3AED] hover:bg-[#EDE9FE]/40 rounded-xl transition-colors cursor-pointer"
                >
                  Ver todas as notificações →
                </button>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#EDE9FE] transition-all cursor-pointer focus:outline-none"
              aria-label="Menu do usuário"
            >
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="sm"
                status="online"
              />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E4E4E7] shadow-xl py-2 z-50 animate-in fade-in duration-150 divide-y divide-[#F4F4F5]">
                {/* User info snippet */}
                <div className="px-4 py-2.5">
                  <p className="text-xs font-bold text-[#18181B] truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-[#71717A] truncate">
                    @{currentUser.username}
                  </p>
                </div>

                {/* Navigation items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigateTo('perfil');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F8F7FC] transition-colors cursor-pointer text-left"
                  >
                    <User size={15} className="text-[#71717A]" />
                    <span>Meu perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigateTo('achievements');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F8F7FC] transition-colors cursor-pointer text-left"
                  >
                    <Award size={15} className="text-[#7C3AED]" />
                    <span>Conquistas</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigateTo('configuracoes');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F8F7FC] transition-colors cursor-pointer text-left"
                  >
                    <Settings size={15} className="text-[#71717A]" />
                    <span>Configurações</span>
                  </button>

                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F8F7FC] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      {themeMode === 'light' ? (
                        <Moon size={15} className="text-[#71717A]" />
                      ) : (
                        <Sun size={15} className="text-[#7C3AED]" />
                      )}
                      <span>Tema</span>
                    </div>
                    <span className="text-[10px] text-[#71717A] bg-[#F4F4F5] px-1.5 py-0.5 rounded">
                      {themeMode === 'light' ? 'Claro' : 'Escuro'}
                    </span>
                  </button>
                </div>

                {/* Logout */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut size={15} />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
