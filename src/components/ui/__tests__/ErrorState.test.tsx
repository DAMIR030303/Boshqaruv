import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ErrorState } from '../ErrorState';

describe('ErrorState Component', () => {
  it('renders with default variant', () => {
    render(<ErrorState />);
    expect(screen.getByText(/Xatolik yuz berdi/i)).toBeInTheDocument();
  });

  it('renders with 404 variant', () => {
    render(<ErrorState variant="404" />);
    expect(screen.getByText(/Sahifa topilmadi/i)).toBeInTheDocument();
  });

  it('renders with 500 variant', () => {
    render(<ErrorState variant="500" />);
    expect(screen.getByText(/Server xatosi/i)).toBeInTheDocument();
  });

  it('renders with network variant', () => {
    render(<ErrorState variant="network" />);
    expect(screen.getByText(/Internet aloqasi yo'q/i)).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<ErrorState title="Custom Error" />);
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
  });

  it('renders with custom description', () => {
    render(<ErrorState description="Custom error description" />);
    expect(screen.getByText('Custom error description')).toBeInTheDocument();
  });

  it('renders error code when provided', () => {
    render(<ErrorState errorCode={404} />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);

    const retryButton = screen.getByText(/Qayta urinish/i);
    fireEvent.click(retryButton);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onHome when home button is clicked', () => {
    const handleHome = vi.fn();
    render(<ErrorState onHome={handleHome} />);

    const homeButton = screen.getByText(/Bosh sahifaga qaytish/i);
    fireEvent.click(homeButton);

    expect(handleHome).toHaveBeenCalledTimes(1);
  });

  it('renders both retry and home buttons when both handlers are provided', () => {
    render(<ErrorState onRetry={() => {}} onHome={() => {}} />);
    expect(screen.getByText(/Qayta urinish/i)).toBeInTheDocument();
    expect(screen.getByText(/Bosh sahifaga qaytish/i)).toBeInTheDocument();
  });

  it('does not render buttons when handlers are not provided', () => {
    render(<ErrorState />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies compact mode', () => {
    render(<ErrorState compact />);
    const container = screen.getByText(/Xatolik yuz berdi/i).closest('div');
    expect(container).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<ErrorState className="custom-class" />);
    const container = screen.getByText(/Xatolik yuz berdi/i).closest('div');
    expect(container).toHaveClass('custom-class');
  });
});
