/**
 * Unit tests for the PizzaCard component.
 *
 * Covers:
 *  - Renders the pizza name
 *  - Renders the formatted price (₹{price})
 *  - Renders the correct veg / non-veg badge
 *  - Clicking "Add to Cart" calls onAdd exactly once with the correct menuItem
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
    render(<PizzaCard menuItem={mockVegPizza} onAdd={vi.fn()} />);
    expect(screen.getByText('Margherita')).toBeInTheDocument();
  });

  it('renders the formatted price with ₹ symbol', () => {
    render(<PizzaCard menuItem={mockVegPizza} onAdd={vi.fn()} />);
    expect(screen.getByText('₹299')).toBeInTheDocument();
  });

  it('renders "🟢 Veg" badge for a veg item', () => {
    render(<PizzaCard menuItem={mockVegPizza} onAdd={vi.fn()} />);
    expect(screen.getByText('🟢 Veg')).toBeInTheDocument();
  });

  it('renders "🔴 Non-Veg" badge for a non-veg item', () => {
    render(<PizzaCard menuItem={mockNonVegPizza} onAdd={vi.fn()} />);
    expect(screen.getByText('🔴 Non-Veg')).toBeInTheDocument();
  });
});

describe('PizzaCard – interactions', () => {
  let onAdd: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onAdd = vi.fn();
  });

  it('clicking "Add to Cart" calls onAdd exactly once with the correct menuItem', async () => {
    const user = userEvent.setup();
    render(<PizzaCard menuItem={mockVegPizza} onAdd={onAdd} />);

    // aria-label is "Add Margherita to cart" — match with specific name
    await user.click(screen.getByRole('button', { name: /add margherita to cart/i }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(mockVegPizza);
  });

  it('clicking "Add to Cart" multiple times calls onAdd each time', async () => {
    const user = userEvent.setup();
    render(<PizzaCard menuItem={mockNonVegPizza} onAdd={onAdd} />);

    // aria-label is "Add Pepperoni to cart" — match with specific name
    const btn = screen.getByRole('button', { name: /add pepperoni to cart/i });
    await user.click(btn);
    await user.click(btn);

    expect(onAdd).toHaveBeenCalledTimes(2);
    expect(onAdd).toHaveBeenNthCalledWith(1, mockNonVegPizza);
    expect(onAdd).toHaveBeenNthCalledWith(2, mockNonVegPizza);
  });
});
