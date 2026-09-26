import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NotificationItem } from '../components/music/NotificationItem';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Bell, CheckCheck } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
  } = useApp();

  const [filter, setFilter] = useState<'todas' | 'nao_lidas'>('todas');

  const filteredNotifs =
    filter === 'nao_lidas'
      ? notifications.filter(n => !n.read)
      : notifications;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#18181B] tracking-tight">
            Notificações
          </h1>
          <p className="text-xs text-[#71717A]">
            Acompanhe interações da comunidade com suas resenhas e perfil
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllNotificationsAsRead}
            leftIcon={<CheckCheck size={14} />}
          >
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#E4E4E7]/40 rounded-xl w-fit">
        <button
          onClick={() => setFilter('todas')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'todas'
              ? 'bg-white text-[#4C1D95] shadow-xs'
              : 'text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          Todas ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('nao_lidas')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'nao_lidas'
              ? 'bg-white text-[#4C1D95] shadow-xs'
              : 'text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          Não lidas ({unreadNotificationsCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifs.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-2 divide-y divide-[#F4F4F5] shadow-xs">
          {filteredNotifs.map(notif => (
            <NotificationItem key={notif.id} notification={notif} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell size={28} />}
          title="Nenhuma notificação no momento"
          description="Quando alguém curtir suas resenhas, comentar ou quando seus artistas favoritos lançarem álbuns, você verá aqui."
        />
      )}
    </div>
  );
};
