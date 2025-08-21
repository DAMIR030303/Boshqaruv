import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  Upload,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface FormErrors {
  [key: string]: string;
}

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  address: string;
  startDate: string;
  salary: string;
  workingHours: string;
  bio: string;
  avatar?: File;
}

const departments = [
  { value: 'it', label: 'IT bo\'limi' },
  { value: 'hr', label: 'Kadrlar bo\'limi' },
  { value: 'finance', label: 'Moliya bo\'limi' },
  { value: 'marketing', label: 'Marketing bo\'limi' },
  { value: 'sales', label: 'Sotuv bo\'limi' },
  { value: 'support', label: 'Qo\'llab-quvvatlash' },
];

const positions = [
  { value: 'frontend-dev', label: 'Frontend Developer' },
  { value: 'backend-dev', label: 'Backend Developer' },
  { value: 'fullstack-dev', label: 'Fullstack Developer' },
  { value: 'ui-designer', label: 'UI/UX Designer' },
  { value: 'project-manager', label: 'Project Manager' },
  { value: 'qa-engineer', label: 'QA Engineer' },
  { value: 'devops', label: 'DevOps Engineer' },
  { value: 'hr-specialist', label: 'HR Specialist' },
  { value: 'accountant', label: 'Buxgalter' },
  { value: 'marketing-specialist', label: 'Marketing Specialist' },
];

export function CreateEmployeeModal({ isOpen, onClose, onSave }: CreateEmployeeModalProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    address: '',
    startDate: '',
    salary: '',
    workingHours: '09:00-18:00',
    bio: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Validation rules
  const validateField = useCallback((name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'Ism majburiy';
        if (value.length < 2) return 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak';
        return '';
      
      case 'lastName':
        if (!value.trim()) return 'Familiya majburiy';
        if (value.length < 2) return 'Familiya kamida 2 ta belgidan iborat bo\'lishi kerak';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email majburiy';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Noto\'g\'ri email format';
        return '';
      
      case 'phone':
        if (!value.trim()) return 'Telefon raqam majburiy';
        const phoneRegex = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
        if (!phoneRegex.test(value)) return 'Telefon raqam +998 XX XXX XX XX formatida bo\'lishi kerak';
        return '';
      
      case 'position':
        if (!value) return 'Lavozim majburiy';
        return '';
      
      case 'department':
        if (!value) return 'Bo\'lim majburiy';
        return '';
      
      case 'address':
        if (!value.trim()) return 'Manzil majburiy';
        if (value.length < 10) return 'Manzil kamida 10 ta belgidan iborat bo\'lishi kerak';
        return '';
      
      case 'startDate':
        if (!value) return 'Ishga kirish sanasi majburiy';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'Ishga kirish sanasi bugundan kech bo\'lmasligi kerak';
        return '';
      
      case 'salary':
        if (!value.trim()) return 'Maosh majburiy';
        const salary = parseFloat(value);
        if (isNaN(salary) || salary <= 0) return 'Maosh musbat son bo\'lishi kerak';
        if (salary < 1000000) return 'Maosh kamida 1,000,000 so\'m bo\'lishi kerak';
        return '';
      
      default:
        return '';
    }
  }, []);

  // Real-time validation
  const handleFieldChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Validate on blur (after a short delay)
    setTimeout(() => {
      const error = validateField(name, value);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }, 500);
  }, [errors, validateField]);

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'bio' && key !== 'avatar') {
        const error = validateField(key, formData[key as keyof EmployeeFormData] as string);
        if (error) {
          newErrors[key] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Check if form is valid
  const isFormValid = useCallback((): boolean => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'position', 'department', 'address', 'startDate', 'salary'];
    return requiredFields.every(field => {
      const value = formData[field as keyof EmployeeFormData] as string;
      return value && value.trim() && !validateField(field, value);
    });
  }, [formData, validateField]);

  // Handle avatar upload
  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Fayl hajmi 5MB dan kichik bo\'lishi kerak');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({ ...prev, avatar: file }));
    }
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Iltimos, barcha majburiy maydonlarni to\'g\'ri to\'ldiring');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSave(formData);
    } catch (error) {
      toast.error('Xatolik yuz berdi, qaytadan urinib ko\'ring');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSave]);

  // Reset form when modal closes
  const handleClose = useCallback(() => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      address: '',
      startDate: '',
      salary: '',
      workingHours: '09:00-18:00',
      bio: '',
    });
    setErrors({});
    setIsSubmitting(false);
    setAvatarPreview('');
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Yangi xodim qo'shish
          </DialogTitle>
          <DialogDescription>
            Yangi xodimning barcha ma'lumotlarini kiriting
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Avatar" />
              ) : (
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Rasm yuklash
              </Button>
              {avatarPreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAvatarPreview('');
                    setFormData(prev => ({ ...prev, avatar: undefined }));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Shaxsiy ma'lumotlar
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Ism <span className="text-danger">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  placeholder="Alisher"
                  className={errors.firstName ? 'border-danger focus:border-danger' : ''}
                />
                {errors.firstName && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-danger"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.firstName}
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Familiya <span className="text-danger">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  placeholder="Fayzullayev"
                  className={errors.lastName ? 'border-danger focus:border-danger' : ''}
                />
                {errors.lastName && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-danger"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.lastName}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-danger">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="alisher@boshqaruv.uz"
                  className={errors.email ? 'border-danger focus:border-danger' : ''}
                />
                {errors.email && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-danger"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Telefon <span className="text-danger">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className={errors.phone ? 'border-danger focus:border-danger' : ''}
                />
                {errors.phone && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-danger"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Manzil <span className="text-danger">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="Toshkent, Yunusobod tumani, 1-kvartal"
                className={errors.address ? 'border-danger focus:border-danger' : ''}
              />
              {errors.address && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.address}
                </motion.div>
              )}
            </div>
          </div>

          <Separator />

          {/* Work Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Ish ma'lumotlari
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">
                  Bo'lim <span className="text-danger">*</span>
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleFieldChange('department', value)}
                >
                  <SelectTrigger className={errors.department ? 'border-danger focus:border-danger' : ''}>
                    <SelectValue placeholder="Bo'limni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-danger"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.department}
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">
                  Lavozim <span className="text-danger">*</span>
                </Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => handleFieldChange('position', value)}
                >
                  <SelectTrigger className={errors.position ? 'border-danger focus:border-danger' : ''}>
                    <SelectValue placeholder="Lavozimni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.value} value={pos.value}>
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.position && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-danger"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.position}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Ishga kirish sanasi <span className="text-danger">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleFieldChange('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.startDate ? 'border-danger focus:border-danger' : ''}
                />
                {errors.startDate && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-danger"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.startDate}
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">
                  Maosh (so'm) <span className="text-danger">*</span>
                </Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleFieldChange('salary', e.target.value)}
                  placeholder="5000000"
                  min="1000000"
                  className={errors.salary ? 'border-danger focus:border-danger' : ''}
                />
                {errors.salary && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-danger"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.salary}
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours">
                  Ish vaqti
                </Label>
                <Select
                  value={formData.workingHours}
                  onValueChange={(value) => handleFieldChange('workingHours', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00-18:00">09:00 - 18:00</SelectItem>
                    <SelectItem value="08:00-17:00">08:00 - 17:00</SelectItem>
                    <SelectItem value="10:00-19:00">10:00 - 19:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Bio (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="bio">
              Qo'shimcha ma'lumot
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleFieldChange('bio', e.target.value)}
              placeholder="Xodim haqida qo'shimcha ma'lumotlar..."
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Bekor qilish
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid() || isSubmitting}
              className="min-w-24"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saqlash
                </>
              )}
            </Button>
          </div>

          {/* Form Status */}
          {!isFormValid() && (
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                Barcha majburiy maydonlarni to'ldiring
              </Badge>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}