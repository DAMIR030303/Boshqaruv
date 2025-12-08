import type { ApiResponse, Employee } from '../types';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';

/**
 * Xodimlar servisi - Xodimlar boshqaruvi
 */
export class EmployeeService {
  /**
   * Barcha xodimlarni olish
   */
  static async getEmployees(): Promise<ApiResponse<Employee[]>> {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          return {
            success: false,
            error: `Xodimlarni olishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: (data || []).map(this.mapToEmployee),
        };
      }

      // Mock data for development
      return {
        success: true,
        data: this.getMockEmployees(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Xodimlarni olishda xatolik yuz berdi',
      };
    }
  }

  /**
   * Xodimni ID bo'yicha olish
   */
  static async getEmployeeById(id: string): Promise<ApiResponse<Employee>> {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          return {
            success: false,
            error: `Xodimni olishda xatolik: ${error.message}`,
          };
        }

        if (!data) {
          return {
            success: false,
            error: 'Xodim topilmadi',
          };
        }

        return {
          success: true,
          data: this.mapToEmployee(data),
        };
      }

      // Mock data
      const mockEmployees = this.getMockEmployees();
      const employee = mockEmployees.find(e => e.id === id);

      if (!employee) {
        return {
          success: false,
          error: 'Xodim topilmadi',
        };
      }

      return {
        success: true,
        data: employee,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Xodimni olishda xatolik yuz berdi',
      };
    }
  }

  /**
   * Yangi xodim qo'shish
   */
  static async createEmployee(
    employee: Omit<Employee, 'id'>
  ): Promise<ApiResponse<Employee>> {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('employees')
          .insert({
            name: employee.name,
            position: employee.position,
            avatar: employee.avatar,
            status: employee.status,
            department: employee.department,
            email: employee.email,
            phone: employee.phone,
          })
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: `Xodim qo'shishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: this.mapToEmployee(data),
        };
      }

      // Mock data
      const newEmployee: Employee = {
        id: `emp-${Date.now()}`,
        ...employee,
      };

      return {
        success: true,
        data: newEmployee,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Xodim qo'shishda xatolik yuz berdi",
      };
    }
  }

  /**
   * Xodimni yangilash
   */
  static async updateEmployee(
    id: string,
    updates: Partial<Employee>
  ): Promise<ApiResponse<Employee>> {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('employees')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: `Xodimni yangilashda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: this.mapToEmployee(data),
        };
      }

      // Mock data
      const mockEmployees = this.getMockEmployees();
      const employeeIndex = mockEmployees.findIndex(e => e.id === id);

      if (employeeIndex === -1) {
        return {
          success: false,
          error: 'Xodim topilmadi',
        };
      }

      const updatedEmployee = {
        ...mockEmployees[employeeIndex],
        ...updates,
      };

      return {
        success: true,
        data: updatedEmployee,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Xodimni yangilashda xatolik yuz berdi',
      };
    }
  }

  /**
   * Xodimni o'chirish
   */
  static async deleteEmployee(id: string): Promise<ApiResponse<void>> {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', id);

        if (error) {
          return {
            success: false,
            error: `Xodimni o'chirishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
        };
      }

      // Mock - always succeed
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Xodimni o'chirishda xatolik yuz berdi",
      };
    }
  }

  /**
   * Supabase ma'lumotlarini Employee type'ga o'tkazish
   */
  private static mapToEmployee(data: Record<string, unknown>): Employee {
    return {
      id: String(data.id),
      name: String(data.name),
      position: String(data.position),
      avatar: String(data.avatar || '/api/placeholder/40/40'),
      status: (data.status as Employee['status']) || 'offline',
      department: String(data.department || ''),
      email: String(data.email || ''),
      phone: String(data.phone || ''),
    };
  }

  /**
   * Mock xodimlar ma'lumotlari (development uchun)
   */
  private static getMockEmployees(): Employee[] {
    return [
      {
        id: 'emp-1',
        name: 'Alisher Fayzullayev',
        position: 'Administrator',
        avatar: '/api/placeholder/40/40',
        status: 'online',
        department: 'Boshqaruv',
        email: 'admin@boshqaruv.uz',
        phone: '+998901234567',
      },
      {
        id: 'emp-2',
        name: 'Nargiza Karimova',
        position: 'Manager',
        avatar: '/api/placeholder/40/40',
        status: 'online',
        department: 'Boshqaruv',
        email: 'manager@boshqaruv.uz',
        phone: '+998901234568',
      },
      {
        id: 'emp-3',
        name: 'Javohir Tursunov',
        position: 'Xodim',
        avatar: '/api/placeholder/40/40',
        status: 'online',
        department: 'Ishlab chiqarish',
        email: 'user@boshqaruv.uz',
        phone: '+998901234569',
      },
      {
        id: 'emp-4',
        name: "Shaxriddin Adizov Sherali o'g'li",
        position: 'Marketing boshqaruvchisi',
        avatar: '/api/placeholder/40/40',
        status: 'online',
        department: 'Marketing',
        email: 'marketing@boshqaruv.uz',
        phone: '+998901234570',
      },
    ];
  }
}
