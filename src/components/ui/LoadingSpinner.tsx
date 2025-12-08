/**
 * LoadingSpinner komponenti props
 */
interface LoadingSpinnerProps {
  /** Spinner o'lchami (px) */
  size?: number;
  /** Xabar matni */
  message?: string;
  /** Qo'shimcha className */
  className?: string;
}

/**
 * LoadingSpinner - Umumiy loading spinner komponenti
 *
 * Bu komponent takrorlangan loading spinner pattern'ini
 * birlashtiradi va kod takrorlanishini kamaytiradi.
 *
 * @param props - LoadingSpinnerProps
 * @returns JSX element
 */
export function LoadingSpinner({
  size = 64,
  message,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
      {message && (
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  );
}
