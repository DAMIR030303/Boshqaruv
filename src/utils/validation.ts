import { z } from 'zod';

/**
 * Common validation schemas
 */
export const ValidationSchemas = {
  // User authentication
  username: z.string()
    .min(3, 'Foydalanuvchi nomi kamida 3 ta belgidan iborat bo\'lishi kerak')
    .max(20, 'Foydalanuvchi nomi 20 ta belgidan oshmasligi kerak')
    .regex(/^[a-zA-Z0-9_]+$/, 'Foydalanuvchi nomi faqat harf, raqam va pastki chiziqdan iborat bo\'lishi kerak'),
  
  password: z.string()
    .min(8, 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak')
    .regex(/[A-Z]/, 'Parol kamida 1 ta katta harf o\'z ichiga olishi kerak')
    .regex(/[a-z]/, 'Parol kamida 1 ta kichik harf o\'z ichiga olishi kerak')
    .regex(/[0-9]/, 'Parol kamida 1 ta raqam o\'z ichiga olishi kerak')
    .regex(/[!@#$%^&*]/, 'Parol kamida 1 ta maxsus belgi o\'z ichiga olishi kerak'),
  
  email: z.string()
    .email('Noto\'g\'ri email formati')
    .min(5, 'Email kamida 5 ta belgidan iborat bo\'lishi kerak')
    .max(100, 'Email 100 ta belgidan oshmasligi kerak'),
  
  phone: z.string()
    .regex(/^\+998[0-9]{9}$/, 'Telefon raqam +998XXXXXXXXX formatida bo\'lishi kerak'),
  
  // Task validation
  taskTitle: z.string()
    .min(3, 'Vazifa nomi kamida 3 ta belgidan iborat bo\'lishi kerak')
    .max(100, 'Vazifa nomi 100 ta belgidan oshmasligi kerak'),
  
  taskDescription: z.string()
    .max(500, 'Vazifa tavsifi 500 ta belgidan oshmasligi kerak')
    .optional(),
  
  taskPriority: z.enum(['low', 'medium', 'high']),
  
  taskStatus: z.enum(['pending', 'in-progress', 'completed']),
  
  // Date validation
  date: z.date(),
  
  dateRange: z.object({
    start: z.date(),
    end: z.date()
  }).refine(data => data.end >= data.start, {
    message: 'Tugash sanasi boshlanish sanasidan katta bo\'lishi kerak'
  }),
  
  // Number validation
  positiveNumber: z.number()
    .positive('Qiymat musbat bo\'lishi kerak')
    .finite('Qiymat chekli bo\'lishi kerak'),
  
  percentage: z.number()
    .min(0, 'Foiz 0 dan kichik bo\'lishi mumkin emas')
    .max(100, 'Foiz 100 dan katta bo\'lishi mumkin emas'),
  
  // File validation
  imageFile: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'Fayl hajmi 5MB dan oshmasligi kerak')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Faqat JPEG, PNG yoki WebP formatidagi rasmlar qabul qilinadi'
    ),
  
  documentFile: z.instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, 'Fayl hajmi 10MB dan oshmasligi kerak')
    .refine(
      file => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
      'Faqat PDF yoki Word hujjatlari qabul qilinadi'
    )
};

/**
 * Form schemas
 */
export const FormSchemas = {
  login: z.object({
    username: ValidationSchemas.username,
    password: ValidationSchemas.password,
    rememberMe: z.boolean().optional()
  }),
  
  register: z.object({
    username: ValidationSchemas.username,
    email: ValidationSchemas.email,
    password: ValidationSchemas.password,
    confirmPassword: z.string(),
    phone: ValidationSchemas.phone.optional(),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'Foydalanish shartlarini qabul qilishingiz kerak'
    })
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Parollar mos kelmayapti',
    path: ['confirmPassword']
  }),
  
  task: z.object({
    title: ValidationSchemas.taskTitle,
    description: ValidationSchemas.taskDescription,
    assignee: z.string().min(1, 'Mas\'ul shaxs tanlanishi kerak'),
    priority: ValidationSchemas.taskPriority,
    status: ValidationSchemas.taskStatus,
    dueDate: ValidationSchemas.date
  }),
  
  employee: z.object({
    name: z.string()
      .min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak')
      .max(50, 'Ism 50 ta belgidan oshmasligi kerak'),
    position: z.string()
      .min(2, 'Lavozim kamida 2 ta belgidan iborat bo\'lishi kerak')
      .max(50, 'Lavozim 50 ta belgidan oshmasligi kerak'),
    department: z.string()
      .min(2, 'Bo\'lim kamida 2 ta belgidan iborat bo\'lishi kerak')
      .max(50, 'Bo\'lim 50 ta belgidan oshmasligi kerak'),
    email: ValidationSchemas.email,
    phone: ValidationSchemas.phone,
    salary: ValidationSchemas.positiveNumber.optional(),
    startDate: ValidationSchemas.date
  }),
  
  penalty: z.object({
    employeeId: z.string().min(1, 'Xodim tanlanishi kerak'),
    type: z.string().min(1, 'Jarima turi tanlanishi kerak'),
    amount: ValidationSchemas.positiveNumber,
    reason: z.string()
      .min(10, 'Sabab kamida 10 ta belgidan iborat bo\'lishi kerak')
      .max(200, 'Sabab 200 ta belgidan oshmasligi kerak'),
    date: ValidationSchemas.date
  })
};

/**
 * Validation helper functions
 */
export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; data?: T; errors?: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach(issue => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validatsiya xatosi' } };
  }
};

/**
 * Sanitize form data
 */
export const sanitizeFormData = <T extends Record<string, unknown>>(data: T): T => {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remove dangerous characters and trim
      sanitized[key as keyof T] = value
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim() as T[keyof T];
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively sanitize nested objects
      sanitized[key as keyof T] = sanitizeFormData(value as Record<string, unknown>) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value as T[keyof T];
    }
  }
  
  return sanitized;
};

/**
 * Custom validation rules
 */
export const CustomValidators = {
  isUzbekPhoneNumber: (phone: string): boolean => {
    return /^\+998[0-9]{9}$/.test(phone);
  },
  
  isStrongPassword: (password: string): boolean => {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[!@#$%^&*]/.test(password);
  },
  
  isValidWorkingHours: (start: string, end: string): boolean => {
    const startTime = new Date(`2000-01-01 ${start}`);
    const endTime = new Date(`2000-01-01 ${end}`);
    return endTime > startTime;
  },
  
  isFutureDate: (date: Date): boolean => {
    return date > new Date();
  },
  
  isPastDate: (date: Date): boolean => {
    return date < new Date();
  },
  
  isWorkday: (date: Date): boolean => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Not Sunday or Saturday
  }
};