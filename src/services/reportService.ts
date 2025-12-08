import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';

import type { KPIData, Report } from '../types';
import { safeLocalStorage } from '../utils/storage';
import { supabase } from '../utils/supabaseClient';

import { CalendarService } from './calendarService';

/**
 * Report servisi - Kontur.Extern uslubida
 * Avtomatik hisobotlar generatsiyasi
 */
export class ReportService {
  /**
   * Kunlik hisobot yaratish
   */
  static async generateDailyReport(date: Date = new Date()): Promise<Report> {
    const start = startOfDay(date);
    const end = endOfDay(date);

    // KPI ma'lumotlarini olish
    const kpiData = await this.getKPIData(start, end);

    // Vazifalar statistikasi
    const tasksResult = await CalendarService.getEvents(start, end);
    const tasks =
      tasksResult.success && tasksResult.data
        ? tasksResult.data.filter(e => e.type === 'task')
        : [];

    const report: Report = {
      id: `daily-${format(date, 'yyyy-MM-dd')}`,
      type: 'attendance',
      title: `Kunlik hisobot - ${format(date, 'd MMMM yyyy', { locale: undefined })}`,
      data: {
        date: format(date, 'yyyy-MM-dd'),
        kpi: kpiData,
        tasks: {
          total: tasks.length,
          completed: tasks.filter(t => t.type === 'task').length,
          byPriority: {
            high: tasks.filter(t => t.color === '#EF4444').length,
            medium: tasks.filter(t => t.color === '#F59E0B').length,
            low: tasks.filter(t => t.color === '#10B981').length,
          },
        },
        summary: {
          totalEmployees: kpiData.attendance.total,
          presentEmployees: kpiData.attendance.present,
          lateEmployees: kpiData.attendance.late,
          absentEmployees: kpiData.attendance.absent,
        },
      },
      generatedAt: new Date(),
      period: 'daily',
    };

    return report;
  }

  /**
   * Haftalik hisobot yaratish
   */
  static async generateWeeklyReport(date: Date = new Date()): Promise<Report> {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });

    // KPI ma'lumotlarini olish
    const kpiData = await this.getKPIData(start, end);

    // Vazifalar statistikasi
    const tasksResult = await CalendarService.getEvents(start, end);
    const tasks =
      tasksResult.success && tasksResult.data
        ? tasksResult.data.filter(e => e.type === 'task')
        : [];

    // Kunlik statistikalar
    const dailyStats = [];
    for (let i = 0; i < 7; i++) {
      const day = subDays(end, 6 - i);
      const dayKpi = await this.getKPIData(startOfDay(day), endOfDay(day));
      dailyStats.push({
        date: format(day, 'yyyy-MM-dd'),
        attendance: dayKpi.attendance,
        tasks: dayKpi.tasks,
      });
    }

    const report: Report = {
      id: `weekly-${format(start, 'yyyy-MM-dd')}`,
      type: 'performance',
      title: `Haftalik hisobot - ${format(start, 'd MMM')} - ${format(end, 'd MMM yyyy', { locale: undefined })}`,
      data: {
        period: {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd'),
        },
        kpi: kpiData,
        tasks: {
          total: tasks.length,
          completed: tasks.length,
          byPriority: {
            high: tasks.filter(t => t.color === '#EF4444').length,
            medium: tasks.filter(t => t.color === '#F59E0B').length,
            low: tasks.filter(t => t.color === '#10B981').length,
          },
        },
        dailyStats,
        summary: {
          totalEmployees: kpiData.attendance.total,
          averageAttendance:
            dailyStats.reduce((sum, day) => sum + day.attendance.present, 0) /
            7,
          totalTasks: tasks.length,
          completedTasks: tasks.length,
        },
      },
      generatedAt: new Date(),
      period: 'weekly',
    };

    return report;
  }

  /**
   * Oylik hisobot yaratish
   */
  static async generateMonthlyReport(date: Date = new Date()): Promise<Report> {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    // KPI ma'lumotlarini olish
    const kpiData = await this.getKPIData(start, end);

    // Vazifalar statistikasi
    const tasksResult = await CalendarService.getEvents(start, end);
    const tasks =
      tasksResult.success && tasksResult.data
        ? tasksResult.data.filter(e => e.type === 'task')
        : [];

    // Haftalik statistikalar
    const weeklyStats = [];
    let currentWeekStart = start;
    while (currentWeekStart <= end) {
      const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
      const weekKpi = await this.getKPIData(
        weekStart,
        weekEnd > end ? end : weekEnd
      );
      weeklyStats.push({
        week: format(weekStart, 'yyyy-MM-dd'),
        attendance: weekKpi.attendance,
        tasks: weekKpi.tasks,
      });
      currentWeekStart = new Date(weekEnd.getTime() + 24 * 60 * 60 * 1000);
    }

    const report: Report = {
      id: `monthly-${format(date, 'yyyy-MM')}`,
      type: 'performance',
      title: `Oylik hisobot - ${format(date, 'MMMM yyyy', { locale: undefined })}`,
      data: {
        month: format(date, 'yyyy-MM'),
        kpi: kpiData,
        tasks: {
          total: tasks.length,
          completed: tasks.length,
          byPriority: {
            high: tasks.filter(t => t.color === '#EF4444').length,
            medium: tasks.filter(t => t.color === '#F59E0B').length,
            low: tasks.filter(t => t.color === '#10B981').length,
          },
        },
        weeklyStats,
        summary: {
          totalEmployees: kpiData.attendance.total,
          averageAttendance:
            weeklyStats.reduce(
              (sum, week) => sum + week.attendance.present,
              0
            ) / weeklyStats.length,
          totalTasks: tasks.length,
          completedTasks: tasks.length,
          attendanceRate:
            (kpiData.attendance.present / kpiData.attendance.total) * 100,
        },
      },
      generatedAt: new Date(),
      period: 'monthly',
    };

    return report;
  }

  /**
   * Marketing hisoboti yaratish
   */
  static async generateMarketingReport(
    date: Date = new Date()
  ): Promise<Report> {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    try {
      // Instagram postlar
      const { data: instagramPosts } = await supabase
        .from('instagram_posts')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      // Video loyihalar
      const { data: videoProjects } = await supabase
        .from('video_projects')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      const report: Report = {
        id: `marketing-${format(date, 'yyyy-MM')}`,
        type: 'marketing',
        title: `Marketing hisoboti - ${format(date, 'MMMM yyyy', { locale: undefined })}`,
        data: {
          month: format(date, 'yyyy-MM'),
          instagramPosts: {
            total: instagramPosts?.length || 0,
            published:
              instagramPosts?.filter(p => p.status === 'published').length || 0,
            inProgress:
              instagramPosts?.filter(p => p.status === 'in_progress').length ||
              0,
            draft:
              instagramPosts?.filter(p => p.status === 'draft').length || 0,
          },
          videoProjects: {
            total: videoProjects?.length || 0,
            completed:
              videoProjects?.filter(v => v.status === 'completed').length || 0,
            editing:
              videoProjects?.filter(v => v.status === 'editing').length || 0,
          },
          summary: {
            totalContent:
              (instagramPosts?.length || 0) + (videoProjects?.length || 0),
            publishedContent:
              (instagramPosts?.filter(p => p.status === 'published').length ||
                0) +
              (videoProjects?.filter(v => v.status === 'completed').length ||
                0),
          },
        },
        generatedAt: new Date(),
        period: 'monthly',
      };

      return report;
    } catch (error) {
      throw new Error(
        `Marketing hisoboti yaratishda xatolik: ${error instanceof Error ? error.message : "Noma'lum xatolik"}`
      );
    }
  }

  /**
   * KPI ma'lumotlarini olish
   */
  private static async getKPIData(_start: Date, _end: Date): Promise<KPIData> {
    try {
      // Supabase'dan KPI ma'lumotlarini olish
      const { data, error } = await supabase
        .from('kpi')
        .select('data')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        // Default KPI ma'lumotlari
        return {
          attendance: {
            present: 0,
            late: 0,
            absent: 0,
            total: 0,
          },
          tasks: {
            completed: 0,
            inProgress: 0,
            pending: 0,
            total: 0,
          },
          penalties: {
            active: 0,
            resolved: 0,
            total: 0,
          },
        };
      }

      return data.data as KPIData;
    } catch (error) {
      // Default KPI ma'lumotlari
      return {
        attendance: {
          present: 0,
          late: 0,
          absent: 0,
          total: 0,
        },
        tasks: {
          completed: 0,
          inProgress: 0,
          pending: 0,
          total: 0,
        },
        penalties: {
          active: 0,
          resolved: 0,
          total: 0,
        },
      };
    }
  }

  /**
   * Hisobotni saqlash
   */
  static async saveReport(
    report: Report
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Hozircha localStorage'da saqlaymiz
      // Production'da Supabase'ga saqlash kerak
      const reports = safeLocalStorage.getItem<Report[]>('reports', []) ?? [];
      reports.push(report);
      safeLocalStorage.setItem('reports', reports);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Noma'lum xatolik",
      };
    }
  }

  /**
   * Saqlangan hisobotlarni olish
   */
  static async getSavedReports(): Promise<Report[]> {
    try {
      const reports = safeLocalStorage.getItem<Report[]>('reports', []) ?? [];
      return reports.map((r: Report) => ({
        ...r,
        generatedAt: new Date(r.generatedAt),
        data: r.data,
      }));
    } catch (error) {
      return [];
    }
  }
}
