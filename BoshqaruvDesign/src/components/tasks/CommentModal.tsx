import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { MessageSquare, Send, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (comment: string) => void;
  taskTitle: string;
}

export function CommentModal({ isOpen, onClose, onSave, taskTitle }: CommentModalProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateComment = useCallback((value: string): string => {
    if (!value.trim()) return 'Izoh matni majburiy';
    if (value.length < 3) return 'Izoh kamida 3 ta belgidan iborat bo\'lishi kerak';
    if (value.length > 500) return 'Izoh 500 ta belgidan oshmasligi kerak';
    return '';
  }, []);

  const handleCommentChange = useCallback((value: string) => {
    setComment(value);
    
    if (error) {
      setError('');
    }
    
    // Real-time validation
    setTimeout(() => {
      const validationError = validateComment(value);
      if (validationError) {
        setError(validationError);
      }
    }, 500);
  }, [error, validateComment]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateComment(comment);
    if (validationError) {
      setError(validationError);
      toast.error('Iltimos, izohni to\'g\'ri kiriting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(comment);
      handleClose();
    } catch (error) {
      toast.error('Xatolik yuz berdi, qaytadan urinib ko\'ring');
    } finally {
      setIsSubmitting(false);
    }
  }, [comment, validateComment, onSave]);

  const handleClose = useCallback(() => {
    setComment('');
    setError('');
    setIsSubmitting(false);
    onClose();
  }, [onClose]);

  const isFormValid = comment.trim() && !error && !isSubmitting;
  const characterCount = comment.length;
  const characterLimit = 500;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Izoh qoldirish
          </DialogTitle>
          <DialogDescription className="text-left">
            <span className="font-medium">{taskTitle}</span> vazifahga izoh qoldiring
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="comment">
              Izoh matni <span className="text-danger">*</span>
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder="Vazifa haqida fikr, taklif yoki savollaringizni yozing..."
              rows={4}
              className={error ? 'border-danger focus:border-danger' : ''}
              maxLength={characterLimit}
            />
            
            {/* Character counter */}
            <div className="flex justify-between items-center">
              <div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-danger"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {error}
                  </motion.div>
                )}
              </div>
              <div className={`text-xs ${characterCount > characterLimit * 0.9 ? 'text-warning' : 'text-muted-foreground'}`}>
                {characterCount}/{characterLimit}
              </div>
            </div>
          </div>

          {/* Sample comments for context */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Misol izohlar:</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>• "Dizayn mockup'lari tayyor, keyingi bosqichga o'tishimiz mumkin"</div>
              <div>• "Ushbu vazifada qo'shimcha ma'lumot kerak bo'ladi"</div>
              <div>• "Deadline'ni 2 kunga uzaytirishni taklif qilaman"</div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={!isFormValid} className="min-w-24">
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Izoh yuborish
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}