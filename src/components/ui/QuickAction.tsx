import React from 'react';
import { motion } from 'framer-motion';

interface QuickActionProps {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass?: string; // e.g. 'bg-blue-500'
  onClick?: () => void;
}

export function QuickAction({ title, subtitle, icon: Icon, colorClass = 'bg-primary-500', onClick }: QuickActionProps) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="w-full bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/70 dark:border-gray-700/60 rounded-2xl px-4 py-3 flex items-center shadow-md active:scale-95 transition-all duration-150">
        <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center text-white mr-3`}
             aria-hidden>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}


