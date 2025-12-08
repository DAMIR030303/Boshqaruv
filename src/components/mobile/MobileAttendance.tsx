import { useCallback, useEffect, useState } from 'react';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { getTranslation } from '../../i18n';
import { AttendanceService } from '../../services/attendanceService';
import type {
  ApiResponse,
  Attendance,
  KPIData,
  UserProfile,
} from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface MobileAttendanceProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function MobileAttendance({ onDataUpdate }: MobileAttendanceProps) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // i18n helper
  const t = useCallback((key: string) => getTranslation(key, 'uz'), []);

  const loadAttendance = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse<Attendance[]> =
        await AttendanceService.getAttendanceRecords();
      if (response.success && response.data) {
        setAttendance(response.data);
      }
    } catch (error) {
      toast.error(t('attendance.loadError'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      // For demo, use a mock employee ID
      const employeeId = 'emp-1';
      const response = await AttendanceService.checkIn(
        employeeId,
        'Toshkent, Ofis'
      );
      if (response.success) {
        toast.success(t('attendance.checkInSuccess'));
        loadAttendance();
        onDataUpdate({ type: 'attendance_checked_in' });
      } else {
        toast.error(response.error || t('attendance.checkInError'));
      }
    } catch (error) {
      toast.error(t('attendance.checkInError'));
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async (attendanceId: string) => {
    try {
      const response = await AttendanceService.checkOut(attendanceId);
      if (response.success) {
        toast.success(t('attendance.checkOutSuccess'));
        loadAttendance();
        onDataUpdate({ type: 'attendance_checked_out' });
      } else {
        toast.error(response.error || t('attendance.checkOutError'));
      }
    } catch (error) {
      toast.error(t('attendance.checkOutError'));
    }
  };

  const getStatusIcon = (status: Attendance['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="mobile-content">
        <LoadingSpinner message={t('attendance.loading')} />
      </div>
    );
  }

  return (
    <div className="mobile-content">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('attendance.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('attendance.today')}{' '}
              {
                attendance.filter(a => {
                  const today = new Date();
                  const checkIn = new Date(a.checkIn);
                  return checkIn.toDateString() === today.toDateString();
                }).length
              }{' '}
              {t('attendance.employees')}
            </p>
          </div>
        </div>

        <Button
          onClick={handleCheckIn}
          disabled={isCheckingIn}
          className="w-full"
        >
          {isCheckingIn ? 'Check-in qilinmoqda...' : 'Check-in qilish'}
        </Button>
      </div>

      <div className="space-y-4">
        {attendance.length === 0 ? (
          <Card padding="lg" className="text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Davomat yozuvlari yo'q
            </h3>
          </Card>
        ) : (
          attendance.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card padding="md">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getStatusIcon(record.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          variant={
                            record.status === 'present'
                              ? 'success'
                              : record.status === 'late'
                                ? 'warning'
                                : 'danger'
                          }
                        >
                          {record.status === 'present'
                            ? 'Kelgan'
                            : record.status === 'late'
                              ? 'Kechikkan'
                              : 'Kelmagan'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Check-in: {format(record.checkIn, 'HH:mm')}
                      </p>
                      {record.checkOut && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Check-out: {format(record.checkOut, 'HH:mm')}
                        </p>
                      )}
                      {record.location && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <MapPin className="w-4 h-4" />
                          <span>{record.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {!record.checkOut && (
                    <Button
                      onClick={() => handleCheckOut(record.id)}
                      variant="secondary"
                      size="sm"
                    >
                      Check-out
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
