import React from 'react';
import { Badge } from './Badge';
import { Clock } from 'lucide-react';

interface TaskItemProps {
  title: string;
  priority: 'Yuqori' | 'O\'rta' | 'Past';
  time: string;
  done?: boolean;
}

export function TaskItem({ title, priority, time, done = false }: TaskItemProps) {
  const priVariant = priority === 'Yuqori' ? 'danger' : priority === "O'rta" ? 'warning' : 'muted';
  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 flex items-center gap-3">
      <span className={"w-2.5 h-2.5 rounded-full " + (priority === 'Yuqori' ? 'bg-red-500' : priority === "O'rta" ? 'bg-yellow-500' : 'bg-gray-400')} />
      <div className="flex-1 min-w-0">
        <p className={"text-sm font-medium truncate " + (done ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white')}>{title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Badge variant={priVariant as any}>{priority}</Badge>
          <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{time}</span>
        </div>
      </div>
    </div>
  );
}


