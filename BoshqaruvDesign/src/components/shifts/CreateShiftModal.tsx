import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Clock, AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CreateShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: Partial<ShiftFormData>;
}

interface ShiftFormData {
  name: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  location: string;
  maxEmployees: string;
  gracePeriod: string;
}

const LOCATIONS = [
  { value: 'main-office', label: 'Bosh ofis' },
  { value: 'branch-1', label: 'Samarqand filiali' },
  { value: 'branch-2', label: 'Buxoro filiali' },
  { value: 'remote', label: 'Masofaviy ish' },
];

export function CreateShiftModal({ isOpen, onClose, onSave, initialData }: CreateShiftModalProps) {
  const [formData, setFormData] = useState<ShiftFormData>({
    name: initialData?.name ?? '',
    startTime: initialData?.startTime ?? '09:00',
    endTime: initialData?.endTime ?? '18:00',
    breakDuration: initialData?.breakDuration ?? '60',
    location: initialData?.location ?? '',
    maxEmployees: initialData?.maxEmployees ?? '10',
    gracePeriod: initialData?.gracePeriod ?? '15',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Smena nomi majburiy';
        if (value.length < 3) return 'Smena nomi kamida 3 ta belgidan iborat bo\'lishi kerak';
        return '';
      case 'location':
        if (!value) return 'Joylashuvni tanlang';
        return '';
      case 'endTime':
        if (!value) return 'Tugash vaqti majburiy';
        if (formData.startTime && value <= formData.startTime) {
          return 'Tugash vaqti boshlanish vaqtidan kech bo\'lishi kerak';
        }
        return '';
      case 'maxEmployees':
        if (!value) return 'Maksimal xodimlar soni majburiy';
        const maxEmp = parseInt(value);
        if (isNaN(maxEmp) || maxEmp < 1) return 'Maksimal xodimlar soni musbat son bo\'lishi kerak';
        if (maxEmp > 50) return 'Maksimal xodimlar soni 50 dan oshmasligi kerak';
        return '';
      case 'breakDuration':
        if (!value) return 'Tanaffus vaqti majburiy';
        const duration = parseInt(value);
        if (isNaN(duration) || duration < 0) return 'Tanaffus vaqti musbat son bo\'lishi kerak';
        if (duration > 120) return 'Tanaffus vaqti 2 soatdan oshmasligi kerak';
        return '';
      case 'gracePeriod':
        if (!value) return 'Imtiyozli vaqt majburiy';
        const grace = parseInt(value);
        if (isNaN(grace) || grace < 0) return 'Imtiyozli vaqt musbat son bo\'lishi kerak';
        if (grace > 60) return 'Imtiyozli vaqt 1 soatdan oshmasligi kerak';
        return '';
      default:
        return '';
    }
  }, [formData.startTime]);

  const handleFieldChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setTimeout(() => {
      const error = validateField(name, value);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }, 500);
  }, [errors, validateField]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'breakDuration' && key !== 'gracePeriod') {
        const error = validateField(key, formData[key as keyof ShiftFormData]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const isFormValid = useCallback((): boolean => {
    const requiredFields = ['name', 'startTime', 'endTime', 'location', 'maxEmployees'];
    return requiredFields.every(field => {
      const value = formData[field as keyof ShiftFormData];
      return value && value.trim() && !validateField(field, value);
    });
  }, [formData, validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Iltimos, barcha majburiy maydonlarni to\'g\'ri to\'ldiring');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(formData);
    } catch (error) {
      toast.error('Xatolik yuz berdi, qaytadan urinib ko\'ring');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSave]);

  const handleClose = useCallback(() => {
    setFormData({
      name: '',
      startTime: '09:00',
      endTime: '18:00',
      breakDuration: '60',
      location: '',
      maxEmployees: '10',
      gracePeriod: '15',
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Yangi smena yaratish
          </DialogTitle>
          <DialogDescription>
            Yangi ish smenasi uchun vaqt jadval va sozlamalarni kiriting
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">
                Smena nomi <span className="text-danger">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Ertalabki smena"
                className={errors.name ? 'border-danger focus:border-danger' : ''}
              />
              {errors.name && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">
                Boshlanish vaqti <span className="text-danger">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleFieldChange('startTime', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">
                Tugash vaqti <span className="text-danger">*</span>
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleFieldChange('endTime', e.target.value)}
                className={errors.endTime ? 'border-danger focus:border-danger' : ''}
              />
              {errors.endTime && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.endTime}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Joylashuv <span className="text-danger">*</span>
              </Label>
              <Select value={formData.location} onValueChange={(value) => handleFieldChange('location', value)}>
                <SelectTrigger className={errors.location ? 'border-danger focus:border-danger' : ''}>
                  <SelectValue placeholder="Joylashuvni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.location}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxEmployees">
                Maksimal xodimlar <span className="text-danger">*</span>
              </Label>
              <Input
                id="maxEmployees"
                type="number"
                value={formData.maxEmployees}
                onChange={(e) => handleFieldChange('maxEmployees', e.target.value)}
                min="1"
                max="50"
                className={errors.maxEmployees ? 'border-danger focus:border-danger' : ''}
              />
              {errors.maxEmployees && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.maxEmployees}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakDuration">Tanaffus (daqiqa)</Label>
              <Input
                id="breakDuration"
                type="number"
                value={formData.breakDuration}
                onChange={(e) => handleFieldChange('breakDuration', e.target.value)}
                min="0"
                max="120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gracePeriod">Imtiyozli vaqt (daqiqa)</Label>
              <Input
                id="gracePeriod"
                type="number"
                value={formData.gracePeriod}
                onChange={(e) => handleFieldChange('gracePeriod', e.target.value)}
                min="0"
                max="60"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={!isFormValid() || isSubmitting} className="min-w-24">
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Yaratish
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}