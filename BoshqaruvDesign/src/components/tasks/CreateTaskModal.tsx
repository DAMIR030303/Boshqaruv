import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CheckSquare, AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingTask?: any;
}

interface TaskFormData {
  title: string;
  description: string;
  assignee: string;
  priority: string;
  dueDate: string;
  project: string;
}

const EMPLOYEES = [
  { value: 'emp1', label: 'Alisher Fayzullayev' },
  { value: 'emp2', label: 'Nozima Karimova' },
  { value: 'emp3', label: 'Jamshid Tursunov' },
  { value: 'emp4', label: 'Dilnoza Rahimova' },
];

const PROJECTS = [
  { value: 'project1', label: 'Frontend Loyihasi' },
  { value: 'project2', label: 'Mobile Ilova' },
  { value: 'project3', label: 'Dashboard Yangilash' },
];

export function CreateTaskModal({ isOpen, onClose, onSave, editingTask }: CreateTaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: '',
    project: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form data when editing
  useEffect(() => {
    if (editingTask) {
      const assigneeValue = EMPLOYEES.find(emp => emp.label === editingTask.assignee.name)?.value || '';
      const projectValue = editingTask.tags && editingTask.tags.length > 0 
        ? PROJECTS.find(project => project.label === editingTask.tags[0])?.value || ''
        : '';

      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        assignee: assigneeValue,
        priority: editingTask.priority || 'medium',
        dueDate: editingTask.dueDate || '',
        project: projectValue,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assignee: '',
        priority: 'medium',
        dueDate: '',
        project: '',
      });
    }
    setErrors({});
  }, [editingTask, isOpen]);

  const validateField = useCallback((name: string, value: string): string => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Vazifa nomi majburiy';
        if (value.length < 3) return 'Vazifa nomi kamida 3 ta belgidan iborat bo\'lishi kerak';
        return '';
      case 'assignee':
        if (!value) return 'Javobgar shaxsni tanlang';
        return '';
      case 'dueDate':
        if (!value) return 'Tugash sanasini kiriting';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'Tugash sanasi bugundan oldingi sana bo\'lmasligi kerak';
        return '';
      default:
        return '';
    }
  }, []);

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
    
    ['title', 'assignee', 'dueDate'].forEach(key => {
      const error = validateField(key, formData[key as keyof TaskFormData]);
      if (error) {
        newErrors[key] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const isFormValid = useCallback((): boolean => {
    return Boolean(formData.title && formData.assignee && formData.dueDate) && !Object.keys(errors).some(key => errors[key]);
  }, [formData, errors]);

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
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      dueDate: '',
      project: '',
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  const isEditing = !!editingTask;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            {isEditing ? 'Vazifani tahrirlash' : 'Yangi vazifa yaratish'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Vazifa ma\'lumotlarini yangilang' 
              : 'Yangi vazifa uchun barcha kerakli ma\'lumotlarni kiriting'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title">
                Vazifa nomi <span className="text-danger">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Vazifa nomini kiriting"
                className={errors.title ? 'border-danger focus:border-danger' : ''}
              />
              {errors.title && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.title}
                </motion.div>
              )}
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Tavsif</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Vazifa haqida batafsil ma'lumot"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">
                Javobgar <span className="text-danger">*</span>
              </Label>
              <Select value={formData.assignee} onValueChange={(value: string) => handleFieldChange('assignee', value)}>
                <SelectTrigger className={errors.assignee ? 'border-danger focus:border-danger' : ''}>
                  <SelectValue placeholder="Javobgar shaxsni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEES.map((emp) => (
                    <SelectItem key={emp.value} value={emp.value}>
                      {emp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignee && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.assignee}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Muhimlik darajasi</Label>
              <Select value={formData.priority} onValueChange={(value: string) => handleFieldChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Past</SelectItem>
                  <SelectItem value="medium">O'rta</SelectItem>
                  <SelectItem value="high">Yuqori</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Tugash sanasi <span className="text-danger">*</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={errors.dueDate ? 'border-danger focus:border-danger' : ''}
              />
              {errors.dueDate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-danger"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.dueDate}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Loyiha</Label>
              <Select value={formData.project} onValueChange={(value: string) => handleFieldChange('project', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Loyihani tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECTS.map((project) => (
                    <SelectItem key={project.value} value={project.value}>
                      {project.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  {isEditing ? 'Saqlash' : 'Yaratish'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}