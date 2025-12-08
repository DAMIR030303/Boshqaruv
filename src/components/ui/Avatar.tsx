import React from 'react';

import { clsx } from 'clsx';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Foydalanuvchi nomi (birinchi harf ko'rsatiladi) */
  name: string;
  /** Avatar o'lchami */
  size?: AvatarSize;
  /** Qo'shimcha className */
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

/**
 * Avatar komponenti
 * Foydalanuvchi avatari uchun qayta ishlatiluvchan komponent
 */
export function Avatar({
  name,
  size = 'md',
  className,
  ...props
}: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={clsx(
        'rounded-full',
        'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
        'flex items-center justify-center',
        'shadow-lg shadow-blue-500/30',
        'hover:shadow-xl hover:shadow-blue-500/40',
        'transition-all duration-300',
        'hover:scale-105',
        'ring-2 ring-blue-500/20',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="text-white font-semibold">{initial}</span>
    </div>
  );
}
