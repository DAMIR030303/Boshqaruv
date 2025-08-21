import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass?: string;
  onClick?: () => void;
}

export function StatCard({ title, value, subtitle, icon: Icon, colorClass = 'bg-primary-500', onClick }: StatCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}


