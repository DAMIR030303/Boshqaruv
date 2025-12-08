import type { ReactNode } from 'react';

import { motion, useReducedMotion } from 'framer-motion';

import { ANIMATION } from '../../constants/app';

/**
 * AnimatedSection komponenti props
 */
interface AnimatedSectionProps {
  /** Kontent */
  children: ReactNode;
  /** Animatsiya variant'i */
  variant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight';
  /** Delay (millisekundlarda) */
  delay?: number;
  /** Qo'shimcha className */
  className?: string;
}

/**
 * Animatsiya variant'lari
 */
const animationVariants = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
  },
} as const;

/**
 * AnimatedSection - Umumiy animatsiya wrapper
 *
 * Bu komponent takrorlangan animatsiya pattern'larini
 * birlashtiradi va kod takrorlanishini kamaytiradi.
 *
 * @param props - AnimatedSectionProps
 * @returns JSX element
 */
export function AnimatedSection({
  children,
  variant = 'fadeUp',
  delay = 0,
  className,
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = animationVariants[variant];

  // Android WebView uchun fallback - agar motion ishlamasa, oddiy div
  try {
    // Reduced motion yoki motion ishlamasa, oddiy div qaytarish
    if (prefersReducedMotion) {
      return <div className={className}>{children}</div>;
    }

    return (
      <motion.div
        className={className}
        initial={variants.initial}
        animate={variants.animate}
        transition={{
          duration:
            variant === 'fadeIn'
              ? ANIMATION.DURATION_MEDIUM
              : ANIMATION.DURATION_LONG,
          delay,
        }}
      >
        {children}
      </motion.div>
    );
  } catch (error) {
    // Motion xatosi bo'lsa, fallback
    console.warn('[AnimatedSection] Motion error, using fallback:', error);
    return <div className={className}>{children}</div>;
  }
}
