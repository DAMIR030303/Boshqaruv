import { useState } from 'react';

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
} from 'lucide-react';

import { useCalendar } from '../../hooks/useCalendar';
import { getTranslation } from '../../i18n';
import type { CalendarEvent, UserProfile } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface CalendarViewProps {
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile?: UserProfile;
  /** Event tanlash handler */
  onEventSelect?: (event: CalendarEvent) => void;
  /** Sana tanlash handler */
  onDateSelect?: (date: Date) => void;
}

/**
 * CalendarView - Kalendar komponenti
 * Kontur.Extern uslubida kalendar ko'rinishi
 */
export function CalendarView({
  userProfile,
  onEventSelect,
  onDateSelect,
}: CalendarViewProps) {
  const {
    currentDate,
    events,
    isLoading,
    goToPrevious,
    goToNext,
    goToToday,
    changeView,
    view,
  } = useCalendar({
    assignee: userProfile?.name,
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Oylik kalendar uchun kunlarni olish
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Dushanbadan boshlanadi
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Tanlangan kundagi eventlarni olish
  const getDayEvents = (date: Date): CalendarEvent[] => {
    return events.filter(event => isSameDay(event.startDate, date));
  };

  // Sana tanlash
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  // Event tanlash
  const handleEventClick = (event: CalendarEvent) => {
    onEventSelect?.(event);
  };

  // Kun rangini aniqlash
  const getDayColor = (date: Date): string => {
    if (!isSameMonth(date, currentDate)) {
      return 'text-gray-400 dark:text-gray-600';
    }
    if (isSameDay(date, new Date())) {
      return 'text-primary-500 font-bold';
    }
    if (selectedDate && isSameDay(date, selectedDate)) {
      return 'text-white bg-primary-500 rounded-full';
    }
    return 'text-gray-900 dark:text-white';
  };

  // Kun fon rangini aniqlash (eventlar bo'lsa)
  const getDayBgColor = (date: Date): string => {
    const dayEvents = getDayEvents(date);
    if (dayEvents.length === 0) return '';

    // Eventlar bo'yicha rang
    const hasHighPriority = dayEvents.some(e => e.color === '#EF4444');
    if (hasHighPriority) return 'bg-red-100 dark:bg-red-900/30';

    const hasMediumPriority = dayEvents.some(e => e.color === '#F59E0B');
    if (hasMediumPriority) return 'bg-yellow-100 dark:bg-yellow-900/30';

    return 'bg-green-100 dark:bg-green-900/30';
  };

  const weekDays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

  return (
    <div className="space-y-4">
      {/* Kalendar header */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy', { locale: undefined })}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={goToPrevious}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              {getTranslation('calendar.today', 'uz')}
            </Button>
            <Button variant="ghost" size="sm" onClick={goToNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* View selector */}
        <div className="flex space-x-2 mb-4">
          {(['day', 'week', 'month'] as const).map(v => (
            <Button
              key={v}
              variant={view === v ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => changeView(v)}
            >
              {v === 'day' ? 'Kun' : v === 'week' ? 'Hafta' : 'Oy'}
            </Button>
          ))}
        </div>

        {/* Kalendar grid */}
        {view === 'month' && (
          <div className="grid grid-cols-7 gap-1">
            {/* Hafta kunlari */}
            {weekDays.map(day => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}

            {/* Kalendar kunlari */}
            {days.map(day => {
              const dayEvents = getDayEvents(day);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  className={`
                    aspect-square p-1 text-sm rounded-lg transition-colors
                    ${getDayColor(day)}
                    ${getDayBgColor(day)}
                    ${isToday ? 'ring-2 ring-primary-500' : ''}
                    ${isSelected ? 'bg-primary-500 text-white' : ''}
                    ${!isCurrentMonth ? 'opacity-50' : ''}
                    hover:bg-primary-100 dark:hover:bg-primary-900/30
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span>{format(day, 'd')}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex space-x-0.5 mt-0.5">
                        {dayEvents.slice(0, 3).map((event, idx) => (
                          <div
                            key={idx}
                            className="w-1 h-1 rounded-full"
                            style={{
                              backgroundColor: event.color || '#2563EB',
                            }}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-xs">
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Day view */}
        {view === 'day' && (
          <div className="space-y-2">
            <div className="text-center py-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {format(currentDate, 'd')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(currentDate, 'EEEE, MMMM yyyy', { locale: undefined })}
              </p>
            </div>
            {getDayEvents(currentDate).map(event => (
              <Card
                key={event.id}
                padding="sm"
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className="w-2 h-full rounded"
                    style={{ backgroundColor: event.color || '#2563EB' }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {event.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{format(event.startDate, 'HH:mm')}</span>
                      </div>
                      {event.assignee && (
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{event.assignee}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {getDayEvents(currentDate).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Bu kunda eventlar yo'q
              </div>
            )}
          </div>
        )}

        {/* Week view */}
        {view === 'week' && (
          <div className="space-y-2">
            {days
              .filter((_day, idx) => idx < 7)
              .map(day => {
                const dayEvents = getDayEvents(day);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={day.toISOString()}
                    className="border-b border-gray-200 dark:border-gray-700 pb-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <p
                          className={`text-sm font-medium ${isToday ? 'text-primary-500' : 'text-gray-700 dark:text-gray-300'}`}
                        >
                          {format(day, 'EEEE', { locale: undefined })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(day, 'd MMM', { locale: undefined })}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {dayEvents.length} event
                      </span>
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded"
                          style={{
                            backgroundColor: event.color
                              ? `${event.color}20`
                              : '#2563EB20',
                            color: event.color || '#2563EB',
                          }}
                        >
                          {format(event.startDate, 'HH:mm')} - {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{dayEvents.length - 3} boshqa
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </Card>

      {/* Tanlangan kundagi eventlar */}
      {selectedDate && (
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: undefined })}
          </h3>
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Yuklanmoqda...</div>
          ) : getDayEvents(selectedDate).length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Bu kunda eventlar yo'q
            </div>
          ) : (
            <div className="space-y-2">
              {getDayEvents(selectedDate).map(event => (
                <Card
                  key={event.id}
                  padding="sm"
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-2 h-full rounded flex-shrink-0"
                      style={{ backgroundColor: event.color || '#2563EB' }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{format(event.startDate, 'HH:mm')}</span>
                        </div>
                        {event.assignee && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{event.assignee}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
