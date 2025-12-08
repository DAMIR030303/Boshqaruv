import React from 'react';

import { clsx } from 'clsx';

interface QuickActionProps {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass?: string;
  onClick?: () => void;
}

/**
 * Responsive Quick Action komponenti
 * Tezkor amallar uchun tugma
 */
export function QuickAction({
  title,
  subtitle,
  icon: Icon,
  colorClass = 'bg-blue-600',
  onClick,
}: QuickActionProps) {
  return (
    <button onClick={onClick} className="quick-action w-full text-left">
      <div className={clsx('quick-action-icon', colorClass)}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>

      <div className="quick-action-content">
        <p className="quick-action-title">{title}</p>
        {subtitle && <p className="quick-action-subtitle">{subtitle}</p>}
      </div>

      {/* Arrow indicator */}
      <svg
        className="w-5 h-5 text-slate-400 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}
