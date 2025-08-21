// import React from 'react';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

interface PlaceholderComponentProps {
  title: string;
  description?: string;
}

export function PlaceholderComponent({ title, description = "Bu sahifa hali ishlab chiqilmoqda" }: PlaceholderComponentProps) {
  return (
    <div className="mobile-content">
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction className="w-12 h-12 text-gray-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {description}
        </p>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Bu sahifa tez orada ishlab chiqiladi. Iltimos, keyinroq qaytib keling.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
