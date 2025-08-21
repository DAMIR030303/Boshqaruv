import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertTriangle, AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePenaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface PenaltyFormData {
  employee: string;
  rule: string;
  reason: string;
  points: string;
  occurredAt: string;
  category: string;
}

const EMPLOYEES = [
  { value: 'emp1', label: 'Alisher Fayzullayev' },
  { value: 'emp2', label: 'Nozima Karimova' },
  { value: 'emp3', label: 'Jamshid Tursunov' },
  { value: 'emp4', label: 'Dilnoza Rahimova' },
];

const PENALTY_RULES = [
  { value: 'att001', label: 'ATT001 - Kechikish', points: 5, category: 'Davomat' },
  { value: 'att002', label: 'ATT002 - Ruxsatsiz ketish', points: 10, category: 'Davomat' },
  { value: 'beh001', label: 'BEH001 - Noto\'g\'ri xulq', points: 15, category: 'Xulq-atvor' },
  { value: 'per001', label: 'PER001 - Vazifa bajarilmadi', points: 8, category: 'Ish samaradorligi' },
];

export function CreatePenaltyModal({ isOpen, onClose, onSave }: CreatePenaltyModalProps) {
  const [formData, setFormData] = useState<PenaltyFormData>({
    employee: '',
    rule: '',
    reason: '',
    points: '',
    occurredAt: '',
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: string, value: string): string => {
    switch (name) {
      case 'employee':
        if (!value) return 'Xodimni tanlang';
        return '';
      case 'rule':
        if (!value) return 'Jarima qoidasini tanlang';
        return '';
      case 'reason':
        if (!value.trim()) return 'Jarima sababini kiriting';
        if (value.length < 10) return 'Sabab kamida 10 ta belgidan iborat bo\'lishi kerak';
        return '';
      case 'occurredAt':
        if (!value) return 'Sodir bo\'lgan vaqtni kiriting';
        const selectedDate = new Date(value);
        const now = new Date();
        if (selectedDate > now) return 'Sana kelajakda bo\'lishi mumkin emas';
        return '';
      case 'points':
        if (!value) return 'Ball miqdorini kiriting';
        const points = parseInt(value);
        if (isNaN(points) || points <= 0) return 'Ball miqdori musbat son bo\'lishi kerak';
        if (points > 50) return 'Ball miqdori 50 dan oshmasligi kerak';
        return '';
      default:
        return '';
    }
  }, []);

  const handleFieldChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-fill points and category when rule is selected
    if (name === 'rule') {
      const selectedRule = PENALTY_RULES.find(rule => rule.value === value);
      if (selectedRule) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          points: selectedRule.points.toString(),
          category: selectedRule.category
        }));
      }
    }
    
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
    
    ['employee', 'rule', 'reason', 'occurredAt', 'points'].forEach(key => {
      const error = validateField(key, formData[key as keyof PenaltyFormData]);
      if (error) {
        newErrors[key] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const isFormValid = useCallback((): boolean => {
    const requiredFields = ['employee', 'rule', 'reason', 'occurredAt', 'points'];
    return requiredFields.every(field => {
      const value = formData[field as keyof PenaltyFormData];
      return value && value.toString().trim() && !validateField(field, value);
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
      employee: '',
      rule: '',
      reason: '',
      points: '',
      occurredAt: '',
      category: '',
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
            <AlertTriangle className="h-5 w-5 text-primary" />
            Yangi jarima qo'shish
          </DialogTitle>
          <DialogDescription>
            Xodimga jarima belgilash uchun barcha ma'lumotlarni kiriting
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">
                Xodim <span className="text-danger">*</span>
              </Label>
              <Select value={formData.employee} onValueChange={(value) => handleFieldChange('employee', value)}>
                <SelectTrigger className={errors.employee ? 'border-danger focus:border-danger' : ''}>
                  <SelectValue placeholder="Xodimni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEES.map((emp) => (
                    <SelectItem key={emp.value} value={emp.value}>
                      {emp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employee && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.employee}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rule">
                Jarima qoidasi <span className="text-danger">*</span>
              </Label>
              <Select value={formData.rule} onValueChange={(value) => handleFieldChange('rule', value)}>
                <SelectTrigger className={errors.rule ? 'border-danger focus:border-danger' : ''}>
                  <SelectValue placeholder="Qoidani tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {PENALTY_RULES.map((rule) => (
                    <SelectItem key={rule.value} value={rule.value}>
                      {rule.label} ({rule.points} ball)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rule && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.rule}
                </motion.div>
              )}
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="reason">
                Jarima sababi <span className="text-danger">*</span>
              </Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleFieldChange('reason', e.target.value)}
                placeholder="Jarima belgilash sababini batafsil yozing"
                rows={3}
                className={errors.reason ? 'border-danger focus:border-danger' : ''}
              />
              {errors.reason && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.reason}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="occurredAt">
                Sodir bo'lgan vaqt <span className="text-danger">*</span>
              </Label>
              <Input
                id="occurredAt"
                type="datetime-local"
                value={formData.occurredAt}
                onChange={(e) => handleFieldChange('occurredAt', e.target.value)}
                max={new Date().toISOString().slice(0, 16)}
                className={errors.occurredAt ? 'border-danger focus:border-danger' : ''}
              />
              {errors.occurredAt && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.occurredAt}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">
                Ball miqdori <span className="text-danger">*</span>
              </Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) => handleFieldChange('points', e.target.value)}
                min="1"
                max="50"
                className={errors.points ? 'border-danger focus:border-danger' : ''}
              />
              {errors.points && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.points}
                </motion.div>
              )}
            </div>

            {formData.category && (
              <div className="col-span-2 space-y-2">
                <Label>Kategoriya</Label>
                <Input value={formData.category} disabled className="bg-muted" />
              </div>
            )}
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-warning mb-1">Muhim eslatma</div>
                <p className="text-muted-foreground">
                  Jarima belgilashdan oldin xodim bilan gaplashib, vaziyatni aniq qilib oling. 
                  Jarima holatlari kompaniya qoidalariga mos kelishi kerak.
                </p>
              </div>
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
                  Jarima qo'shish
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}