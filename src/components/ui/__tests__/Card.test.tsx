import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card, CardHeader, CardSubtitle, CardTitle } from '../Card';

describe('Card Component', () => {
  it('renders with children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies default padding', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('p-4', 'sm:p-5', 'lg:p-6');
  });

  it('applies none padding when specified', () => {
    const { container } = render(<Card padding="none">Content</Card>);
    const card = container.querySelector('.card');
    expect(card).not.toHaveClass('p-3', 'p-4', 'p-5', 'p-6', 'p-8');
  });

  it('applies sm padding when specified', () => {
    const { container } = render(<Card padding="sm">Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('p-3', 'sm:p-4');
  });

  it('applies lg padding when specified', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('p-5', 'sm:p-6', 'lg:p-8');
  });

  it('applies elevated class when elevated prop is true', () => {
    const { container } = render(<Card elevated>Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('card-elevated');
  });

  it('applies hoverable class when hoverable prop is true', () => {
    const { container } = render(<Card hoverable>Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('card-hover');
  });

  it('combines custom className with default classes', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('custom-class');
  });

  it('renders CardHeader component', () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
      </Card>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('renders CardTitle component', () => {
    render(
      <Card>
        <CardTitle>Title</CardTitle>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Title').tagName).toBe('H3');
  });

  it('renders CardSubtitle component', () => {
    render(
      <Card>
        <CardSubtitle>Subtitle</CardSubtitle>
      </Card>
    );
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Subtitle').tagName).toBe('P');
  });
});
