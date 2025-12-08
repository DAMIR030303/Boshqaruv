import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, ThumbsUp, ThumbsDown } from 'lucide-react';

import { Button } from '../ui/Button';

/**
 * Feedback turi
 */
type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';

/**
 * Feedback ma'lumotlari
 */
interface FeedbackData {
  type: FeedbackType;
  rating?: number;
  message: string;
  userEmail?: string;
  page?: string;
  timestamp: string;
}

/**
 * FeedbackWidget Props
 */
export interface FeedbackWidgetProps {
  /** Widget'ni yopish handler */
  onClose?: () => void;
  /** Feedback yuborilganda */
  onSubmit?: (feedback: FeedbackData) => Promise<void>;
}

/**
 * FeedbackWidget komponenti - Foydalanuvchi fikr-mulohazalari
 *
 * Bu komponent foydalanuvchilarga feedback yuborish imkoniyatini beradi:
 * - Bug xabarlari
 * - Feature so'rovlari
 * - Umumiy fikr-mulohazalar
 *
 * @example
 * ```tsx
 * const { isOpen, open, close } = useFeedbackWidget();
 *
 * <FeedbackWidget isOpen={isOpen} onClose={close} />
 * ```
 */
export function FeedbackWidget({ onClose, onSubmit }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'rating' | 'form' | 'success'>('rating');
  const [rating, setRating] = useState<number | null>(null);
  const [type, setType] = useState<FeedbackType>('other');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setStep('rating');
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('rating');
    setRating(null);
    setMessage('');
    setEmail('');
    onClose?.();
  };

  const handleRating = (value: number) => {
    setRating(value);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      const feedbackData: FeedbackData = {
        type,
        rating: rating || undefined,
        message: message.trim(),
        userEmail: email.trim() || undefined,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      };

      // Send to backend or analytics
      await onSubmit?.(feedbackData);

      // Log to console for now (replace with actual API call)
      console.log('Feedback submitted:', feedbackData);

      // Success state
      setStep('success');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOpen}
          className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
          aria-label="Feedback yuborish"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[90vw] max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {step === 'rating' && 'Dasturni baholang'}
                  {step === 'form' && 'Fikringiz bizga muhim'}
                  {step === 'success' && 'Rahmat!'}
                </h3>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Step 1: Rating */}
                {step === 'rating' && (
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      Dastur sizga yoqdimi?
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleRating(1)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <ThumbsDown className="w-12 h-12 text-red-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Yoqmadi
                        </span>
                      </button>
                      <button
                        onClick={() => handleRating(5)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <ThumbsUp className="w-12 h-12 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Yoqdi
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Form */}
                {step === 'form' && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feedback turi
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'bug', label: 'Bug' },
                          { value: 'feature', label: 'Feature' },
                          { value: 'improvement', label: 'Yaxshilash' },
                          { value: 'other', label: 'Boshqa' },
                        ].map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setType(option.value as FeedbackType)
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              type === option.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Xabar *
                      </label>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Fikringizni yozing..."
                        required
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Email (optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email (ixtiyoriy)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting || !message.trim()}
                      fullWidth
                      isLoading={isSubmitting}
                      rightIcon={<Send className="w-4 h-4" />}
                    >
                      {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
                    </Button>
                  </form>
                )}

                {/* Step 3: Success */}
                {step === 'success' && (
                  <div className="text-center space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                    >
                      <ThumbsUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      Rahmat!
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Fikr-mulohazangiz uchun rahmat. Biz uni ko'rib chiqamiz va
                      dasturni yaxshilashga harakat qilamiz.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * useFeedbackWidget - Feedback widget holatini boshqarish
 *
 * @example
 * ```tsx
 * const { isOpen, open, close } = useFeedbackWidget();
 *
 * return (
 *   <>
 *     <Button onClick={open}>Feedback</Button>
 *     <FeedbackWidget isOpen={isOpen} onClose={close} />
 *   </>
 * );
 * ```
 */
export function useFeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
