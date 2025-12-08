import type { ApiResponse, Shift } from '../types';
import { logger } from '../utils/logger';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';

/**
 * Smenalar servisi - Smenalar boshqaruvi
 */
export class ShiftService {
  /**
   * Barcha smenalarni olish
   */
  static async getShifts(
    employeeId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ApiResponse<Shift[]>> {
    try {
      if (isSupabaseConfigured()) {
        let query = supabase
          .from('shifts')
          .select('*')
          .order('start_time', { ascending: true });

        if (employeeId) {
          query = query.eq('employee_id', employeeId);
        }

        if (startDate) {
          query = query.gte('start_time', startDate.toISOString());
        }

        if (endDate) {
          query = query.lte('end_time', endDate.toISOString());
        }

        const { data, error } = await query;

        if (error) {
          return {
            success: false,
            error: `Smenalarni olishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: (data || []).map(this.mapToShift),
        };
      }

      // Mock data
      return {
        success: true,
        data: this.getMockShifts(employeeId, startDate, endDate),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Smenalarni olishda xatolik yuz berdi',
      };
    }
  }

  /**
   * Yangi smena yaratish
   */
  static async createShift(
    shift: Omit<Shift, 'id'>
  ): Promise<ApiResponse<Shift>> {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('shifts')
          .insert({
            employee_id: shift.employeeId,
            start_time: shift.startTime.toISOString(),
            end_time: shift.endTime.toISOString(),
            status: shift.status,
            type: shift.type,
          })
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: `Smena yaratishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: this.mapToShift(data),
        };
      }

      // Mock data
      const newShift: Shift = {
        id: `shift-${Date.now()}`,
        ...shift,
      };

      return {
        success: true,
        data: newShift,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Smena yaratishda xatolik yuz berdi',
      };
    }
  }

  /**
   * Smenani yangilash
   */
  static async updateShift(
    id: string,
    updates: Partial<Shift>
  ): Promise<ApiResponse<Shift>> {
    try {
      if (isSupabaseConfigured()) {
        const updateData: Record<string, unknown> = {};

        if (updates.employeeId) updateData.employee_id = updates.employeeId;
        if (updates.startTime)
          updateData.start_time = updates.startTime.toISOString();
        if (updates.endTime)
          updateData.end_time = updates.endTime.toISOString();
        if (updates.status) updateData.status = updates.status;
        if (updates.type) updateData.type = updates.type;

        const { data, error } = await supabase
          .from('shifts')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: `Smenani yangilashda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: this.mapToShift(data),
        };
      }

      // Mock data
      const mockShifts = this.getMockShifts();
      const shiftIndex = mockShifts.findIndex(s => s.id === id);

      if (shiftIndex === -1) {
        return {
          success: false,
          error: 'Smena topilmadi',
        };
      }

      const updatedShift = {
        ...mockShifts[shiftIndex],
        ...updates,
      };

      return {
        success: true,
        data: updatedShift,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Smenani yangilashda xatolik yuz berdi',
      };
    }
  }

  /**
   * Smenani o'chirish
   */
  static async deleteShift(id: string): Promise<ApiResponse<void>> {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('shifts').delete().eq('id', id);

        if (error) {
          return {
            success: false,
            error: `Smenani o'chirishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Smenani o'chirishda xatolik yuz berdi",
      };
    }
  }

  /**
   * Supabase ma'lumotlarini Shift type'ga o'tkazish
   */
  private static mapToShift(data: Record<string, unknown>): Shift {
    return {
      id: String(data.id),
      employeeId: String(data.employee_id),
      startTime: data.start_time
        ? new Date(String(data.start_time))
        : new Date(),
      endTime: data.end_time ? new Date(String(data.end_time)) : new Date(),
      status: (data.status as Shift['status']) || 'scheduled',
      type: (data.type as Shift['type']) || 'morning',
    };
  }

  /**
   * Mock smenalar ma'lumotlari (development uchun)
   */
  private static getMockShifts(
    employeeId?: string,
    startDate?: Date,
    _endDate?: Date
  ): Shift[] {
    const today = startDate || new Date();
    const shifts: Shift[] = [
      {
        id: 'shift-1',
        employeeId: 'emp-1',
        startTime: new Date(today.setHours(9, 0, 0, 0)),
        endTime: new Date(today.setHours(18, 0, 0, 0)),
        status: 'scheduled',
        type: 'morning',
      },
      {
        id: 'shift-2',
        employeeId: 'emp-2',
        startTime: new Date(today.setHours(14, 0, 0, 0)),
        endTime: new Date(today.setHours(22, 0, 0, 0)),
        status: 'active',
        type: 'afternoon',
      },
      {
        id: 'shift-3',
        employeeId: 'emp-3',
        startTime: new Date(today.setHours(22, 0, 0, 0)),
        endTime: new Date(today.setHours(6, 0, 0, 0)),
        status: 'scheduled',
        type: 'night',
      },
    ];

    if (employeeId) {
      return shifts.filter(s => s.employeeId === employeeId);
    }

    return shifts;
  }

  /**
   * Smenalarni real-time kuzatish
   *
   * @param employeeId - Xodim ID (ixtiyoriy)
   * @param callbacks - Event handler'lar
   * @returns Cleanup funksiyasi (subscription'ni to'xtatish uchun)
   */
  static subscribeToShifts(
    employeeId?: string,
    callbacks?: {
      onInsert?: (shift: Shift) => void;
      onUpdate?: (shift: Shift) => void;
      onDelete?: (shift: Shift) => void;
    }
  ): () => void {
    if (!isSupabaseConfigured()) {
      return () => {};
    }

    try {
      const channelName = `shifts${employeeId ? `:${employeeId}` : ''}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'shifts',
            filter: employeeId ? `employee_id=eq.${employeeId}` : undefined,
          },
          payload => {
            const eventType = payload.eventType;
            const shift = this.mapToShift(
              (payload.new as Record<string, unknown>) ||
                (payload.old as Record<string, unknown>)
            );

            if (eventType === 'INSERT' && payload.new) {
              callbacks?.onInsert?.(shift);
            } else if (eventType === 'UPDATE' && payload.new) {
              callbacks?.onUpdate?.(shift);
            } else if (eventType === 'DELETE' && payload.old) {
              callbacks?.onDelete?.(shift);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      logger.error(
        'Smenalarni real-time kuzatishda xatolik',
        error instanceof Error ? error : new Error(String(error))
      );
      return () => {};
    }
  }
}
