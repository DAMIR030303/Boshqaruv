import { useCallback, useEffect, useState } from 'react';

import { format, formatDistanceToNow } from 'date-fns';
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

import { CollaborationService } from '../../services/collaborationService';
import type { Activity as ActivityType } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ActivityFeedProps {
  /** Limit */
  limit?: number;
  /** Real-time yangilanishlar */
  realTime?: boolean;
}

/**
 * ActivityFeed - Faollik oqimi va real-time yangilanishlar
 * Barcha faolliklarni ko'rsatish
 */
export function ActivityFeed({
  limit = 50,
  realTime = true,
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Activity feed yuklash
  const loadActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await CollaborationService.getActivityFeed(limit);

      if (result.success && result.data) {
        setActivities(result.data);
      } else {
        toast.error(result.error || 'Activity feed yuklashda xatolik');
      }
    } catch (error) {
      toast.error('Activity feed yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadActivities();

    // Real-time yangilanishlar (simplified - production'da Supabase Realtime)
    if (realTime) {
      const interval = setInterval(() => {
        loadActivities();
      }, 30000); // 30 soniyada bir yangilash

      return () => clearInterval(interval);
    }
  }, [limit, realTime, loadActivities]);

  // Activity icon olish
  const getActivityIcon = (type: ActivityType['type']) => {
    switch (type) {
      case 'task_created':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'task_completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'comment_added':
        return <MessageSquare className="w-5 h-5 text-yellow-500" />;
      case 'document_uploaded':
        return <FileText className="w-5 h-5 text-purple-500" />;
      case 'meeting_scheduled':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'status_changed':
        return <Activity className="w-5 h-5 text-gray-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  // Activity label
  const getActivityLabel = (type: ActivityType['type']) => {
    switch (type) {
      case 'task_created':
        return 'Vazifa yaratildi';
      case 'task_completed':
        return 'Vazifa bajarildi';
      case 'comment_added':
        return "Sharh qo'shildi";
      case 'document_uploaded':
        return 'Hujjat yuklandi';
      case 'meeting_scheduled':
        return 'Uchrashuv rejalashtirildi';
      case 'status_changed':
        return "Status o'zgardi";
      default:
        return type;
    }
  };

  // Activity color
  const getActivityColor = (type: ActivityType['type']) => {
    switch (type) {
      case 'task_created':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'task_completed':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'comment_added':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'document_uploaded':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case 'meeting_scheduled':
        return 'bg-orange-100 dark:bg-orange-900/30';
      case 'status_changed':
        return 'bg-gray-100 dark:bg-gray-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Faollik Oqimi
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={loadActivities}>
          Yangilash
        </Button>
      </div>

      {/* Activities list */}
      {isLoading ? (
        <Card padding="md">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
            <p className="text-gray-500">Yuklanmoqda...</p>
          </div>
        </Card>
      ) : activities.length === 0 ? (
        <Card padding="md">
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Faolliklar mavjud emas</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {activities.map(activity => (
            <Card key={activity.id} padding="md" className="relative">
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div
                  className={`p-2 rounded-lg ${getActivityColor(activity.type)} flex-shrink-0`}
                >
                  {getActivityIcon(activity.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getActivityLabel(activity.type)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{activity.actor}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(activity.timestamp, {
                          addSuffix: true,
                          locale: undefined,
                        })}
                      </span>
                    </div>
                    <span className="text-xs">
                      {format(activity.timestamp, 'HH:mm', {
                        locale: undefined,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
