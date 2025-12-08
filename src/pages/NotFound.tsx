import { ErrorState } from '../components/ui/ErrorState';

/**
 * NotFound - 404 sahifa komponenti props
 */
interface NotFoundProps {
  /** Navigatsiya handler */
  onNavigate?: (tab: string) => void;
}

/**
 * NotFound - 404 sahifa komponenti
 *
 * Bu komponent noto'g'ri URL yoki mavjud bo'lmagan sahifaga
 * kirishga urinilganda ko'rsatiladi.
 */
export function NotFound({ onNavigate }: NotFoundProps) {
  const handleGoHome = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <ErrorState
        variant="404"
        errorCode={404}
        onHome={handleGoHome}
        title="Sahifa topilmadi"
        description="Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan. Bosh sahifaga qayting yoki boshqa sahifani tanlang."
      />
    </div>
  );
}
