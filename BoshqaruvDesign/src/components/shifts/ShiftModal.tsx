import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ButtonEnhanced } from '../enhanced/ButtonEnhanced';
import { InputEnhanced, SelectEnhanced, TimePicker } from '../enhanced/FormComponents';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { 
  Clock, 
  Calendar, 
  Users, 
  AlertTriangle,
  Save,
  X,
  Timer
} from 'lucide-react';

interface ShiftData {
  id?: string;
  title: string;
  startTime: string;
  endTime: string;
  graceMinutes: number;
  type: string;
  daysOfWeek: number[];
  description?: string;
}

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shiftData: ShiftData) => void;
  shiftData?: ShiftData | null;
  mode: 'create' | 'edit';
}

const defaultShiftData: ShiftData = {
  title: '',
  startTime: '09:00',
  endTime: '17:00',
  graceMinutes: 15,
  type: 'morning',
  daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
  description: '',
};

export function ShiftModal({ isOpen, onClose, onSave, shiftData, mode }: ShiftModalProps) {
  const [formData, setFormData] = useState<ShiftData>(defaultShiftData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && shiftData) {
        setFormData(shiftData);
      } else {
        setFormData(defaultShiftData);
      }
      setErrors({});
    }
  }, [isOpen, mode, shiftData]);

  const shiftTypeOptions = [
    { value: 'morning', label: 'Ertalabki smena' },
    { value: 'afternoon', label: 'Tushdan keyin smena' },
    { value: 'night', label: 'Kechki smena' },
    { value: 'weekend', label: 'Dam olish kuni' },
    { value: 'custom', label: 'Maxsus smena' },
  ];

  const weekDays = [
    { id: 1, name: 'Dushanba', short: 'Dush' },
    { id: 2, name: 'Seshanba', short: 'Sesh' },
    { id: 3, name: 'Chorshanba', short: 'Chor' },
    { id: 4, name: 'Payshanba', short: 'Pay' },
    { id: 5, name: 'Juma', short: 'Juma' },
    { id: 6, name: 'Shanba', short: 'Shan' },
    { id: 0, name: 'Yakshanba', short: 'Yak' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Smena nomi majburiy';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Boshlanish vaqti majburiy';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Tugash vaqti majburiy';
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01 ${formData.startTime}`);
      const end = new Date(`2000-01-01 ${formData.endTime}`);
      
      // Handle overnight shifts
      if (end <= start) {
        end.setDate(end.getDate() + 1);
      }
      
      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (diffHours > 24) {
        newErrors.endTime = 'Smena 24 soatdan ko\'p bo\'lishi mumkin emas';
      }
    }

    if (formData.graceMinutes < 0 || formData.graceMinutes > 60) {
      newErrors.graceMinutes = 'Kechikish vaqti 0-60 daqiqa orasida bo\'lishi kerak';
    }

    if (formData.daysOfWeek.length === 0) {
      newErrors.daysOfWeek = 'Kamida bitta kun tanlang';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      handleClose();
    } catch (error) {
      console.error('Error saving shift:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(defaultShiftData);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleDayToggle = (dayId: number) => {
    const newDays = formData.daysOfWeek.includes(dayId)
      ? formData.daysOfWeek.filter(id => id !== dayId)
      : [...formData.daysOfWeek, dayId];
    
    setFormData(prev => ({ ...prev, daysOfWeek: newDays }));
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return '';
    
    const start = new Date(`2000-01-01 ${formData.startTime}`);
    const end = new Date(`2000-01-01 ${formData.endTime}`);
    
    // Handle overnight shifts
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }
    
    const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours} soat ${minutes > 0 ? `${minutes} daqiqa` : ''}`;
  };

  const isOvernight = () => {
    if (!formData.startTime || !formData.endTime) return false;
    const start = new Date(`2000-01-01 ${formData.startTime}`);
    const end = new Date(`2000-01-01 ${formData.endTime}`);
    return end <= start;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Yangi smena yaratish' : 'Smenani tahrirlash'}
          </DialogTitle>
          <DialogDescription>
            Smena ma'lumotlarini to'ldiring va xodimlar uchun ish vaqtini belgilang
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Asosiy ma'lumotlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                <InputEnhanced
                  label="Smena nomi"
                  placeholder="Masalan: Ertalabki smena"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  error={errors.title}
                />
                
                <SelectEnhanced
                  label="Smena turi"
                  placeholder="Turini tanlang"
                  options={shiftTypeOptions}
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                />
              </div>

              <InputEnhanced
                label="Tavsif (ixtiyoriy)"
                placeholder="Smena haqida qo'shimcha ma'lumot..."
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </CardContent>
          </Card>

          {/* Time Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Vaqt sozlamalari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
                <TimePicker
                  label="Boshlanish vaqti"
                  value={formData.startTime}
                  onChange={(time) => setFormData(prev => ({ ...prev, startTime: time }))}
                  error={errors.startTime}
                />
                
                <TimePicker
                  label="Tugash vaqti"
                  value={formData.endTime}
                  onChange={(time) => setFormData(prev => ({ ...prev, endTime: time }))}
                  error={errors.endTime}
                />

                <InputEnhanced
                  label="Kechikishga ruxsat (daqiqa)"
                  type="number"
                  min="0"
                  max="60"
                  value={formData.graceMinutes.toString()}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    graceMinutes: parseInt(e.target.value) || 0 
                  }))}
                  error={errors.graceMinutes}
                  helpText="Xodim bu vaqt ichida kelsalar kechikgan hisoblanmaydi"
                />
              </div>

              {/* Duration and overnight indicator */}
              <div className="flex flex-wrap gap-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Davomiyligi: <strong>{calculateDuration()}</strong>
                  </span>
                </div>
                {isOvernight() && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm text-warning">Tungi smena</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Days of Week */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ish kunlari
              </CardTitle>
              <CardDescription>
                Smena qaysi kunlarda ishlashini tanlang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 tablet:grid-cols-4 gap-2">
                {weekDays.map((day) => (
                  <Button
                    key={day.id}
                    variant={formData.daysOfWeek.includes(day.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDayToggle(day.id)}
                    className="justify-start"
                  >
                    {day.name}
                  </Button>
                ))}
              </div>
              {errors.daysOfWeek && (
                <p className="text-sm text-danger mt-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.daysOfWeek}
                </p>
              )}
              
              {/* Selected days preview */}
              {formData.daysOfWeek.length > 0 && (
                <div className="mt-3 p-2 bg-muted rounded">
                  <p className="text-sm text-muted-foreground mb-1">Tanlangan kunlar:</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.daysOfWeek
                      .sort((a, b) => a - b)
                      .map(dayId => {
                        const day = weekDays.find(d => d.id === dayId);
                        return (
                          <Badge key={dayId} variant="secondary" className="text-xs">
                            {day?.short}
                          </Badge>
                        );
                      })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t">
          <ButtonEnhanced
            variant="outline"
            iconLeft={<X className="h-4 w-4" />}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Bekor qilish
          </ButtonEnhanced>
          
          <ButtonEnhanced
            variant="primary"
            iconLeft={<Save className="h-4 w-4" />}
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            {mode === 'create' ? 'Yaratish' : 'Saqlash'}
          </ButtonEnhanced>
        </div>
      </DialogContent>
    </Dialog>
  );
}