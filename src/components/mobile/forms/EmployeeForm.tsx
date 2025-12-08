import { useEffect, useState } from 'react';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { EmployeeService } from '../../../services/employeeService';
import type { ApiResponse, Employee } from '../../../types';
import { logger } from '../../../utils/logger';
import { FormSchemas } from '../../../utils/validation';
import { Form, type FormFieldProps } from '../../ui/Form';

/**
 * Employee form data type
 */
type EmployeeFormData = z.infer<typeof FormSchemas.employee>;

/**
 * EmployeeForm props
 */
interface EmployeeFormProps {
  /** Employee to edit (if editing) */
  employee?: Employee;
  /** Form submit handler */
  onSubmit: (employee: Employee) => void;
  /** Form close handler */
  onClose: () => void;
  /** Is form open */
  isOpen: boolean;
}

/**
 * Employee Form komponenti - Xodim qo'shish/tahrirlash formasi
 *
 * Bu komponent xodim qo'shish va tahrirlash uchun to'liq formani ta'minlaydi.
 */
export function EmployeeForm({
  employee,
  onSubmit,
  onClose,
  isOpen,
}: EmployeeFormProps) {
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Mobile detection - md breakpoint (768px) dan kichik ekranlar uchun to'liq sahifa
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ESC tugmasi bilan yopish
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape, { capture: true });
      return () =>
        document.removeEventListener('keydown', handleEscape, {
          capture: true,
        });
    }
  }, [isOpen, onClose]);

  // Form fields
  const fields: FormFieldProps<EmployeeFormData>[] = [
    {
      name: 'name',
      label: "To'liq ism",
      type: 'text',
      placeholder: 'Masalan: Alisher Fayzullayev',
      required: true,
    },
    {
      name: 'position',
      label: 'Lavozim',
      type: 'text',
      placeholder: 'Masalan: Administrator',
      required: true,
    },
    {
      name: 'department',
      label: "Bo'lim",
      type: 'text',
      placeholder: 'Masalan: Boshqaruv',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Masalan: user@boshqaruv.uz',
      required: true,
    },
    {
      name: 'phone',
      label: 'Telefon raqami',
      type: 'tel',
      placeholder: '+998901234567',
      required: true,
      description: 'Format: +998XXXXXXXXX',
    },
    {
      name: 'startDate',
      label: 'Ishga kirgan sana',
      type: 'date',
      required: true,
    },
    {
      name: 'salary',
      label: 'Maosh (ixtiyoriy)',
      type: 'number',
      placeholder: 'Masalan: 5000000',
      required: false,
    },
  ];

  // Default values
  const defaultValues: Partial<EmployeeFormData> = employee
    ? {
        name: employee.name,
        position: employee.position,
        department: employee.department,
        email: employee.email,
        phone: employee.phone,
        startDate: new Date(), // Employee type'da startDate yo'q, shuning uchun default
        salary: undefined,
      }
    : {
        startDate: new Date(),
      };

  // Form submit handler
  const handleSubmit = async (data: EmployeeFormData) => {
    try {
      let response: ApiResponse<Employee>;

      if (employee) {
        // Update existing employee
        response = await EmployeeService.updateEmployee(employee.id, {
          name: data.name,
          position: data.position,
          department: data.department,
          email: data.email,
          phone: data.phone,
          avatar: employee.avatar, // Keep existing avatar
          status: employee.status, // Keep existing status
        });
      } else {
        // Create new employee
        response = await EmployeeService.createEmployee({
          name: data.name,
          position: data.position,
          department: data.department,
          email: data.email,
          phone: data.phone,
          avatar: '/api/placeholder/40/40', // Default avatar
          status: 'offline', // Default status
        });
      }

      if (response.success && response.data) {
        toast.success(
          employee
            ? 'Xodim muvaffaqiyatli yangilandi'
            : "Xodim muvaffaqiyatli qo'shildi"
        );
        onSubmit(response.data);
        onClose();
      } else {
        toast.error(response.error || 'Xodimni saqlashda xatolik');
      }
    } catch (error) {
      toast.error('Xodimni saqlashda xatolik yuz berdi');
      logger.error(
        'Employee form submit error',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            data-testid="employee-modal-backdrop"
          />

          {/* Modal */}
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : isMobile
                  ? { opacity: 0, y: '100%' }
                  : { opacity: 0, scale: 0.95, y: 20 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : isMobile
                  ? { opacity: 1, y: 0 }
                  : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : isMobile
                  ? { opacity: 0, y: '100%' }
                  : { opacity: 0, scale: 0.95, y: 20 }
            }
            transition={{
              duration: prefersReducedMotion ? 0.1 : 0.3,
              ease: 'easeOut',
            }}
            className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:transform md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-auto md:max-w-2xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto overscroll-contain scroll-smooth bg-white dark:bg-gray-800 rounded-none md:rounded-2xl shadow-2xl md:shadow-[0_20px_50px_rgba(0,0,0,0.15)] md:ring-1 md:ring-gray-900/5 dark:md:ring-white/10 z-[70] md:m-4"
            data-testid="employee-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-modal-title"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 px-4 md:px-6 py-4 md:py-5 flex items-center justify-between z-10 shadow-sm">
              <h2
                id="employee-modal-title"
                className="text-lg md:text-xl lg:text-2xl font-bold text-white"
              >
                {employee ? 'Xodimni tahrirlash' : "Yangi xodim qo'shish"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Yopish"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Form */}
            <div className="p-4 md:p-6 lg:p-8">
              <Form
                schema={FormSchemas.employee}
                onSubmit={handleSubmit}
                fields={fields}
                defaultValues={defaultValues}
                submitLabel={employee ? 'Yangilash' : "Qo'shish"}
                showCancel={true}
                onCancel={onClose}
                title={undefined}
                description={undefined}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
