import type { ApiResponse } from '../types';

import { EmployeeService } from './employeeService';
import { ReportService } from './reportService';
import { TaskService } from './taskService';

/**
 * Qidiruv natijalari
 */
export interface SearchResult {
  type: 'task' | 'employee' | 'report';
  id: string;
  title: string;
  description?: string;
  url: string;
}

/**
 * Qidiruv servisi - Vazifalar, xodimlar va hisobotlar bo'yicha qidiruv
 */
export class SearchService {
  private static cache: Map<
    string,
    { data: SearchResult[]; timestamp: number }
  > = new Map();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 daqiqa

  /**
   * Umumiy qidiruv - barcha resurslarni qidiradi
   */
  static async search(query: string): Promise<ApiResponse<SearchResult[]>> {
    try {
      if (!query || query.trim().length < 2) {
        return {
          success: false,
          error: "Qidiruv so'rovi kamida 2 belgi bo'lishi kerak",
        };
      }

      const trimmedQuery = query.trim().toLowerCase();

      // Cache tekshirish
      const cacheKey = `search_${trimmedQuery}`;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return {
          success: true,
          data: cached.data,
        };
      }

      const results: SearchResult[] = [];

      // Parallel qidiruv - barcha resurslarni bir vaqtda qidiramiz
      const [tasksResult, employeesResult, reportsResult] = await Promise.all([
        this.searchTasks(trimmedQuery),
        this.searchEmployees(trimmedQuery),
        this.searchReports(trimmedQuery),
      ]);

      if (tasksResult.success && tasksResult.data) {
        results.push(...tasksResult.data);
      }

      if (employeesResult.success && employeesResult.data) {
        results.push(...employeesResult.data);
      }

      if (reportsResult.success && reportsResult.data) {
        results.push(...reportsResult.data);
      }

      // Natijalarni prioritet bo'yicha tartiblash
      const sortedResults = this.sortResults(results, trimmedQuery);

      // Cache'ga saqlash
      this.cache.set(cacheKey, {
        data: sortedResults.slice(0, 20),
        timestamp: Date.now(),
      });

      return {
        success: true,
        data: sortedResults.slice(0, 20), // Maksimal 20 natija
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Qidiruvda xatolik yuz berdi',
      };
    }
  }

  /**
   * Natijalarni prioritet bo'yicha tartiblash
   */
  private static sortResults(
    results: SearchResult[],
    query: string
  ): SearchResult[] {
    return results.sort((a, b) => {
      // Title'da to'g'ridan-to'g'ri mos kelish - yuqori prioritet
      const aTitleMatch = a.title.toLowerCase().includes(query);
      const bTitleMatch = b.title.toLowerCase().includes(query);

      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;

      // Type bo'yicha tartiblash: tasks > employees > reports
      const typePriority = { task: 0, employee: 1, report: 2 };
      const aPriority = typePriority[a.type];
      const bPriority = typePriority[b.type];

      return aPriority - bPriority;
    });
  }

  /**
   * Vazifalar bo'yicha qidiruv
   */
  static async searchTasks(
    query: string
  ): Promise<ApiResponse<SearchResult[]>> {
    try {
      // TaskService orqali real ma'lumotlarni olish
      const tasksResponse = await TaskService.getTasks();

      if (!tasksResponse.success || !tasksResponse.data) {
        return {
          success: true,
          data: [],
        };
      }

      const tasks = tasksResponse.data;

      const results: SearchResult[] = tasks
        .filter(
          task =>
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query) ||
            task.assignee.toLowerCase().includes(query) ||
            task.status.toLowerCase().includes(query) ||
            task.priority.toLowerCase().includes(query)
        )
        .map(task => ({
          type: 'task' as const,
          id: task.id,
          title: task.title,
          description: `${task.description || ''} • ${task.assignee} • ${task.status === 'completed' ? 'Bajarilgan' : task.status === 'in-progress' ? 'Jarayonda' : 'Kutilmoqda'}`,
          url: `/tasks/${task.id}`,
        }));

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Vazifalarni qidirishda xatolik',
      };
    }
  }

  /**
   * Xodimlar bo'yicha qidiruv
   */
  static async searchEmployees(
    query: string
  ): Promise<ApiResponse<SearchResult[]>> {
    try {
      // EmployeeService orqali real ma'lumotlarni olish
      const employeesResponse = await EmployeeService.getEmployees();

      if (!employeesResponse.success || !employeesResponse.data) {
        return {
          success: true,
          data: [],
        };
      }

      const employees = employeesResponse.data;

      const results: SearchResult[] = employees
        .filter(
          employee =>
            employee.name.toLowerCase().includes(query) ||
            employee.position.toLowerCase().includes(query) ||
            employee.email.toLowerCase().includes(query) ||
            employee.department.toLowerCase().includes(query) ||
            employee.phone.includes(query)
        )
        .map(employee => ({
          type: 'employee' as const,
          id: employee.id,
          title: employee.name,
          description: `${employee.position} • ${employee.department} • ${employee.email}`,
          url: `/employees/${employee.id}`,
        }));

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Xodimlarni qidirishda xatolik',
      };
    }
  }

  /**
   * Hisobotlar bo'yicha qidiruv
   */
  static async searchReports(
    query: string
  ): Promise<ApiResponse<SearchResult[]>> {
    try {
      // ReportService orqali saqlangan hisobotlarni olish
      const reports = await ReportService.getSavedReports();

      const results: SearchResult[] = reports
        .filter(
          report =>
            report.title.toLowerCase().includes(query) ||
            report.type.toLowerCase().includes(query) ||
            report.period.toLowerCase().includes(query)
        )
        .map(report => ({
          type: 'report' as const,
          id: report.id,
          title: report.title,
          description: `${report.type === 'attendance' ? 'Davomat' : report.type === 'performance' ? 'Ish faoliyati' : report.type === 'marketing' ? 'Marketing' : 'Hisobot'} • ${report.period === 'daily' ? 'Kunlik' : report.period === 'weekly' ? 'Haftalik' : 'Oylik'}`,
          url: `/reports/${report.id}`,
        }));

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Hisobotlarni qidirishda xatolik',
      };
    }
  }

  /**
   * Cache'ni tozalash
   */
  static clearCache(): void {
    this.cache.clear();
  }
}
