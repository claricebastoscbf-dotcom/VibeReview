import React from 'react';

export const LoadingSkeleton: React.FC<{ type?: 'card' | 'row' | 'avatar' | 'review'; count?: number }> = ({
  type = 'card',
  count = 1,
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map(idx => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-3 border border-[#E4E4E7] shadow-xs animate-pulse flex flex-col gap-3"
          >
            <div className="w-full aspect-square bg-[#EDE9FE]/50 rounded-xl" />
            <div className="h-4 bg-[#EDE9FE]/60 rounded-md w-3/4" />
            <div className="h-3 bg-[#EDE9FE]/40 rounded-md w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'review') {
    return (
      <div className="space-y-4">
        {items.map(idx => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-[#E4E4E7] shadow-xs animate-pulse space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EDE9FE]/70" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-[#EDE9FE]/60 rounded w-1/4" />
                <div className="h-3 bg-[#EDE9FE]/40 rounded w-1/6" />
              </div>
            </div>
            <div className="h-5 bg-[#EDE9FE]/60 rounded w-2/3" />
            <div className="space-y-2">
              <div className="h-3 bg-[#EDE9FE]/40 rounded w-full" />
              <div className="h-3 bg-[#EDE9FE]/40 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div className="space-y-2">
        {items.map(idx => (
          <div
            key={idx}
            className="flex items-center gap-4 p-3 bg-white rounded-xl border border-[#E4E4E7] animate-pulse"
          >
            <div className="w-12 h-12 bg-[#EDE9FE]/60 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#EDE9FE]/60 rounded w-1/3" />
              <div className="h-3 bg-[#EDE9FE]/40 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <div className="w-10 h-10 rounded-full bg-[#EDE9FE]/70 animate-pulse" />;
};
