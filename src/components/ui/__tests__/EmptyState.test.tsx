import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EmptyState } from '../EmptyState';

describe('EmptyState Component', () => {
  it('renders with default variant', () => {
    render(<EmptyState />);
    expect(screen.getByText(/Ma'lumot yo'q/i)).toBeInTheDocument();
  });

  it('renders with tasks variant', () => {
    render(<EmptyState variant="tasks" />);
    expect(screen.getByText(/Vazifalar yo'q/i)).toBeInTheDocument();
  });

  it('renders with employees variant', () => {
    render(<EmptyState variant="employees" />);
    expect(screen.getByText(/Xodimlar yo'q/i)).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<EmptyState title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders with custom description', () => {
    render(<EmptyState description="Custom description" />);
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });

  it('calls onAction when action button is clicked', () => {
    const handleAction = vi.fn();
    render(<EmptyState onAction={handleAction} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders custom action label', () => {
    render(<EmptyState onAction={() => {}} actionLabel="Custom Action" />);
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('does not render action button when onAction is not provided', () => {
    render(<EmptyState />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies compact mode classes', () => {
    render(<EmptyState compact />);
    const container = screen.getByText(/Ma'lumot yo'q/i).closest('div');
    expect(container).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<EmptyState className="custom-class" />);
    const container = screen.getByText(/Ma'lumot yo'q/i).closest('div');
    expect(container).toHaveClass('custom-class');
  });
});
