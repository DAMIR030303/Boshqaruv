import { useCallback, useEffect, useState } from 'react';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { AlertCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

import { PenaltyService } from '../../services/penaltyService';
import type { ApiResponse, KPIData, Penalty, UserProfile } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface MobilePenaltiesProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function MobilePenalties(_props: MobilePenaltiesProps) {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Penalty['status'] | 'all'>(
    'all'
  );

  const loadPenalties = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse<Penalty[]> =
        await PenaltyService.getPenalties(
          undefined,
          statusFilter === 'all' ? undefined : statusFilter
        );
      if (response.success && response.data) {
        setPenalties(response.data);
      }
    } catch (error) {
      toast.error('Jarimalarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadPenalties();
  }, [loadPenalties]);

  if (isLoading) {
    return (
      <div className="mobile-content">
        <LoadingSpinner message="Jarimalar yuklanmoqda..." />
      </div>
    );
  }

  return (
    <div className="mobile-content">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Jarimalar
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Jami: {penalties.length} jarima
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          {(['all', 'active', 'resolved'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {status === 'all'
                ? 'Barchasi'
                : status === 'active'
                  ? 'Faol'
                  : 'Hal qilingan'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {penalties.length === 0 ? (
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Jarimalar yo'q
            </h3>
          </Card>
        ) : (
          penalties.map((penalty, index) => (
            <motion.div
              key={penalty.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge
                        variant={
                          penalty.status === 'active' ? 'danger' : 'success'
                        }
                      >
                        {penalty.status === 'active' ? 'Faol' : 'Hal qilingan'}
                      </Badge>
                      <Badge variant="secondary">{penalty.type}</Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {penalty.reason}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{penalty.amount.toLocaleString()} so'm</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(penalty.createdAt, 'dd.MM.yyyy HH:mm')}
                    </p>
                    {penalty.resolvedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Hal qilingan: {format(penalty.resolvedAt, 'dd.MM.yyyy')}
                      </p>
                    )}
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
