import React from 'react';
import { NotificationItemData } from '../../types';
import { Avatar } from '../common/Avatar';
import { Heart, MessageSquare, UserPlus, Disc3, Bell, CornerDownRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationItemProps {
  notification: NotificationItemData;
  className?: string;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  className = '',
}) => {
  const { markNotificationAsRead, navigateTo } = useApp();

  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart size={12} className="fill-rose-500 text-rose-500" />;
      case 'comment':
        return <MessageSquare size={12} className="text-[#7C3AED]" />;
      case 'reply':
        return <CornerDownRight size={12} className="text-[#4C1D95]" />;
      case 'follow':
        return <UserPlus size={12} className="text-emerald-600" />;
      case 'new_release':
        return <Disc3 size={12} className="text-amber-500" />;
      default:
        return <Bell size={12} className="text-[#7C3AED]" />;
    }
  };

  const handleClick = () => {
    markNotificationAsRead(notification.id);
    if (notification.type === 'follow') {
      navigateTo('user-profile', { username: notification.actorUsername });
    } else if (notification.targetId) {
      if (notification.targetId.startsWith('rev_')) {
        navigateTo('review-detail', { reviewId: notification.targetId });
      } else if (notification.targetId.startsWith('alb_')) {
        navigateTo('album-detail', { albumId: notification.targetId });
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group flex items-start gap-3.5 p-3.5 rounded-2xl transition-all cursor-pointer ${
        notification.read
          ? 'bg-white hover:bg-[#F8F7FC] border border-transparent'
          : 'bg-[#EDE9FE]/40 hover:bg-[#EDE9FE]/60 border border-[#DDD6FE]'
      } ${className}`}
    >
      <div className="relative shrink-0">
        <Avatar src={notification.actorAvatar} name={notification.actorName} size="md" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-xs border border-[#E4E4E7] flex items-center justify-center">
          {getIcon()}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#18181B] leading-relaxed">
          <span className="font-bold">{notification.actorName}</span>{' '}
          <span className="text-[#71717A]">{notification.message}</span>{' '}
          {notification.targetTitle && (
            <span className="font-semibold text-[#4C1D95]">
              "{notification.targetTitle}"
            </span>
          )}
        </p>
        <span className="text-[11px] text-[#A1A1AA] mt-1 inline-block">
          {notification.timestamp}
        </span>
      </div>

      {!notification.read && (
        <span
          className="w-2 h-2 rounded-full bg-[#7C3AED] shrink-0 mt-1.5"
          aria-label="Não lida"
        />
      )}
    </div>
  );
};
