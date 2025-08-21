import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface StatusAnimationProps {
  status: 'processing' | 'success' | 'error';
  progress: number;
  onReset: () => void;
  onOpenExceptionModal: () => void;
}

export function StatusAnimation({ status, progress, onReset, onOpenExceptionModal }: StatusAnimationProps) {
  return (
    <AnimatePresence mode="wait">
      {status === 'processing' && (
        <motion.div
          key="processing"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-center p-8"
        >
          <div className="relative mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Loader2 className="w-16 h-16 text-primary" />
            </motion.div>
            
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full"
                animate={{
                  x: [0, Math.cos(i * 60) * 30, 0],
                  y: [0, Math.sin(i * 60) * 30, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                style={{ left: '50%', top: '50%' }}
              />
            ))}
          </div>

          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="text-lg font-medium mb-2">Tekshirilmoqda...</div>
          </motion.div>
          
          <Progress value={progress} className="w-full h-2 mb-2" />
          <div className="text-sm text-muted-foreground">{progress}%</div>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="text-center p-8"
        >
          <div className="relative mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-16 h-16 mx-auto bg-success rounded-full flex items-center justify-center relative z-10"
            >
              <motion.svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-success-foreground"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeInOut" }}
              >
                <motion.path
                  d="M9 12l2 2 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </motion.div>

            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-2 border-success rounded-full"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: [1, 2, 2.5], opacity: [0.8, 0.2, 0] }}
                transition={{ duration: 2, delay: i * 0.3, ease: "easeOut" }}
              />
            ))}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-lg font-medium text-success mb-2">Muvaffaqiyatli!</div>
            <div className="text-sm text-muted-foreground mb-4">
              Davomat qayd etildi - {new Date().toLocaleTimeString('uz-UZ')}
            </div>
            <Button onClick={onReset} variant="outline">Orqaga</Button>
          </motion.div>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-center p-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0, x: [0, -5, 5, -5, 5, 0] }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-16 h-16 mx-auto mb-6 bg-danger rounded-full flex items-center justify-center"
          >
            <XCircle className="w-8 h-8 text-danger-foreground" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-lg font-medium text-danger mb-2">Xatolik yuz berdi</div>
            <div className="text-sm text-muted-foreground mb-6">
              Iltimos, qaytadan urinib ko'ring yoki boshqa usulni tanlang
            </div>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button onClick={onReset} variant="outline" className="w-full">
              Qaytadan urinish
            </Button>
            <Button variant="ghost" className="w-full" onClick={onOpenExceptionModal}>
              Istisno so'rash
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}