import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { ShiftService } from '../../services/shiftService';
import type { ApiResponse, KPIData, Shift, UserProfile } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface MobileShiftsProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function MobileShifts(_props: MobileShiftsProps) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse<Shift[]> = await ShiftService.getShifts();
      if (response.success && response.data) {
        setShifts(response.data);
      }
    } catch (error) {
      toast.error('Smenalarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const getShiftTypeLabel = (type: Shift['type']) => {
    switch (type) {
      case 'morning':
        return 'Kunduzgi';
      case 'afternoon':
        return 'Tushdan keyin';
      case 'night':
        return 'Kechki';
    }
  };

  const getStatusColor = (status: Shift['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'completed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  if (isLoading) {
    return (
      <div className="mobile-content">
        <LoadingSpinner message="Smenalar yuklanmoqda..." />
      </div>
    );
  }

  return (
    <div className="mobile-content">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Smenalar
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Jami: {shifts.length} smena
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {shifts.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Smenalar yo'q
            </h3>
          </Card>
        ) : (
          shifts.map((shift, index) => (
            <motion.div
              key={shift.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(shift.status)}`}
                      >
                        {shift.status === 'scheduled'
                          ? 'Rejalashtirilgan'
                          : shift.status === 'active'
                            ? 'Faol'
                            : shift.status === 'completed'
                              ? 'Tugallangan'
                              : 'Bekor qilingan'}
                      </span>
                      <Badge>{getShiftTypeLabel(shift.type)}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {format(shift.startTime, 'HH:mm')} -{' '}
                        {format(shift.endTime, 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {format(shift.startTime, 'dd.MM.yyyy')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
