import { describe, expect, it, beforeEach, vi } from 'vitest';

import { EmployeeService } from '../employeeService';

// Mock Supabase
vi.mock('../../utils/supabaseClient', () => ({
  isSupabaseConfigured: vi.fn(() => false),
  supabase: {
    from: vi.fn(),
  },
}));

describe('EmployeeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEmployees', () => {
    it('returns all employees', async () => {
      const result = await EmployeeService.getEmployees();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data?.length).toBeGreaterThan(0);
    });

    it('returns employees with all required fields', async () => {
      const result = await EmployeeService.getEmployees();

      expect(result.success).toBe(true);
      if (result.data && result.data.length > 0) {
        const employee = result.data[0];
        expect(employee.id).toBeDefined();
        expect(employee.name).toBeDefined();
        expect(employee.position).toBeDefined();
        expect(employee.status).toBeDefined();
      }
    });
  });

  describe('getEmployeeById', () => {
    it('returns employee when found', async () => {
      const result = await EmployeeService.getEmployeeById('emp-1');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe('emp-1');
      expect(result.data?.name).toBe('Alisher Fayzullayev');
    });

    it('returns error when employee not found', async () => {
      const result = await EmployeeService.getEmployeeById('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });
  });

  describe('createEmployee', () => {
    it('creates a new employee successfully', async () => {
      const newEmployee = {
        name: 'New Employee',
        position: 'Developer',
        avatar: '/avatar.jpg',
        status: 'online' as const,
        department: 'IT',
        email: 'new@example.com',
        phone: '+998901234571',
      };

      const result = await EmployeeService.createEmployee(newEmployee);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe(newEmployee.name);
      expect(result.data?.position).toBe(newEmployee.position);
      expect(result.data?.id).toBeDefined();
    });

    it('creates employee with all required fields', async () => {
      const newEmployee = {
        name: 'John Doe',
        position: 'Manager',
        avatar: '/avatar.jpg',
        status: 'offline' as const,
        department: 'Sales',
        email: 'john@example.com',
        phone: '+998901234572',
      };

      const result = await EmployeeService.createEmployee(newEmployee);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe(newEmployee.name);
      expect(result.data?.position).toBe(newEmployee.position);
      expect(result.data?.status).toBe(newEmployee.status);
      expect(result.data?.department).toBe(newEmployee.department);
      expect(result.data?.email).toBe(newEmployee.email);
      expect(result.data?.phone).toBe(newEmployee.phone);
    });
  });

  describe('updateEmployee', () => {
    it('updates employee successfully', async () => {
      const updates = {
        name: 'Updated Name',
        position: 'Senior Developer',
      };

      const result = await EmployeeService.updateEmployee('emp-1', updates);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe(updates.name);
      expect(result.data?.position).toBe(updates.position);
    });

    it('returns error when employee not found', async () => {
      const updates = { name: 'Updated Name' };

      const result = await EmployeeService.updateEmployee(
        'non-existent-id',
        updates
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('updates multiple fields', async () => {
      const updates = {
        name: 'New Name',
        email: 'newemail@example.com',
        phone: '+998901234573',
        status: 'offline' as const,
      };

      const result = await EmployeeService.updateEmployee('emp-1', updates);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe(updates.name);
      expect(result.data?.email).toBe(updates.email);
      expect(result.data?.phone).toBe(updates.phone);
      expect(result.data?.status).toBe(updates.status);
    });
  });

  describe('deleteEmployee', () => {
    it('deletes employee successfully', async () => {
      const result = await EmployeeService.deleteEmployee('emp-1');

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('handles deletion of non-existent employee', async () => {
      const result = await EmployeeService.deleteEmployee('non-existent-id');

      expect(result.success).toBe(true);
    });
  });

  describe('mapToEmployee', () => {
    it('correctly maps Supabase data to Employee type', () => {
      const supabaseData = {
        id: 'test-id',
        name: 'Test Employee',
        position: 'Test Position',
        avatar: '/test-avatar.jpg',
        status: 'online',
        department: 'Test Department',
        email: 'test@example.com',
        phone: '+998901234574',
      };

      // Access private method via type assertion for testing
      const mapped = (
        EmployeeService as unknown as {
          mapToEmployee: (data: Record<string, unknown>) => unknown;
        }
      ).mapToEmployee(supabaseData);

      expect(mapped).toMatchObject({
        id: 'test-id',
        name: 'Test Employee',
        position: 'Test Position',
        avatar: '/test-avatar.jpg',
        status: 'online',
        department: 'Test Department',
        email: 'test@example.com',
        phone: '+998901234574',
      });
    });

    it('handles missing optional fields', () => {
      const supabaseData = {
        id: 'test-id',
        name: 'Test Employee',
        position: 'Test Position',
        status: 'offline',
      };

      const mapped = (
        EmployeeService as unknown as {
          mapToEmployee: (data: Record<string, unknown>) => unknown;
        }
      ).mapToEmployee(supabaseData);

      expect(mapped).toMatchObject({
        id: 'test-id',
        name: 'Test Employee',
        position: 'Test Position',
        status: 'offline',
        avatar: '/api/placeholder/40/40', // Default avatar
        department: '',
        email: '',
        phone: '',
      });
    });
  });
});
