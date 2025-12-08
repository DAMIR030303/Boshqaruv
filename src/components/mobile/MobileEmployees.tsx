import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { Edit, Plus, Search, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

import { EmployeeService } from '../../services/employeeService';
import type { ApiResponse, Employee, KPIData, UserProfile } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { SkeletonList } from '../ui/SkeletonList';

import { EmployeeForm } from './forms/EmployeeForm';

interface MobileEmployeesProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
  onNavigate?: (tab: string) => void;
}

/**
 * Xodimlar boshqaruvi sahifasi
 *
 * Bu sahifa xodimlar ro'yxatini ko'rsatadi va
 * xodim qo'shish/tahrirlash/o'chirish funksiyalarini ta'minlaydi.
 */
export function MobileEmployees({ onDataUpdate }: MobileEmployeesProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Xodimlarni yuklash
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse<Employee[]> =
        await EmployeeService.getEmployees();
      if (response.success && response.data) {
        setEmployees(response.data);
      } else {
        toast.error(response.error || 'Xodimlarni yuklashda xatolik');
      }
    } catch (error) {
      toast.error('Xodimlarni yuklashda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  // Qidiruv va filtr
  const filteredEmployees = employees.filter(employee => {
    const query = searchQuery.toLowerCase();
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.position.toLowerCase().includes(query) ||
      employee.department.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query)
    );
  });

  // Xodimni o'chirish
  const handleDelete = async (id: string) => {
    if (!confirm("Bu xodimni o'chirishni tasdiqlaysizmi?")) {
      return;
    }

    try {
      const response = await EmployeeService.deleteEmployee(id);
      if (response.success) {
        toast.success("Xodim muvaffaqiyatli o'chirildi");
        loadEmployees();
        onDataUpdate({ type: 'employee_deleted', id });
      } else {
        toast.error(response.error || "Xodimni o'chirishda xatolik");
      }
    } catch (error) {
      toast.error("Xodimni o'chirishda xatolik yuz berdi");
    }
  };

  const handleEmployeeSubmit = (employee: Employee) => {
    loadEmployees();
    onDataUpdate({
      type: editingEmployee ? 'employee_updated' : 'employee_created',
      id: employee.id,
    });
    setShowAddModal(false);
    setEditingEmployee(null);
  };

  if (isLoading) {
    return (
      <div className="mobile-content">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="w-24 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <SkeletonList count={5} showAvatar />
      </div>
    );
  }

  return (
    <div className="mobile-content">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Xodimlar
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Jami: {employees.length} xodim
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Qo'shish</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Xodimlarni qidirish..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Employees List */}
      {filteredEmployees.length === 0 ? (
        <EmptyState
          variant={searchQuery ? 'search' : 'employees'}
          title={searchQuery ? 'Xodim topilmadi' : undefined}
          description={
            searchQuery
              ? "Qidiruv so'roviga mos xodim topilmadi. Boshqa kalit so'zlar bilan qayta urinib ko'ring."
              : undefined
          }
          onAction={searchQuery ? undefined : () => setShowAddModal(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card padding="md" hoverable>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium">
                        {employee.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {employee.position}
                      </p>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <Badge variant="secondary">{employee.department}</Badge>
                        <Badge
                          variant={
                            employee.status === 'online'
                              ? 'success'
                              : 'secondary'
                          }
                        >
                          {employee.status === 'online' ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <p>{employee.email}</p>
                        <p>{employee.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingEmployee(employee)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      aria-label="Tahrirlash"
                    >
                      <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      aria-label="O'chirish"
                    >
                      <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Employee Form Modal */}
      <EmployeeForm
        employee={editingEmployee || undefined}
        onSubmit={handleEmployeeSubmit}
        onClose={() => {
          setShowAddModal(false);
          setEditingEmployee(null);
        }}
        isOpen={showAddModal || !!editingEmployee}
      />
    </div>
  );
}
