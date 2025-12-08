import { useCallback, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  FileBarChart,
  FileText,
  Loader2,
  Search,
  Users,
  X,
} from 'lucide-react';

import { type SearchResult, SearchService } from '../../services/searchService';
import type { ApiResponse } from '../../types';
import { EmptyState } from '../ui/EmptyState';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (url: string) => void;
}

/**
 * Qidiruv dropdown komponenti
 *
 * Bu komponent vazifalar, xodimlar va hisobotlar bo'yicha
 * qidiruv funksiyasini ta'minlaydi. Dropdown uslubida ishlaydi.
 */
export function SearchModal({ isOpen, onClose, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Qidiruv funksiyasi
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response: ApiResponse<SearchResult[]> =
        await SearchService.search(searchQuery);

      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError(response.error || 'Qidiruvda xatolik yuz berdi');
        setResults([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Qidiruvda xatolik yuz berdi'
      );
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // ESC tugmasi bilan yopish
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Click outside - backdrop orqali hal qilinadi

  // Input'ga focus qilish
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Modal yopilganda tozalash
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  // Natijani bosish
  const handleResultClick = (result: SearchResult) => {
    if (onNavigate) {
      onNavigate(result.url);
    }
    onClose();
    setQuery('');
    setResults([]);
  };

  // Icon olish
  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'task':
        return <FileText className="w-5 h-5" />;
      case 'employee':
        return <Users className="w-5 h-5" />;
      case 'report':
        return <FileBarChart className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // Type label olish
  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'task':
        return 'Vazifa';
      case 'employee':
        return 'Xodim';
      case 'report':
        return 'Hisobot';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for click outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40"
            onClick={onClose}
          />

          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[70vh] flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-dropdown-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <h2 id="search-dropdown-title" className="sr-only">
                Qidiruv
              </h2>
              <div className="flex items-center space-x-2 flex-1">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Qidirish..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                />
                {isLoading && (
                  <Loader2 className="w-4 h-4 text-primary-500 animate-spin flex-shrink-0" />
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors ml-2"
                aria-label="Yopish"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
              {error && (
                <div className="text-center py-6 px-4 text-sm text-red-500 dark:text-red-400">
                  {error}
                </div>
              )}

              {!error && query.trim().length < 2 && (
                <div className="text-center py-6 px-4 text-sm text-gray-500 dark:text-gray-400">
                  Qidirish uchun kamida 2 belgi kiriting
                </div>
              )}

              {!error &&
                query.trim().length >= 2 &&
                !isLoading &&
                results.length === 0 && (
                  <EmptyState
                    variant="search"
                    compact
                    title="Natijalar topilmadi"
                    description="Qidiruv natijalari topilmadi. Boshqa kalit so'zlar bilan qayta urinib ko'ring."
                    onAction={undefined}
                  />
                )}

              {results.length > 0 && (
                <div className="py-2">
                  {results.map(result => (
                    <motion.button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors flex items-start space-x-3"
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex-shrink-0 mt-0.5 text-primary-500">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-0.5">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {result.title}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded flex-shrink-0">
                            {getTypeLabel(result.type)}
                          </span>
                        </div>
                        {result.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - klaviatura ko'rsatmalari */}
            <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>ESC - yopish</span>
                <span>Enter - tanlash</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
