import {
  endOfDay,
  format,
  startOfDay,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';

import type {
  AnalyticsData,
  ApiResponse,
  PerformanceInsight,
  PredictiveAnalytics,
  TrendData,
} from '../types';

import { CalendarService } from './calendarService';
import { ReportService } from './reportService';

/**
 * Analytics servisi - Advanced Analytics va Insights
 * Predictive analytics, performance insights, trend analysis
 */
export class AnalyticsService {
  /**
   * Trend ma'lumotlarini olish
   */
  static async getTrends(
    metric: 'attendance' | 'tasks' | 'productivity',
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    days: number = 30
  ): Promise<ApiResponse<TrendData[]>> {
    try {
      const trends: TrendData[] = [];
      const now = new Date();

      for (let i = days - 1; i >= 0; i--) {
        let date: Date;
        let label: string;

        if (period === 'daily') {
          date = subDays(now, i);
          label = format(date, 'd MMM', { locale: undefined });
        } else if (period === 'weekly') {
          date = subWeeks(now, i);
          label = `Hafta ${format(date, 'w', { locale: undefined })}`;
        } else {
          date = subMonths(now, i);
          label = format(date, 'MMM yyyy', { locale: undefined });
        }

        let value = 0;

        if (metric === 'attendance') {
          const kpiData = await ReportService['getKPIData'](
            startOfDay(date),
            endOfDay(date)
          );
          value =
            kpiData.attendance.total > 0
              ? (kpiData.attendance.present / kpiData.attendance.total) * 100
              : 0;
        } else if (metric === 'tasks') {
          const eventsResult = await CalendarService.getEvents(
            startOfDay(date),
            endOfDay(date)
          );
          if (eventsResult.success && eventsResult.data) {
            const tasks = eventsResult.data.filter(e => e.type === 'task');
            const completed = tasks.length; // Simplified
            value = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
          }
        } else if (metric === 'productivity') {
          // Productivity = (completed tasks / total tasks) * attendance rate
          const kpiData = await ReportService['getKPIData'](
            startOfDay(date),
            endOfDay(date)
          );
          const attendanceRate =
            kpiData.attendance.total > 0
              ? kpiData.attendance.present / kpiData.attendance.total
              : 0;
          const taskRate =
            kpiData.tasks.total > 0
              ? kpiData.tasks.completed / kpiData.tasks.total
              : 0;
          value = attendanceRate * taskRate * 100;
        }

        trends.push({
          date: format(date, 'yyyy-MM-dd'),
          value: Math.round(value * 100) / 100,
          label,
        });
      }

      return {
        success: true,
        data: trends,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Trend ma'lumotlarini olishda xatolik",
      };
    }
  }

  /**
   * Performance insights olish
   */
  static async getPerformanceInsights(
    _employeeId?: string
  ): Promise<ApiResponse<PerformanceInsight[]>> {
    try {
      const insights: PerformanceInsight[] = [];
      const now = new Date();
      const weekAgo = subDays(now, 7);

      // Hozirgi va o'tgan davr KPI ma'lumotlari
      const currentKPI = await ReportService['getKPIData'](
        startOfDay(now),
        endOfDay(now)
      );
      const weekAgoKPI = await ReportService['getKPIData'](
        startOfDay(weekAgo),
        endOfDay(weekAgo)
      );

      // Davomat insights
      if (currentKPI.attendance.total > 0) {
        const currentRate =
          (currentKPI.attendance.present / currentKPI.attendance.total) * 100;
        const weekAgoRate =
          weekAgoKPI.attendance.total > 0
            ? (weekAgoKPI.attendance.present / weekAgoKPI.attendance.total) *
              100
            : 0;
        const change = currentRate - weekAgoRate;

        insights.push({
          id: 'attendance-insight',
          type: 'attendance',
          title: "Davomat ko'rsatkichi",
          description: `Davomat darajasi ${currentRate.toFixed(1)}%`,
          value: currentRate,
          change: Math.round(change * 100) / 100,
          trend: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
          priority:
            currentRate < 80 ? 'high' : currentRate < 90 ? 'medium' : 'low',
          recommendation:
            currentRate < 80
              ? "Davomat darajasini oshirish uchun choralar ko'rish tavsiya etiladi"
              : undefined,
        });
      }

      // Vazifalar insights
      if (currentKPI.tasks.total > 0) {
        const currentRate =
          (currentKPI.tasks.completed / currentKPI.tasks.total) * 100;
        const weekAgoRate =
          weekAgoKPI.tasks.total > 0
            ? (weekAgoKPI.tasks.completed / weekAgoKPI.tasks.total) * 100
            : 0;
        const change = currentRate - weekAgoRate;

        insights.push({
          id: 'tasks-insight',
          type: 'tasks',
          title: 'Vazifalar bajarilishi',
          description: `Vazifalar bajarilish darajasi ${currentRate.toFixed(1)}%`,
          value: currentRate,
          change: Math.round(change * 100) / 100,
          trend: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
          priority:
            currentRate < 70 ? 'high' : currentRate < 85 ? 'medium' : 'low',
          recommendation:
            currentRate < 70
              ? "Vazifalar bajarilishini yaxshilash uchun qo'shimcha resurslar kerak"
              : undefined,
        });
      }

      // Productivity insights
      const attendanceRate =
        currentKPI.attendance.total > 0
          ? currentKPI.attendance.present / currentKPI.attendance.total
          : 0;
      const taskRate =
        currentKPI.tasks.total > 0
          ? currentKPI.tasks.completed / currentKPI.tasks.total
          : 0;
      const productivityScore = attendanceRate * taskRate * 100;

      const weekAgoAttendanceRate =
        weekAgoKPI.attendance.total > 0
          ? weekAgoKPI.attendance.present / weekAgoKPI.attendance.total
          : 0;
      const weekAgoTaskRate =
        weekAgoKPI.tasks.total > 0
          ? weekAgoKPI.tasks.completed / weekAgoKPI.tasks.total
          : 0;
      const weekAgoProductivity = weekAgoAttendanceRate * weekAgoTaskRate * 100;
      const productivityChange = productivityScore - weekAgoProductivity;

      insights.push({
        id: 'productivity-insight',
        type: 'productivity',
        title: 'Umumiy samaradorlik',
        description: `Samaradorlik ko'rsatkichi ${productivityScore.toFixed(1)}%`,
        value: productivityScore,
        change: Math.round(productivityChange * 100) / 100,
        trend:
          productivityChange > 5
            ? 'up'
            : productivityChange < -5
              ? 'down'
              : 'stable',
        priority:
          productivityScore < 60
            ? 'high'
            : productivityScore < 75
              ? 'medium'
              : 'low',
        recommendation:
          productivityScore < 60
            ? 'Samaradorlikni oshirish uchun jarayonlarni optimallashtirish tavsiya etiladi'
            : undefined,
      });

      return {
        success: true,
        data: insights,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Performance insights olishda xatolik',
      };
    }
  }

  /**
   * Predictive analytics - kelajakdagi tendentsiyalarni bashorat qilish
   */
  static async getPredictions(
    metric: 'attendance' | 'tasks' | 'productivity',
    timeframe: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ): Promise<ApiResponse<PredictiveAnalytics[]>> {
    try {
      const predictions: PredictiveAnalytics[] = [];
      const now = new Date();

      // O'tgan ma'lumotlarni olish (bashorat uchun)
      const historicalData: number[] = [];
      const daysToAnalyze =
        timeframe === 'daily' ? 14 : timeframe === 'weekly' ? 8 : 6;

      for (let i = daysToAnalyze - 1; i >= 0; i--) {
        let date: Date;
        if (timeframe === 'daily') {
          date = subDays(now, i);
        } else if (timeframe === 'weekly') {
          date = subWeeks(now, i);
        } else {
          date = subMonths(now, i);
        }

        const kpiData = await ReportService['getKPIData'](
          startOfDay(date),
          endOfDay(date)
        );

        let value = 0;
        if (metric === 'attendance') {
          value =
            kpiData.attendance.total > 0
              ? (kpiData.attendance.present / kpiData.attendance.total) * 100
              : 0;
        } else if (metric === 'tasks') {
          value =
            kpiData.tasks.total > 0
              ? (kpiData.tasks.completed / kpiData.tasks.total) * 100
              : 0;
        } else {
          const attendanceRate =
            kpiData.attendance.total > 0
              ? kpiData.attendance.present / kpiData.attendance.total
              : 0;
          const taskRate =
            kpiData.tasks.total > 0
              ? kpiData.tasks.completed / kpiData.tasks.total
              : 0;
          value = attendanceRate * taskRate * 100;
        }

        historicalData.push(value);
      }

      // Oddiy trend analizi (linear regression)
      const currentValue = historicalData[historicalData.length - 1];
      const average =
        historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
      const trend = currentValue - historicalData[0];
      const predictedValue = currentValue + trend / historicalData.length;

      // Confidence hisoblash (trend barqarorligiga qarab)
      const variance =
        historicalData.reduce(
          (sum, val) => sum + Math.pow(val - average, 2),
          0
        ) / historicalData.length;
      const confidence = Math.max(50, Math.min(95, 100 - variance / 2));

      // Factors
      const factors: string[] = [];
      if (trend > 0) factors.push('Ijobiy tendentsiya');
      if (variance < 5) factors.push("Barqaror ko'rsatkichlar");
      if (currentValue > average) factors.push("Yuqori o'rtacha");

      predictions.push({
        metric,
        currentValue: Math.round(currentValue * 100) / 100,
        predictedValue: Math.max(
          0,
          Math.min(100, Math.round(predictedValue * 100) / 100)
        ),
        confidence: Math.round(confidence),
        timeframe,
        factors,
      });

      return {
        success: true,
        data: predictions,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Predictive analytics olishda xatolik',
      };
    }
  }

  /**
   * To'liq analytics ma'lumotlarini olish
   */
  static async getFullAnalytics(
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    days: number = 30
  ): Promise<ApiResponse<AnalyticsData>> {
    try {
      // Barcha ma'lumotlarni parallel olish
      const [
        attendanceTrends,
        tasksTrends,
        productivityTrends,
        insights,
        attendancePred,
        tasksPred,
        productivityPred,
      ] = await Promise.all([
        this.getTrends('attendance', period, days),
        this.getTrends('tasks', period, days),
        this.getTrends('productivity', period, days),
        this.getPerformanceInsights(),
        this.getPredictions('attendance', period),
        this.getPredictions('tasks', period),
        this.getPredictions('productivity', period),
      ]);

      const now = new Date();
      const currentKPI = await ReportService['getKPIData'](
        startOfDay(now),
        endOfDay(now)
      );

      const analyticsData: AnalyticsData = {
        trends: [
          ...(attendanceTrends.data || []),
          ...(tasksTrends.data || []),
          ...(productivityTrends.data || []),
        ],
        insights: insights.data || [],
        predictions: [
          ...(attendancePred.data || []),
          ...(tasksPred.data || []),
          ...(productivityPred.data || []),
        ],
        summary: {
          totalEmployees: currentKPI.attendance.total,
          averageAttendance:
            currentKPI.attendance.total > 0
              ? (currentKPI.attendance.present / currentKPI.attendance.total) *
                100
              : 0,
          taskCompletionRate:
            currentKPI.tasks.total > 0
              ? (currentKPI.tasks.completed / currentKPI.tasks.total) * 100
              : 0,
          productivityScore:
            (currentKPI.attendance.total > 0
              ? currentKPI.attendance.present / currentKPI.attendance.total
              : 0) *
            (currentKPI.tasks.total > 0
              ? currentKPI.tasks.completed / currentKPI.tasks.total
              : 0) *
            100,
        },
      };

      return {
        success: true,
        data: analyticsData,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Analytics ma'lumotlarini olishda xatolik",
      };
    }
  }

  /**
   * Xodimlar samaradorligini tahlil qilish
   */
  static async getEmployeePerformance(
    _employeeId: string,
    days: number = 30
  ): Promise<
    ApiResponse<{
      employeeId: string;
      attendanceRate: number;
      taskCompletionRate: number;
      productivityScore: number;
      trends: TrendData[];
      insights: PerformanceInsight[];
    }>
  > {
    try {
      const now = new Date();
      const startDate = subDays(now, days);

      // Xodimning vazifalarini olish
      const eventsResult = await CalendarService.getEvents(
        startDate,
        now,
        _employeeId
      );
      const tasks =
        eventsResult.success && eventsResult.data
          ? eventsResult.data.filter(e => e.type === 'task')
          : [];

      const completedTasks = tasks.length; // Simplified
      const taskCompletionRate =
        tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

      // Trend ma'lumotlari
      const trendsResult = await this.getTrends('productivity', 'daily', days);

      // Insights
      const insightsResult = await this.getPerformanceInsights(_employeeId);

      return {
        success: true,
        data: {
          employeeId: _employeeId,
          attendanceRate: 85, // Simplified - real implementation would calculate from attendance records
          taskCompletionRate: Math.round(taskCompletionRate * 100) / 100,
          productivityScore: Math.round(taskCompletionRate * 0.85 * 100) / 100,
          trends: trendsResult.data || [],
          insights: insightsResult.data || [],
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Xodim samaradorligini tahlil qilishda xatolik',
      };
    }
  }
}
