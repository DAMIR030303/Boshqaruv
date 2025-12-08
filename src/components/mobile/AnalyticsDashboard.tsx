import { useCallback, useEffect, useState } from 'react';

import {
  Activity,
  BarChart3,
  Download,
  RefreshCw,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

import { AnalyticsService } from '../../services/analyticsService';
import type { AnalyticsData, UserProfile } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Chart, InsightCard } from '../ui/Chart';

interface AnalyticsDashboardProps {
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile?: UserProfile;
}

/**
 * AnalyticsDashboard - Chuqur tahlil va insights dashboard
 * Advanced Analytics va Performance Insights
 */
export function AnalyticsDashboard({
  userProfile: _userProfile,
}: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedMetric, setSelectedMetric] = useState<
    'attendance' | 'tasks' | 'productivity'
  >('attendance');

  // Analytics ma'lumotlarini yuklash
  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await AnalyticsService.getFullAnalytics(
        period,
        period === 'daily' ? 30 : period === 'weekly' ? 12 : 6
      );

      if (result.success && result.data) {
        setAnalyticsData(result.data);
      } else {
        toast.error(
          result.error || "Analytics ma'lumotlarini yuklashda xatolik"
        );
      }
    } catch (error) {
      toast.error("Analytics ma'lumotlarini yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Export funksiyasi
  const handleExport = async () => {
    try {
      // PDF yoki Excel export (keyinchalik implement qilinadi)
      toast.success("Export funksiyasi tez orada qo'shiladi");
    } catch (error) {
      toast.error('Export qilishda xatolik');
    }
  };

  if (isLoading && !analyticsData) {
    return (
      <div className="space-y-4">
        <Card padding="md">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-500">
              Analytics ma'lumotlari yuklanmoqda...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <Card padding="md">
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Analytics ma'lumotlari mavjud emas</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Analytics va Tahlil
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={loadAnalytics}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex space-x-2">
        {(['daily', 'weekly', 'monthly'] as const).map(p => (
          <Button
            key={p}
            variant={period === p ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setPeriod(p)}
          >
            {p === 'daily' ? 'Kunlik' : p === 'weekly' ? 'Haftalik' : 'Oylik'}
          </Button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          padding="md"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Davomat</p>
              <p className="text-2xl font-bold">
                {analyticsData.summary.averageAttendance.toFixed(1)}%
              </p>
            </div>
            <Activity className="w-8 h-8 opacity-80" />
          </div>
        </Card>

        <Card
          padding="md"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Vazifalar</p>
              <p className="text-2xl font-bold">
                {analyticsData.summary.taskCompletionRate.toFixed(1)}%
              </p>
            </div>
            <Zap className="w-8 h-8 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Metric selector */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {(['attendance', 'tasks', 'productivity'] as const).map(metric => (
          <Button
            key={metric}
            variant={selectedMetric === metric ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedMetric(metric)}
          >
            {metric === 'attendance'
              ? 'Davomat'
              : metric === 'tasks'
                ? 'Vazifalar'
                : 'Samaradorlik'}
          </Button>
        ))}
      </div>

      {/* Trend chart */}
      <TrendChart
        metric={selectedMetric}
        period={period}
        color={
          selectedMetric === 'attendance'
            ? '#2563EB'
            : selectedMetric === 'tasks'
              ? '#10B981'
              : '#F59E0B'
        }
      />

      {/* Performance Insights */}
      {analyticsData.insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <span>Performance Insights</span>
          </h3>
          {analyticsData.insights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {/* Predictive Analytics */}
      {analyticsData.predictions.length > 0 && (
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bashoratlar
          </h3>
          <div className="space-y-4">
            {analyticsData.predictions.map((prediction, index) => (
              <div key={index} className="border-l-4 border-primary-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {prediction.metric === 'attendance'
                      ? 'Davomat'
                      : prediction.metric === 'tasks'
                        ? 'Vazifalar'
                        : 'Samaradorlik'}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {prediction.confidence}% ishonch
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {prediction.predictedValue.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    (hozirgi: {prediction.currentValue.toFixed(1)}%)
                  </p>
                </div>
                {prediction.factors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Faktorlar:</p>
                    <div className="flex flex-wrap gap-1">
                      {prediction.factors.map((factor, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/**
 * TrendChart komponenti - Trend ma'lumotlarini ko'rsatish
 */
interface TrendChartProps {
  metric: 'attendance' | 'tasks' | 'productivity';
  period: 'daily' | 'weekly' | 'monthly';
  color: string;
}

function TrendChart({ metric, period, color }: TrendChartProps) {
  const [trendData, setTrendData] = useState<
    { date: string; value: number; label?: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await AnalyticsService.getTrends(
          metric,
          period,
          period === 'daily' ? 30 : period === 'weekly' ? 12 : 6
        );
        if (result.success && result.data) {
          setTrendData(result.data);
        }
      } catch (error) {
        // Error handling
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [metric, period]);

  if (isLoading) {
    return (
      <Card padding="md">
        <div className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </Card>
    );
  }

  return (
    <Chart
      title={
        metric === 'attendance'
          ? 'Davomat tendentsiyasi'
          : metric === 'tasks'
            ? 'Vazifalar tendentsiyasi'
            : 'Samaradorlik tendentsiyasi'
      }
      data={trendData}
      type="line"
      color={color}
      height={200}
      yAxisLabel="%"
    />
  );
}
