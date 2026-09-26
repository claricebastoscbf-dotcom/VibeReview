import React from 'react';
import { Home, Compass, Plus, Library, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';

export const BottomNavigation: React.FC = () => {
  const { currentView, navigateTo } = useApp();

  const navItems: { label: string; view: AppView; icon: React.ReactNode }[] = [
    { label: 'Início', view: 'inicio', icon: <Home size={20} /> },
    { label: 'Explorar', view: 'explorar', icon: <Compass size={20} /> },
    { label: 'Biblioteca', view: 'biblioteca', icon: <Library size={20} /> },
    { label: 'Perfil', view: 'perfil', icon: <User size={20} /> },
  ];

  return (
    <nav
      aria-label="Navegação mobile"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E4E4E7] px-4 py-2 flex items-center justify-around shadow-lg"
    >
      {/* First two items: Início, Explorar */}
      {navItems.slice(0, 2).map(item => {
        const isActive = currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => navigateTo(item.view)}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors cursor-pointer ${
              isActive ? 'text-[#7C3AED] font-bold' : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <span>{item.icon}</span>
            <span className="text-[10px] leading-none">{item.label}</span>
          </button>
        );
      })}

      {/* Visually Highlighted Center Button: Criar */}
      <button
        onClick={() => navigateTo('create-review')}
        className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#4C1D95] text-white flex items-center justify-center shadow-lg shadow-[#7C3AED]/35 active:scale-95 transition-all cursor-pointer border-2 border-white ring-2 ring-[#EDE9FE]"
        aria-label="Escrever resenha"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {/* Last two items: Biblioteca, Perfil */}
      {navItems.slice(2).map(item => {
        const isActive = currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => navigateTo(item.view)}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors cursor-pointer ${
              isActive ? 'text-[#7C3AED] font-bold' : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <span>{item.icon}</span>
            <span className="text-[10px] leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
