/**
 * Unit tests for the PizzaCard component.
 *
 * Covers:
 *  - Renders the pizza name
 *  - Renders the formatted price (₹{price})
 *  - Renders the correct veg / non-veg badge
 *  - Clicking "Add to Cart" calls onCardClick exactly once with the correct menuItem
 *  - Clicking the card body calls onCardClick
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PizzaCard from '../components/PizzaCard';
import type { MenuItem } from '../types';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockVegPizza: MenuItem = {
  id: 'pizza-veg-001',
  name: 'Margherita',
  description: 'Classic Italian pizza with fresh tomato sauce and mozzarella.',
  price: 299,
  tag: 'veg',
  imageAlt: 'Margherita pizza',
};

const mockNonVegPizza: MenuItem = {
  id: 'pizza-nv-001',
  name: 'Pepperoni',
  description: 'Loaded with generous slices of spicy pepperoni.',
  price: 449,
  tag: 'non-veg',
  imageAlt: 'Pepperoni pizza',
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PizzaCard – rendering', () => {
  it('renders the pizza name', () => {
    render(<PizzaCard menuItem={mockVegPizza} onCardClick={vi.fn()} />);
    expect(screen.getByText('Margherita')).toBeInTheDocument();
  });

  it('renders the formatted price with ₹ symbol', () => {
    render(<PizzaCard menuItem={mockVegPizza} onCardClick={vi.fn()} />);
    expect(screen.getByText('₹299')).toBeInTheDocument();
  });

  it('renders "🟢 Veg" badge for a veg item', () => {
    render(<PizzaCard menuItem={mockVegPizza} onCardClick={vi.fn()} />);
    expect(screen.getByText('🟢 Veg')).toBeInTheDocument();
  });

  it('renders "🔴 Non-Veg" badge for a non-veg item', () => {
    render(<PizzaCard menuItem={mockNonVegPizza} onCardClick={vi.fn()} />);
    expect(screen.getByText('🔴 Non-Veg')).toBeInTheDocument();
  });
});

describe('PizzaCard – interactions', () => {
  let onCardClick: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onCardClick = vi.fn();
  });

  it('clicking "Add to Cart" calls onCardClick exactly once with the correct menuItem', async () => {
    const user = userEvent.setup();
    render(<PizzaCard menuItem={mockVegPizza} onCardClick={onCardClick} />);

    // aria-label is "Add Margherita to cart" — match with specific name
    await user.click(screen.getByRole('button', { name: /add margherita to cart/i }));

    expect(onCardClick).toHaveBeenCalledTimes(1);
    expect(onCardClick).toHaveBeenCalledWith(mockVegPizza);
  });

  it('clicking "Add to Cart" multiple times calls onCardClick each time', async () => {
    const user = userEvent.setup();
    render(<PizzaCard menuItem={mockNonVegPizza} onCardClick={onCardClick} />);

    // aria-label is "Add Pepperoni to cart" — match with specific name
    const btn = screen.getByRole('button', { name: /add pepperoni to cart/i });
    await user.click(btn);
    await user.click(btn);

    expect(onCardClick).toHaveBeenCalledTimes(2);
    expect(onCardClick).toHaveBeenNthCalledWith(1, mockNonVegPizza);
    expect(onCardClick).toHaveBeenNthCalledWith(2, mockNonVegPizza);
  });

  it('clicking the card body calls onCardClick with the correct menuItem', async () => {
    const user = userEvent.setup();
    render(<PizzaCard menuItem={mockVegPizza} onCardClick={onCardClick} />);

    // Click the article element (card body) — use the pizza name heading as target
    await user.click(screen.getByText('Margherita'));

    expect(onCardClick).toHaveBeenCalledTimes(1);
    expect(onCardClick).toHaveBeenCalledWith(mockVegPizza);
  });
});
