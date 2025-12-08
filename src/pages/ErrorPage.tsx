import { ErrorState } from '../components/ui/ErrorState';

/**
 * ErrorPage - 500 sahifa komponenti props
 */
interface ErrorPageProps {
  /** Navigatsiya handler */
  onNavigate?: (tab: string) => void;
}

/**
 * ErrorPage - 500 sahifa komponenti
 *
 * Bu komponent server xatosi yoki boshqa kritik xatoliklar
 * yuz berganda ko'rsatiladi.
 */
export function ErrorPage({ onNavigate }: ErrorPageProps) {
  const handleGoHome = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <ErrorState
        variant="500"
        errorCode={500}
        onHome={handleGoHome}
        onRetry={handleRetry}
        title="Server xatosi"
        description="Serverda xatolik yuz berdi. Iltimos, biroz vaqt o'tgach qayta urinib ko'ring yoki bosh sahifaga qayting."
      />
    </div>
  );
}
