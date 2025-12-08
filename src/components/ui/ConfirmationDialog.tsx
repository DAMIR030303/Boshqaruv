import { useEffect, useRef, useState } from 'react';

import { AlertTriangle, Info, Trash2, X } from 'lucide-react';

import { Button } from './Button';

/**
 * ConfirmationDialog Props
 */
export interface ConfirmationDialogProps {
  /** Dialog ochiq/yopiqligini aniqlaydi */
  isOpen: boolean;
  /** Dialog yopilganda chaqiriladigan funksiya */
  onClose: () => void;
  /** Tasdiqlanganda chaqiriladigan funksiya */
  onConfirm: () => Promise<void> | void;
  /** Dialog sarlavhasi */
  title: string;
  /** Dialog tavsifi */
  description: string;
  /** Dialog turi */
  variant?: 'danger' | 'warning' | 'info';
  /** Tasdiqlash tugmasi matni */
  confirmText?: string;
  /** Bekor qilish tugmasi matni */
  cancelText?: string;
  /** Loading holati */
  isLoading?: boolean;
}

/**
 * ConfirmationDialog komponenti - Muhim amallarni tasdiqlash uchun
 *
 * Bu komponent foydalanuvchidan delete, logout va boshqa muhim
 * amallarni tasdiqlashni so'raydi.
 *
 * @example
 * ```tsx
 * <ConfirmationDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Vazifani o'chirish"
 *   description="Ushbu vazifani o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi."
 *   variant="danger"
 * />
 * ```
 */
export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = 'danger',
  confirmText = 'Tasdiqlash',
  cancelText = 'Bekor qilish',
  isLoading = false,
}: ConfirmationDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape - yopish
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      // Enter - tasdiqlash (faqat loading bo'lmasa)
      if (e.key === 'Enter' && !isLoading) {
        e.preventDefault();
        void onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onConfirm, isLoading]);

  // Auto-focus confirm button
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  // Agar dialog yopiq bo'lsa, hech narsa ko'rsatmaymiz
  if (!isOpen) return null;

  // Variant bo'yicha icon va rangni aniqlash
  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: Trash2,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          buttonVariant: 'danger' as const,
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          buttonVariant: 'warning' as const,
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          buttonVariant: 'primary' as const,
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-gray-500',
          bgColor: 'bg-gray-100 dark:bg-gray-900/20',
          buttonVariant: 'secondary' as const,
        };
    }
  };

  const config = getVariantConfig();
  const Icon = config.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Yopish"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center mb-4`}
          >
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>

          {/* Content */}
          <div className="mb-6">
            <h2
              id="dialog-title"
              className="text-xl font-bold text-gray-900 dark:text-white mb-2"
            >
              {title}
            </h2>
            <p
              id="dialog-description"
              className="text-gray-600 dark:text-gray-300"
            >
              {description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              ref={confirmButtonRef}
              variant={config.buttonVariant}
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Yuklanmoqda...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * useConfirmationDialog - Dialog holatini boshqarish uchun hook
 *
 * @example
 * ```tsx
 * const { isOpen, open, close, confirm } = useConfirmationDialog({
 *   onConfirm: async () => {
 *     await deleteTask(taskId);
 *   }
 * });
 *
 * return (
 *   <>
 *     <Button onClick={open}>Delete</Button>
 *     <ConfirmationDialog
 *       isOpen={isOpen}
 *       onClose={close}
 *       onConfirm={confirm}
 *       title="Delete task"
 *       description="Are you sure?"
 *     />
 *   </>
 * );
 * ```
 */
export function useConfirmationDialog({
  onConfirm,
}: {
  onConfirm: () => Promise<void> | void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => {
    if (!isLoading) {
      setIsOpen(false);
    }
  };

  const confirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      // Error handling - logger orqali
      console.error('Confirmation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    isLoading,
    open,
    close,
    confirm,
  };
}
