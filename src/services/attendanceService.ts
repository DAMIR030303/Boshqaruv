import type { ApiResponse, Attendance } from '../types';
import { logger } from '../utils/logger';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';

/**
 * Davomat servisi - Davomat boshqaruvi
 */
export class AttendanceService {
  /**
   * Barcha davomat yozuvlarini olish
   */
  static async getAttendanceRecords(
    employeeId?: string,
    date?: Date
  ): Promise<ApiResponse<Attendance[]>> {
    try {
      if (isSupabaseConfigured()) {
        let query = supabase
          .from('attendance')
          .select('*')
          .order('check_in', { ascending: false });

        if (employeeId) {
          query = query.eq('employee_id', employeeId);
        }

        if (date) {
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);

          query = query
            .gte('check_in', startOfDay.toISOString())
            .lte('check_in', endOfDay.toISOString());
        }

        const { data, error } = await query;

        if (error) {
          return {
            success: false,
            error: `Davomat yozuvlarini olishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: (data || []).map(this.mapToAttendance),
        };
      }

      // Mock data
      return {
        success: true,
        data: this.getMockAttendance(employeeId, date),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Davomat yozuvlarini olishda xatolik yuz berdi',
      };
    }
  }

  /**
   * Check-in qilish
   */
  static async checkIn(
    employeeId: string,
    location?: string
  ): Promise<ApiResponse<Attendance>> {
    try {
      const now = new Date();
      const checkInTime = new Date(now);
      checkInTime.setHours(9, 0, 0, 0); // Expected check-in time: 9:00 AM

      const isLate = now > checkInTime;
      const status: Attendance['status'] = isLate ? 'late' : 'present';

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('attendance')
          .insert({
            employee_id: employeeId,
            check_in: now.toISOString(),
            status,
            location: location || null,
          })
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: `Check-in qilishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: this.mapToAttendance(data),
        };
      }

      // Mock data
      const attendance: Attendance = {
        id: `att-${Date.now()}`,
        employeeId,
        checkIn: now,
        status,
        location,
      };

      return {
        success: true,
        data: attendance,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Check-in qilishda xatolik yuz berdi',
      };
    }
  }

  /**
   * Check-out qilish
   */
  static async checkOut(
    attendanceId: string
  ): Promise<ApiResponse<Attendance>> {
    try {
      const now = new Date();

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('attendance')
          .update({
            check_out: now.toISOString(),
          })
          .eq('id', attendanceId)
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: `Check-out qilishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: this.mapToAttendance(data),
        };
      }

      // Mock data
      const mockAttendance = this.getMockAttendance()[0];
      const updatedAttendance: Attendance = {
        ...mockAttendance,
        id: attendanceId,
        checkOut: now,
      };

      return {
        success: true,
        data: updatedAttendance,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Check-out qilishda xatolik yuz berdi',
      };
    }
  }

  /**
   * Supabase ma'lumotlarini Attendance type'ga o'tkazish
   */
  private static mapToAttendance(data: Record<string, unknown>): Attendance {
    return {
      id: String(data.id),
      employeeId: String(data.employee_id),
      checkIn: data.check_in ? new Date(String(data.check_in)) : new Date(),
      checkOut: data.check_out ? new Date(String(data.check_out)) : undefined,
      status: (data.status as Attendance['status']) || 'present',
      location: data.location ? String(data.location) : undefined,
      notes: data.notes ? String(data.notes) : undefined,
    };
  }

  /**
   * Mock davomat ma'lumotlari (development uchun)
   */
  private static getMockAttendance(
    employeeId?: string,
    date?: Date
  ): Attendance[] {
    const today = date || new Date();
    const records: Attendance[] = [
      {
        id: 'att-1',
        employeeId: 'emp-1',
        checkIn: new Date(today.setHours(8, 45, 0, 0)),
        checkOut: new Date(today.setHours(18, 0, 0, 0)),
        status: 'present',
        location: 'Toshkent, Ofis',
      },
      {
        id: 'att-2',
        employeeId: 'emp-2',
        checkIn: new Date(today.setHours(9, 15, 0, 0)),
        checkOut: new Date(today.setHours(17, 30, 0, 0)),
        status: 'late',
        location: 'Toshkent, Ofis',
      },
      {
        id: 'att-3',
        employeeId: 'emp-3',
        checkIn: new Date(today.setHours(9, 0, 0, 0)),
        status: 'present',
        location: 'Toshkent, Ofis',
      },
    ];

    if (employeeId) {
      return records.filter(a => a.employeeId === employeeId);
    }

    return records;
  }

  /**
   * Davomat yozuvlarini real-time kuzatish
   *
   * @param employeeId - Xodim ID (ixtiyoriy)
   * @param callbacks - Event handler'lar
   * @returns Cleanup funksiyasi (subscription'ni to'xtatish uchun)
   */
  static subscribeToAttendance(
    employeeId?: string,
    callbacks?: {
      onInsert?: (attendance: Attendance) => void;
      onUpdate?: (attendance: Attendance) => void;
      onDelete?: (attendance: Attendance) => void;
    }
  ): () => void {
    if (!isSupabaseConfigured()) {
      return () => {};
    }

    try {
      const channelName = `attendance${employeeId ? `:${employeeId}` : ''}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'attendance',
            filter: employeeId ? `user_id=eq.${employeeId}` : undefined,
          },
          payload => {
            const eventType = payload.eventType;
            const attendance = this.mapToAttendance(
              (payload.new as Record<string, unknown>) ||
                (payload.old as Record<string, unknown>)
            );

            if (eventType === 'INSERT' && payload.new) {
              callbacks?.onInsert?.(attendance);
            } else if (eventType === 'UPDATE' && payload.new) {
              callbacks?.onUpdate?.(attendance);
            } else if (eventType === 'DELETE' && payload.old) {
              callbacks?.onDelete?.(attendance);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      logger.error(
        'Davomatni real-time kuzatishda xatolik',
        error instanceof Error ? error : new Error(String(error))
      );
      return () => {};
    }
  }
}
