import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {children}
    </h2>
  );
}


