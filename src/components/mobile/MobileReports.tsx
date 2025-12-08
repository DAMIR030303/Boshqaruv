import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

import { ReportService } from '../../services/reportService';
import type { KPIData, Report, UserProfile } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { SkeletonList } from '../ui/SkeletonList';

interface MobileReportsProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function MobileReports({ onDataUpdate }: MobileReportsProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      // Mock reports for now
      setReports([]);
    } catch (error) {
      toast.error('Hisobotlarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDaily = async () => {
    setIsGenerating(true);
    try {
      const report = await ReportService.generateDailyReport();
      toast.success('Kunlik hisobot yaratildi');
      setReports(prev => [report, ...prev]);
      onDataUpdate({ type: 'report_generated', report });
    } catch (error) {
      toast.error('Hisobot yaratishda xatolik');
    } finally {
      setIsGenerating(false);
    }
  };

  const getTypeLabel = (type: Report['type']) => {
    switch (type) {
      case 'attendance':
        return 'Davomat';
      case 'tasks':
        return 'Vazifalar';
      case 'performance':
        return 'Ish samaradorligi';
      case 'marketing':
        return 'Marketing';
    }
  };

  const getPeriodLabel = (period: Report['period']) => {
    switch (period) {
      case 'daily':
        return 'Kunlik';
      case 'weekly':
        return 'Haftalik';
      case 'monthly':
        return 'Oylik';
    }
  };

  if (isLoading) {
    return (
      <div className="mobile-content">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="w-40 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          </div>
        </div>
        <SkeletonList count={3} />
      </div>
    );
  }

  return (
    <div className="mobile-content">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hisobotlar
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Jami: {reports.length} hisobot
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleGenerateDaily}
            disabled={isGenerating}
            variant="secondary"
            className="w-full"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Kunlik
          </Button>
          <Button variant="secondary" className="w-full" disabled>
            Haftalik
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <EmptyState
            variant="reports"
            description="Yangi hisobot yaratish uchun yuqoridagi tugmalardan birini bosing"
            onAction={undefined}
          />
        ) : (
          reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card padding="md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {report.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">
                        {getTypeLabel(report.type)}
                      </Badge>
                      <Badge variant="secondary">
                        {getPeriodLabel(report.period)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(report.generatedAt, 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
