import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import {
  Controller,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
  type UseFormReturn,
  useForm,
} from 'react-hook-form';
import { type z } from 'zod';

import { getTranslation } from '../../i18n';
import { logger } from '../../utils/logger';

import { Button } from './Button';

/**
 * Form field props
 */
export interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'select'
    | 'textarea'
    | 'date'
    | 'number'
    | 'tel';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  description?: string;
}

/**
 * Form props
 */
export interface FormProps<T extends FieldValues> {
  /** Form schema (Zod schema) */
  // Note: Using z.ZodType to support all Zod schema types (ZodObject, ZodSchema, etc.)
  // This is compatible with zodResolver's type system
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodType<T, any, any>;
  /** Form submit handler */
  onSubmit: (data: T) => Promise<void> | void;
  /** Form fields */
  fields: FormFieldProps<T>[];
  /** Submit button label */
  submitLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Show cancel button */
  showCancel?: boolean;
  /** Cancel handler */
  onCancel?: () => void;
  /** Default values */
  defaultValues?: Partial<T>;
  /** Loading state */
  isLoading?: boolean;
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Custom submit button */
  customSubmitButton?: React.ReactNode;
}

/**
 * Umumiy Form komponenti - React Hook Form + Zod bilan
 *
 * Bu komponent barcha formlar uchun asosiy struktura va funksionallikni ta'minlaydi.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   title: z.string().min(3, 'Kamida 3 belgi'),
 *   description: z.string().optional()
 * });
 *
 * <Form
 *   schema={schema}
 *   onSubmit={async (data) => {
 *     await createTask(data);
 *   }}
 *   fields={[
 *     { name: 'title', label: 'Nomi', type: 'text', required: true },
 *     { name: 'description', label: 'Tavsif', type: 'textarea' }
 *   ]}
 * />
 * ```
 */
export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  fields,
  submitLabel,
  cancelLabel,
  showCancel = true,
  onCancel,
  defaultValues,
  isLoading = false,
  title,
  description,
}: FormProps<T>) {
  // i18n helper
  const t = (key: string) => getTranslation(key, 'uz');

  // Default labels from i18n
  const defaultSubmitLabel = submitLabel || t('form.save');
  const defaultCancelLabel = cancelLabel || t('form.cancel');
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<T>({
    // Type assertion required due to zodResolver/react-hook-form type compatibility limitation
    // This is a known issue: https://github.com/react-hook-form/resolvers/issues/781
    //
    // Why this is safe:
    // 1. zodResolver validates the schema correctly at runtime
    // 2. The generic type T ensures type safety for form data
    // 3. This limitation exists even in the latest versions (tested with @hookform/resolvers 5.2.2)
    //
    // Alternative approaches were tested but don't work with generic FormProps<T>:
    // - z.ZodSchema<T> type doesn't match zodResolver's expected type structure
    // - z.input<typeof schema> / z.output<typeof schema> requires concrete schema type
    //
    // This type assertion is minimal and safe in practice.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as Resolver<T>,
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleFormSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      logger.error(
        'Form submit error',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  };

  const handleCancel = () => {
    reset();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-5 sm:space-y-6"
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      {fields.map(field => (
        <FormField
          key={String(field.name)}
          field={field}
          control={control}
          errors={errors}
        />
      ))}

      <div className="flex space-x-3 pt-5 sm:pt-6">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1"
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('form.saving')}
            </>
          ) : (
            defaultSubmitLabel
          )}
        </Button>
        {showCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting || isLoading}
            className="flex-1"
          >
            {defaultCancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
}

/**
 * Form field komponenti
 */
function FormField<T extends FieldValues>({
  field,
  control,
  errors,
}: {
  field: FormFieldProps<T>;
  control: UseFormReturn<T>['control'];
  errors: UseFormReturn<T>['formState']['errors'];
}) {
  const error = errors[field.name];
  const fieldId = `field-${String(field.name)}`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="block text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wide"
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {field.description}
        </p>
      )}

      <Controller
        name={field.name}
        control={control}
        render={({ field: formField }) => {
          if (field.type === 'textarea') {
            return (
              <textarea
                {...formField}
                id={fieldId}
                rows={4}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md ${
                  error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-700'
                } ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            );
          }

          if (field.type === 'select' && field.options) {
            return (
              <select
                {...formField}
                id={fieldId}
                disabled={field.disabled}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md ${
                  error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-700'
                } ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">{getTranslation('form.select', 'uz')}</option>
                {field.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          }

          return (
            <input
              {...formField}
              id={fieldId}
              type={field.type || 'text'}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md ${
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 dark:border-gray-700'
              } ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          );
        }}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 dark:text-red-400"
        >
          {error.message as string}
        </motion.p>
      )}
    </div>
  );
}
