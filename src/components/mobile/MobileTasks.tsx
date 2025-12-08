import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  Clock,
  Plus,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

import { TaskService } from '../../services/taskService';
import type { ApiResponse, KPIData, Task, UserProfile } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { SkeletonList } from '../ui/SkeletonList';

import { TaskForm } from './forms/TaskForm';

interface MobileTasksProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
  onNavigate?: (tab: string) => void;
}

/**
 * Vazifalar boshqaruvi sahifasi
 */
export function MobileTasks({ onDataUpdate }: MobileTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>(
    'all'
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse<Task[]> = await TaskService.getTasks();
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        toast.error(response.error || 'Vazifalarni yuklashda xatolik');
      }
    } catch (error) {
      toast.error('Vazifalarni yuklashda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: Task['status']
  ) => {
    try {
      const response = await TaskService.updateTask(taskId, {
        status: newStatus,
      });
      if (response.success) {
        toast.success('Vazifa statusi yangilandi');
        loadTasks();
        onDataUpdate({ type: 'task_updated', id: taskId });
      } else {
        toast.error(response.error || 'Vazifani yangilashda xatolik');
      }
    } catch (error) {
      toast.error('Vazifani yangilashda xatolik yuz berdi');
    }
  };

  const handleTaskSubmit = (task: Task) => {
    loadTasks();
    onDataUpdate({ type: 'task_created', id: task.id });
    setShowAddModal(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddModal(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  if (isLoading) {
    return (
      <div className="mobile-content">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="w-24 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <SkeletonList count={5} />
      </div>
    );
  }

  return (
    <div className="mobile-content">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Vazifalar
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Jami: {tasks.length} vazifa
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Qo'shish
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Vazifalarni qidirish..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {(['all', 'pending', 'in-progress', 'completed'] as const).map(
              status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    statusFilter === status
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {status === 'all'
                    ? 'Barchasi'
                    : status === 'pending'
                      ? 'Kutilmoqda'
                      : status === 'in-progress'
                        ? 'Jarayonda'
                        : 'Bajarilgan'}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <EmptyState variant="tasks" onAction={() => setShowAddModal(true)} />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card padding="md" hoverable>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    {getStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {task.description}
                      </p>
                      <div className="flex items-center space-x-2 flex-wrap mb-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'high'
                            ? 'Yuqori'
                            : task.priority === 'medium'
                              ? "O'rta"
                              : 'Past'}
                        </Badge>
                        <Badge variant="secondary">{task.assignee}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Muddati: {format(task.dueDate, 'dd.MM.yyyy')}
                      </p>
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          Tahrirlash
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  {task.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'pending')}
                      className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Kutilmoqda
                    </button>
                  )}
                  {task.status !== 'in-progress' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'in-progress')}
                      className="flex-1 px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      Jarayonda
                    </button>
                  )}
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'completed')}
                      className="flex-1 px-3 py-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      Bajarilgan
                    </button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask || undefined}
        onSubmit={handleTaskSubmit}
        onClose={() => {
          setShowAddModal(false);
          setEditingTask(null);
        }}
        isOpen={showAddModal}
      />
    </div>
  );
}
