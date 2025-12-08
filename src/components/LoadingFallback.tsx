import { motion } from 'framer-motion';

import { ANIMATION } from '../constants/app';

interface LoadingFallbackProps {
  message?: string;
}

export function LoadingFallback({
  message = 'Yuklanmoqda...',
}: LoadingFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <motion.div
        className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: ANIMATION.DURATION_SPINNER,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.p
        className="mt-4 text-lg text-gray-600 dark:text-gray-400 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ANIMATION.DELAY_MEDIUM }}
      >
        {message}
      </motion.p>
      <motion.div
        className="mt-2 text-sm text-gray-500 dark:text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: ANIMATION.DELAY_XLARGE }}
      >
        Iltimos, kuting...
      </motion.div>
    </div>
  );
}
