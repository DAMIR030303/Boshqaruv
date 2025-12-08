import { useCallback, useEffect, useState } from 'react';

import { differenceInDays, format, isToday } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { getTranslation } from '../../i18n';
import { CalendarService } from '../../services/calendarService';
import type { Deadline, UserProfile } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface DeadlineManagerProps {
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile?: UserProfile;
  /** Kelgusi muddatlar soni (kunlar) */
  daysAhead?: number;
  /** Faqat kelgusi muddatlarni ko'rsatish */
  showUpcomingOnly?: boolean;
}

/**
 * DeadlineManager - Muddatlar boshqaruvi komponenti
 * Kontur.Extern uslubida muddatlar va eslatmalar
 */
export function DeadlineManager({
  userProfile,
  daysAhead = 7,
  showUpcomingOnly = false,
}: DeadlineManagerProps) {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<
    'all' | 'upcoming' | 'overdue' | 'completed'
  >('all');

  // Muddatlarni yuklash
  const loadDeadlines = useCallback(async () => {
    setIsLoading(true);
    try {
      let result;
      if (showUpcomingOnly) {
        result = await CalendarService.getUpcomingDeadlines(
          daysAhead,
          userProfile?.name
        );
      } else {
        result = await CalendarService.getDeadlines(userProfile?.name);
      }

      if (result.success && result.data) {
        setDeadlines(result.data);
      } else {
        toast.error(result.error || 'Muddatlarni yuklashda xatolik');
      }
    } catch (error) {
      toast.error('Muddatlarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile?.name, daysAhead, showUpcomingOnly]);

  useEffect(() => {
    loadDeadlines();
  }, [loadDeadlines]);

  // Filter qo'llash
  const filteredDeadlines = deadlines.filter(deadline => {
    switch (filter) {
      case 'upcoming':
        return deadline.status === 'upcoming';
      case 'overdue':
        return deadline.status === 'overdue';
      case 'completed':
        return deadline.status === 'completed';
      default:
        return true;
    }
  });

  // Muddat holatini aniqlash
  const getDeadlineStatus = (deadline: Deadline) => {
    if (deadline.status === 'completed') {
      return {
        icon: CheckCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        label: 'Bajarildi',
      };
    }
    if (deadline.status === 'overdue') {
      return {
        icon: XCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        label: "Muddati o'tgan",
      };
    }
    if (isToday(deadline.dueDate)) {
      return {
        icon: AlertCircle,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        label: getTranslation('deadlines.today', 'uz'),
      };
    }
    const daysLeft = differenceInDays(deadline.dueDate, new Date());
    if (daysLeft <= 3) {
      return {
        icon: AlertCircle,
        color: 'text-orange-500',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        label: `${daysLeft} kun qoldi`,
      };
    }
    return {
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      label: `${daysLeft} kun qoldi`,
    };
  };

  // Muddatni bajarilgan deb belgilash
  const markAsCompleted = async (deadlineId: string) => {
    try {
      const result = await CalendarService.updateDeadline(deadlineId, {
        status: 'completed',
      });

      if (result.success) {
        await loadDeadlines();
        toast.success('Muddat bajarilgan deb belgilandi');
      } else {
        toast.error(result.error || 'Muddat yangilashda xatolik');
      }
    } catch (error) {
      toast.error('Muddat yangilashda xatolik');
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {(['all', 'upcoming', 'overdue', 'completed'] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all'
              ? 'Barchasi'
              : f === 'upcoming'
                ? 'Kelgusi'
                : f === 'overdue'
                  ? "O'tgan"
                  : 'Bajarilgan'}
          </Button>
        ))}
      </div>

      {/* Muddatlar ro'yxati */}
      {isLoading ? (
        <Card padding="md">
          <div className="text-center py-8 text-gray-500">Yuklanmoqda...</div>
        </Card>
      ) : filteredDeadlines.length === 0 ? (
        <Card padding="md">
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Muddatlar mavjud emas</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDeadlines.map(deadline => {
            const status = getDeadlineStatus(deadline);
            const StatusIcon = status.icon;

            return (
              <Card key={deadline.id} padding="md" className="relative">
                <div className="flex items-start space-x-3">
                  {/* Status icon */}
                  <div
                    className={`p-2 rounded-lg ${status.bgColor} flex-shrink-0`}
                  >
                    <StatusIcon className={`w-5 h-5 ${status.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {deadline.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(deadline.dueDate, 'd MMMM yyyy', {
                                locale: undefined,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {format(deadline.dueDate, 'HH:mm', {
                                locale: undefined,
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${status.bgColor} ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      {deadline.status !== 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsCompleted(deadline.id)}
                          title="Bajarilgan deb belgilash"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Overdue indicator */}
                {deadline.status === 'overdue' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Statistika */}
      {deadlines.length > 0 && (
        <Card padding="md">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Statistika
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                {deadlines.filter(d => d.status === 'upcoming').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kelgusi
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">
                {deadlines.filter(d => d.status === 'overdue').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">O'tgan</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {deadlines.filter(d => d.status === 'completed').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Bajarilgan
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
