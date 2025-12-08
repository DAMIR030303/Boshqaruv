import { useCallback, useEffect, useState } from 'react';

import { differenceInMinutes, format, isPast, isToday } from 'date-fns';
import {
  Calendar,
  Clock,
  Edit,
  Play,
  Plus,
  Trash2,
  Users,
  Video,
} from 'lucide-react';
import { toast } from 'sonner';

import { getTranslation } from '../../i18n';
import { MeetingService } from '../../services/meetingService';
import type { Meeting, UserProfile } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

import { VideoConference } from './VideoConference';

interface MeetingManagerProps {
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile?: UserProfile;
  /** Kelgusi uchrashuvlar soni (kunlar) */
  daysAhead?: number;
}

/**
 * MeetingManager - Uchrashuvlar boshqaruvi komponenti
 * Kontur.Tolk uslubida uchrashuvlar rejalashtirish va boshqarish
 */
export function MeetingManager({
  userProfile,
  daysAhead = 7,
}: MeetingManagerProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showVideoConference, setShowVideoConference] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // i18n helper - useCallback bilan wrap qilindi
  const t = useCallback((key: string) => getTranslation(key, 'uz'), []);

  // Uchrashuvlarni yuklash
  const loadMeetings = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await MeetingService.getUpcomingMeetings(
        daysAhead,
        userProfile?.name
      );

      if (result.success && result.data) {
        setMeetings(result.data);
      } else {
        toast.error(result.error || t('meetings.loadError'));
      }
    } catch (error) {
      toast.error(t('meetings.loadError'));
    } finally {
      setIsLoading(false);
    }
  }, [userProfile?.name, daysAhead, t]);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  // Uchrashuvni boshlash
  const handleStartMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowVideoConference(true);
  };

  // Uchrashuvni o'chirish
  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm(t('meetings.deleteConfirm'))) {
      return;
    }

    try {
      const result = await MeetingService.deleteMeeting(meetingId);

      if (result.success) {
        await loadMeetings();
        toast.success(t('meetings.deleteSuccess'));
      } else {
        toast.error(result.error || t('meetings.deleteError'));
      }
    } catch (error) {
      toast.error(t('meetings.deleteError'));
    }
  };

  // Uchrashuv holatini aniqlash
  const getMeetingStatus = (meeting: Meeting) => {
    if (meeting.status === 'completed') {
      return {
        label: t('meetings.status.completed'),
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
      };
    }
    if (meeting.status === 'in_progress') {
      return {
        label: t('meetings.status.inProgress'),
        color: 'text-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      };
    }
    if (meeting.status === 'cancelled') {
      return {
        label: t('meetings.status.cancelled'),
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
      };
    }
    if (isPast(meeting.startTime)) {
      return {
        label: t('meetings.status.past'),
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
      };
    }
    if (isToday(meeting.startTime)) {
      return {
        label: t('meetings.status.today'),
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
      };
    }
    const minutesUntil = differenceInMinutes(meeting.startTime, new Date());
    if (minutesUntil <= 15) {
      return {
        label: t('meetings.status.soon'),
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      };
    }
    return {
      label: t('meetings.status.scheduled'),
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('meetings.title')}
          </h2>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          {t('meetings.new')}
        </Button>
      </div>

      {/* Uchrashuvlar ro'yxati */}
      {isLoading ? (
        <Card padding="md">
          <div className="text-center py-8 text-gray-500">
            {t('common.loading')}
          </div>
        </Card>
      ) : meetings.length === 0 ? (
        <Card padding="md">
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('meetings.noMeetings')}</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {meetings.map(meeting => {
            const status = getMeetingStatus(meeting);
            const canStart =
              meeting.status === 'scheduled' && !isPast(meeting.startTime);

            return (
              <Card key={meeting.id} padding="md" className="relative">
                <div className="flex items-start space-x-3">
                  {/* Video icon */}
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex-shrink-0">
                    <Video className="w-5 h-5 text-primary-500" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {meeting.title}
                        </h3>
                        {meeting.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {meeting.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${status.bgColor} ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Meeting details */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(meeting.startTime, 'd MMMM yyyy', {
                              locale: undefined,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(meeting.startTime, 'HH:mm', {
                              locale: undefined,
                            })}{' '}
                            -{' '}
                            {format(meeting.endTime, 'HH:mm', {
                              locale: undefined,
                            })}
                          </span>
                        </div>
                      </div>

                      {meeting.participants.length > 0 && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>
                            {meeting.participants.length}{' '}
                            {t('meetings.participants')}
                          </span>
                        </div>
                      )}

                      {meeting.videoConferenceLink && (
                        <div className="text-xs text-primary-500">
                          {t('meetings.videoConference')}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 mt-3">
                      {canStart && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStartMeeting(meeting)}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          {t('meetings.start')}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          /* Edit functionality */
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMeeting(meeting.id)}
                      >
                        <Trash2 className="w-4 h-4 text-danger-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Video Conference Modal */}
      {showVideoConference && selectedMeeting && (
        <VideoConference
          meeting={selectedMeeting}
          onClose={() => {
            setShowVideoConference(false);
            setSelectedMeeting(null);
            loadMeetings();
          }}
          onEnd={() => {
            setShowVideoConference(false);
            setSelectedMeeting(null);
            loadMeetings();
          }}
        />
      )}

      {/* Create Meeting Form (placeholder) */}
      {showCreateForm && (
        <Card
          padding="md"
          className="fixed inset-4 z-50 bg-white dark:bg-gray-800 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('meetings.new')} {t('meetings.title').toLowerCase()}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateForm(false)}
            >
              ×
            </Button>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Uchrashuv yaratish formasi kelajakda qo'shiladi
          </p>
        </Card>
      )}
    </div>
  );
}
