import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Users,
  X,
} from 'lucide-react';

import { Button } from '../ui/Button';

/**
 * Onboarding slide ma'lumotlari
 */
interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image?: string;
}

/**
 * OnboardingFlow Props
 */
export interface OnboardingFlowProps {
  /** Onboarding ochiq/yopiqligini aniqlaydi */
  isOpen: boolean;
  /** Onboarding tugaganda chaqiriladigan funksiya */
  onComplete: () => void;
  /** Onboarding yopilganda chaqiriladigan funksiya */
  onSkip: () => void;
}

/**
 * Onboarding slides
 */
const slides: OnboardingSlide[] = [
  {
    id: 'welcome',
    title: 'Boshqaruv.uz ga xush kelibsiz!',
    description:
      'Biznes jarayonlaringizni samarali boshqaring. Vazifalar, xodimlar va hisobotlarni bir joyda kuzating.',
    icon: LayoutDashboard,
  },
  {
    id: 'tasks',
    title: 'Vazifalarni boshqaring',
    description:
      "Vazifalar yarating, mas'ul shaxslarni belgilang va bajarilish jarayonini kuzating. Real-time yangilanishlar bilan doimo xabardor bo'ling.",
    icon: ClipboardList,
  },
  {
    id: 'employees',
    title: 'Xodimlarni kuzating',
    description:
      'Xodimlar davomat, smenalar va jarimalarni bir joyda boshqaring. Tizimli hisobotlar olish imkoniyati.',
    icon: Users,
  },
  {
    id: 'ready',
    title: 'Hammasi tayyor!',
    description:
      "Endi siz Boshqaruv.uz platformasidan to'liq foydalanishingiz mumkin. Muvaffaqiyatlar!",
    icon: CheckCircle2,
  },
];

/**
 * OnboardingFlow komponenti - Yangi foydalanuvchilar uchun kirishma
 *
 * Bu komponent birinchi marta kirgan foydalanuvchilarga platformani
 * tanishtiradi va asosiy funksiyalarni ko'rsatadi.
 *
 * @example
 * ```tsx
 * const [showOnboarding, setShowOnboarding] = useState(() => {
 *   return !localStorage.getItem('onboarding-completed');
 * });
 *
 * const handleComplete = () => {
 *   localStorage.setItem('onboarding-completed', 'true');
 *   setShowOnboarding(false);
 * };
 *
 * return (
 *   <OnboardingFlow
 *     isOpen={showOnboarding}
 *     onComplete={handleComplete}
 *     onSkip={handleComplete}
 *   />
 * );
 * ```
 */
export function OnboardingFlow({
  isOpen,
  onComplete,
  onSkip,
}: OnboardingFlowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const isLastSlide = currentSlide === slides.length - 1;
  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

      {/* Onboarding Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
        >
          {/* Skip Button */}
          <div className="flex justify-end p-4">
            <button
              onClick={onSkip}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="O'tkazib yuborish"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Slide Content */}
          <div className="px-8 pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30"
                >
                  <Icon className="w-12 h-12 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  {slide.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-300 text-lg max-w-md mb-8"
                >
                  {slide.description}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 bg-blue-600'
                      : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                  }`}
                  aria-label={`Slide ${index + 1} ga o'tish`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="flex-1"
              >
                Orqaga
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                className="flex-1"
                rightIcon={
                  !isLastSlide ? (
                    <ChevronRight className="w-5 h-5" />
                  ) : undefined
                }
              >
                {isLastSlide ? 'Boshlash' : 'Keyingisi'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/**
 * useOnboarding - Onboarding holatini boshqarish uchun hook
 *
 * LocalStorage'dan foydalanib, foydalanuvchi onboarding'ni
 * ko'rgan/ko'rmaganligini kuzatadi.
 *
 * @example
 * ```tsx
 * const { isOpen, complete, skip } = useOnboarding();
 *
 * return (
 *   <OnboardingFlow
 *     isOpen={isOpen}
 *     onComplete={complete}
 *     onSkip={skip}
 *   />
 * );
 * ```
 */
export function useOnboarding() {
  const STORAGE_KEY = 'boshqaruv-onboarding-completed';

  const [isOpen, setIsOpen] = useState(() => {
    try {
      const completed = localStorage.getItem(STORAGE_KEY);
      return completed !== 'true';
    } catch {
      return true;
    }
  });

  const complete = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsOpen(false);
    } catch {
      setIsOpen(false);
    }
  };

  const skip = () => {
    complete();
  };

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setIsOpen(true);
    } catch {
      setIsOpen(true);
    }
  };

  return {
    isOpen,
    complete,
    skip,
    reset,
  };
}
