import { useEffect, useState } from 'react';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { EmployeeService } from '../../../services/employeeService';
import { TaskService } from '../../../services/taskService';
import type { ApiResponse, Employee, Task } from '../../../types';
import { logger } from '../../../utils/logger';
import { FormSchemas } from '../../../utils/validation';
import { Form, type FormFieldProps } from '../../ui/Form';

/**
 * Task form data type
 */
type TaskFormData = z.infer<typeof FormSchemas.task>;

/**
 * TaskForm props
 */
interface TaskFormProps {
  /** Task to edit (if editing) */
  task?: Task;
  /** Form submit handler */
  onSubmit: (task: Task) => void;
  /** Form close handler */
  onClose: () => void;
  /** Is form open */
  isOpen: boolean;
}

/**
 * Task Form komponenti - Vazifa yaratish/tahrirlash formasi
 *
 * Bu komponent vazifa yaratish va tahrirlash uchun to'liq formani ta'minlaydi.
 */
export function TaskForm({ task, onSubmit, onClose, isOpen }: TaskFormProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
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

  // Xodimlarni yuklash
  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

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

  const loadEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const response: ApiResponse<Employee[]> =
        await EmployeeService.getEmployees();
      if (response.success && response.data) {
        setEmployees(response.data);
      }
    } catch (error) {
      logger.error(
        'Xodimlarni yuklashda xatolik',
        error instanceof Error ? error : new Error(String(error))
      );
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  // Form fields
  const fields: FormFieldProps<TaskFormData>[] = [
    {
      name: 'title',
      label: 'Vazifa nomi',
      type: 'text',
      placeholder: 'Masalan: Dashboard dizaynini yangilash',
      required: true,
    },
    {
      name: 'description',
      label: 'Tavsif',
      type: 'textarea',
      placeholder: "Vazifa haqida batafsil ma'lumot...",
      required: false,
    },
    {
      name: 'assignee',
      label: "Mas'ul shaxs",
      type: 'select',
      required: true,
      options: employees.map(emp => ({
        value: emp.name,
        label: `${emp.name} (${emp.position})`,
      })),
      disabled: isLoadingEmployees,
    },
    {
      name: 'priority',
      label: 'Prioritet',
      type: 'select',
      required: true,
      options: [
        { value: 'low', label: 'Past' },
        { value: 'medium', label: "O'rta" },
        { value: 'high', label: 'Yuqori' },
      ],
    },
    {
      name: 'status',
      label: 'Holat',
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'Kutilmoqda' },
        { value: 'in-progress', label: 'Jarayonda' },
        { value: 'completed', label: 'Bajarilgan' },
      ],
    },
    {
      name: 'dueDate',
      label: 'Muddati',
      type: 'date',
      required: true,
    },
  ];

  // Default values
  const defaultValues: Partial<TaskFormData> = task
    ? {
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
      }
    : {
        status: 'pending',
        priority: 'medium',
      };

  // Form submit handler
  const handleSubmit = async (data: TaskFormData) => {
    try {
      let response: ApiResponse<Task>;

      if (task) {
        // Update existing task
        response = await TaskService.updateTask(task.id, {
          title: data.title,
          description: data.description || '',
          assignee: data.assignee,
          priority: data.priority,
          status: data.status,
          dueDate: data.dueDate,
        });
      } else {
        // Create new task
        response = await TaskService.createTask({
          title: data.title,
          description: data.description || '',
          assignee: data.assignee,
          priority: data.priority,
          status: data.status,
          dueDate: data.dueDate,
        });
      }

      if (response.success && response.data) {
        toast.success(
          task
            ? 'Vazifa muvaffaqiyatli yangilandi'
            : 'Vazifa muvaffaqiyatli yaratildi'
        );
        onSubmit(response.data);
        onClose();
      } else {
        toast.error(response.error || 'Vazifani saqlashda xatolik');
      }
    } catch (error) {
      toast.error('Vazifani saqlashda xatolik yuz berdi');
      logger.error(
        'Task form submit error',
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
            data-testid="task-modal-backdrop"
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
            className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:transform md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-auto md:max-w-2xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto overscroll-contain scroll-smooth bg-white dark:bg-gray-800 rounded-none md:rounded-xl shadow-2xl z-[70] md:m-4"
            data-testid="task-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4 flex items-center justify-between z-10">
              <h2
                id="task-modal-title"
                className="text-lg md:text-xl font-bold text-gray-900 dark:text-white"
              >
                {task ? 'Vazifani tahrirlash' : 'Yangi vazifa yaratish'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Yopish"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <div className="p-4 md:p-6 lg:p-8">
              <Form
                schema={FormSchemas.task}
                onSubmit={handleSubmit}
                fields={fields}
                defaultValues={defaultValues}
                submitLabel={task ? 'Yangilash' : 'Yaratish'}
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
