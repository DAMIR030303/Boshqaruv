import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

/**
 * SuccessAnimation Props
 */
export interface SuccessAnimationProps {
  /** Animation ochiq/yopiqligini aniqlaydi */
  isVisible: boolean;
  /** Animation tugaganda chaqiriladigan funksiya */
  onComplete?: () => void;
  /** Success message */
  message?: string;
  /** Animation turi */
  variant?: 'checkmark' | 'confetti' | 'simple';
  /** Animation davomiyligi (ms) */
  duration?: number;
}

/**
 * SuccessAnimation komponenti - Muvaffaqiyatli amallar uchun animatsiya
 *
 * Bu komponent foydalanuvchiga vizual feedback beradi:
 * - Vazifa bajarilganda
 * - Ma'lumot saqlanganda
 * - Muvaffaqiyatli operatsiyalarda
 *
 * @example
 * ```tsx
 * const [showSuccess, setShowSuccess] = useState(false);
 *
 * const handleSave = async () => {
 *   await saveData();
 *   setShowSuccess(true);
 * };
 *
 * return (
 *   <>
 *     <Button onClick={handleSave}>Save</Button>
 *     <SuccessAnimation
 *       isVisible={showSuccess}
 *       message="Ma'lumot saqlandi!"
 *       onComplete={() => setShowSuccess(false)}
 *     />
 *   </>
 * );
 * ```
 */
export function SuccessAnimation({
  isVisible,
  onComplete,
  message = 'Muvaffaqiyatli!',
  variant = 'checkmark',
  duration = 2000,
}: SuccessAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {variant === 'checkmark' && <CheckmarkAnimation message={message} />}
      {variant === 'confetti' && <ConfettiAnimation message={message} />}
      {variant === 'simple' && <SimpleAnimation message={message} />}
    </div>
  );
}

/**
 * Checkmark Animation - Classic success checkmark
 */
function CheckmarkAnimation({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 pointer-events-auto"
    >
      {/* Checkmark Circle */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
        className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50"
      >
        {/* Checkmark Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </motion.div>

        {/* Ripple Effect */}
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-green-400"
        />
      </motion.div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="text-lg font-semibold text-gray-900 dark:text-white text-center"
      >
        {message}
      </motion.p>
    </motion.div>
  );
}

/**
 * Confetti Animation - Celebratory confetti effect
 */
function ConfettiAnimation({ message }: { message: string }) {
  const confettiColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  return (
    <div className="relative">
      {/* Confetti Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: Math.random() * 400 - 200,
            y: Math.random() * -400 - 100,
            opacity: 0,
            scale: 0,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 1.5,
            delay: Math.random() * 0.2,
            ease: 'easeOut',
          }}
          className={`absolute w-3 h-3 rounded-sm ${
            confettiColors[Math.floor(Math.random() * confettiColors.length)]
          }`}
          style={{
            top: '50%',
            left: '50%',
          }}
        />
      ))}

      {/* Success Message */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 pointer-events-auto"
      >
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-yellow-500" />
          <p className="text-xl font-bold text-gray-900 dark:text-white text-center">
            {message}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Simple Animation - Minimal toast-like animation
 */
function SimpleAnimation({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg pointer-events-auto flex items-center gap-3"
    >
      <Check className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </motion.div>
  );
}

/**
 * useSuccessAnimation - Success animation holatini boshqarish uchun hook
 *
 * @example
 * ```tsx
 * const { show, trigger } = useSuccessAnimation();
 *
 * const handleSave = async () => {
 *   await saveData();
 *   trigger('Ma\'lumot saqlandi!');
 * };
 *
 * return (
 *   <>
 *     <Button onClick={handleSave}>Save</Button>
 *     <SuccessAnimation isVisible={show} message={message} />
 *   </>
 * );
 * ```
 */
export function useSuccessAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('Muvaffaqiyatli!');

  const trigger = (msg?: string) => {
    if (msg) setMessage(msg);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    message,
    trigger,
    hide,
  };
}
