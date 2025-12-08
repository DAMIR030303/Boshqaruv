import type { ApiResponse, Penalty } from '../types';
import { logger } from '../utils/logger';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';

/**
 * Jarimalar servisi - Jarimalar boshqaruvi
 */
export class PenaltyService {
  /**
   * Barcha jarimalarni olish
   */
  static async getPenalties(
    employeeId?: string,
    status?: Penalty['status']
  ): Promise<ApiResponse<Penalty[]>> {
    try {
      if (isSupabaseConfigured()) {
        let query = supabase
          .from('penalties')
          .select('*')
          .order('created_at', { ascending: false });

        if (employeeId) {
          query = query.eq('employee_id', employeeId);
        }

        if (status) {
          query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
          return {
            success: false,
            error: `Jarimalarni olishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: (data || []).map(this.mapToPenalty),
        };
      }

      // Mock data
      return {
        success: true,
        data: this.getMockPenalties(employeeId, status),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Jarimalarni olishda xatolik yuz berdi',
      };
    }
  }

  /**
   * Yangi jarima yaratish
   */
  static async createPenalty(
    penalty: Omit<Penalty, 'id' | 'createdAt'>
  ): Promise<ApiResponse<Penalty>> {
    try {
      const now = new Date();

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('penalties')
          .insert({
            employee_id: penalty.employeeId,
            type: penalty.type,
            amount: penalty.amount,
            reason: penalty.reason,
            status: penalty.status,
            created_at: now.toISOString(),
          })
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: `Jarima yaratishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: this.mapToPenalty(data),
        };
      }

      // Mock data
      const newPenalty: Penalty = {
        id: `penalty-${Date.now()}`,
        ...penalty,
        createdAt: now,
      };

      return {
        success: true,
        data: newPenalty,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Jarima yaratishda xatolik yuz berdi',
      };
    }
  }

  /**
   * Jarimani yangilash
   */
  static async updatePenalty(
    id: string,
    updates: Partial<Penalty>
  ): Promise<ApiResponse<Penalty>> {
    try {
      if (isSupabaseConfigured()) {
        const updateData: Record<string, unknown> = {};

        if (updates.employeeId) updateData.employee_id = updates.employeeId;
        if (updates.type) updateData.type = updates.type;
        if (updates.amount) updateData.amount = updates.amount;
        if (updates.reason) updateData.reason = updates.reason;
        if (updates.status) {
          updateData.status = updates.status;
          if (updates.status === 'resolved') {
            updateData.resolved_at = new Date().toISOString();
          }
        }

        const { data, error } = await supabase
          .from('penalties')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: `Jarimani yangilashda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: this.mapToPenalty(data),
        };
      }

      // Mock data
      const mockPenalties = this.getMockPenalties();
      const penaltyIndex = mockPenalties.findIndex(p => p.id === id);

      if (penaltyIndex === -1) {
        return {
          success: false,
          error: 'Jarima topilmadi',
        };
      }

      const updatedPenalty: Penalty = {
        ...mockPenalties[penaltyIndex],
        ...updates,
        resolvedAt:
          updates.status === 'resolved'
            ? new Date()
            : mockPenalties[penaltyIndex].resolvedAt,
      };

      return {
        success: true,
        data: updatedPenalty,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Jarimani yangilashda xatolik yuz berdi',
      };
    }
  }

  /**
   * Jarimani o'chirish
   */
  static async deletePenalty(id: string): Promise<ApiResponse<void>> {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('penalties')
          .delete()
          .eq('id', id);

        if (error) {
          return {
            success: false,
            error: `Jarimani o'chirishda xatolik: ${error.message}`,
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
            : "Jarimani o'chirishda xatolik yuz berdi",
      };
    }
  }

  /**
   * Supabase ma'lumotlarini Penalty type'ga o'tkazish
   */
  private static mapToPenalty(data: Record<string, unknown>): Penalty {
    return {
      id: String(data.id),
      employeeId: String(data.employee_id),
      type: String(data.type),
      amount: Number(data.amount) || 0,
      reason: String(data.reason || ''),
      status: (data.status as Penalty['status']) || 'active',
      createdAt: data.created_at
        ? new Date(String(data.created_at))
        : new Date(),
      resolvedAt: data.resolved_at
        ? new Date(String(data.resolved_at))
        : undefined,
    };
  }

  /**
   * Mock jarimalar ma'lumotlari (development uchun)
   */
  private static getMockPenalties(
    employeeId?: string,
    status?: Penalty['status']
  ): Penalty[] {
    const penalties: Penalty[] = [
      {
        id: 'penalty-1',
        employeeId: 'emp-2',
        type: 'Kechikish',
        amount: 50000,
        reason: 'Ishga kechikkan',
        status: 'active',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'penalty-2',
        employeeId: 'emp-3',
        type: 'Disiplina buzilishi',
        amount: 100000,
        reason: 'Ish tartibini buzgan',
        status: 'resolved',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        resolvedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
    ];

    let filtered = penalties;

    if (employeeId) {
      filtered = filtered.filter(p => p.employeeId === employeeId);
    }

    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }

    return filtered;
  }

  /**
   * Jarimalarni real-time kuzatish
   *
   * @param employeeId - Xodim ID (ixtiyoriy)
   * @param callbacks - Event handler'lar
   * @returns Cleanup funksiyasi (subscription'ni to'xtatish uchun)
   */
  static subscribeToPenalties(
    employeeId?: string,
    callbacks?: {
      onInsert?: (penalty: Penalty) => void;
      onUpdate?: (penalty: Penalty) => void;
      onDelete?: (penalty: Penalty) => void;
    }
  ): () => void {
    if (!isSupabaseConfigured()) {
      return () => {};
    }

    try {
      const channelName = `penalties${employeeId ? `:${employeeId}` : ''}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'penalties',
            filter: employeeId ? `employee_id=eq.${employeeId}` : undefined,
          },
          payload => {
            const eventType = payload.eventType;
            const penalty = this.mapToPenalty(
              (payload.new as Record<string, unknown>) ||
                (payload.old as Record<string, unknown>)
            );

            if (eventType === 'INSERT' && payload.new) {
              callbacks?.onInsert?.(penalty);
            } else if (eventType === 'UPDATE' && payload.new) {
              callbacks?.onUpdate?.(penalty);
            } else if (eventType === 'DELETE' && payload.old) {
              callbacks?.onDelete?.(penalty);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      logger.error(
        'Jarimalarni real-time kuzatishda xatolik',
        error instanceof Error ? error : new Error(String(error))
      );
      return () => {};
    }
  }
}
