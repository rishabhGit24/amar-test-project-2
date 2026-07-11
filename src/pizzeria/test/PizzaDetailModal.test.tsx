/**
 * RTL integration tests for the PizzaDetailModal component.
 *
 * Covers:
 *  - Rendering: name, description, veg tag, three size pills, default Medium selection, default price
 *  - Size selection: live price updates for Small (×0.8) and Large (×1.3)
 *  - Quantity stepper: floor at 1, increment, decrement
 *  - Add to cart: correct CartItem written to store (size, effectivePrice, quantity), onClose called
 *  - Deduplication: adding same pizza+size twice increments quantity
 *  - Keyboard: Escape calls onClose
 *  - Null menuItem: renders nothing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PizzaDetailModal from '../components/PizzaDetailModal';
import { useCartStore } from '../hooks/useCartStore';
import type { MenuItem } from '../types';

// ── Fixture ───────────────────────────────────────────────────────────────────

const mockPizza: MenuItem = {
  id: 'pizza-001',
  name: 'Margherita',
  price: 299,
  tag: 'veg',
  description: 'Classic Italian pizza with fresh tomato sauce and mozzarella.',
  imageAlt: 'Margherita pizza with golden cheese and fresh basil',
};

// ── Helper ────────────────────────────────────────────────────────────────────

function renderModal(pizza: MenuItem | null = mockPizza, onClose = vi.fn()) {
  return { onClose, ...render(<PizzaDetailModal menuItem={pizza} onClose={onClose} />) };
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  useCartStore.setState({ items: [], totalCount: 0, grandTotal: 0 });
  localStorage.clear();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PizzaDetailModal – rendering', () => {
  it('renders pizza name', () => {
    renderModal();
    expect(screen.getByText('Margherita')).toBeInTheDocument();
  });

  it('renders description', () => {
    renderModal();
    expect(
      screen.getByText('Classic Italian pizza with fresh tomato sauce and mozzarella.'),
    ).toBeInTheDocument();
  });

  it('renders veg tag for veg pizza', () => {
    renderModal();
    expect(screen.getByText('🟢 Veg')).toBeInTheDocument();
  });

  it('renders three size pills: Small, Medium, Large', () => {
    renderModal();
    expect(screen.getByRole('button', { name: 'Small' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Medium' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Large' })).toBeInTheDocument();
  });

  it('Medium pill is selected by default (aria-pressed=true)', () => {
    renderModal();
    const mediumBtn = screen.getByRole('button', { name: 'Medium' });
    expect(mediumBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Small' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Large' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('default price shown is base price (₹299)', () => {
    renderModal();
    expect(screen.getByText('₹299')).toBeInTheDocument();
  });
});

describe('PizzaDetailModal – size selection', () => {
  it('clicking Small updates price to ₹239', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: 'Small' }));

    // Math.round(299 × 0.8) = 239
    expect(screen.getByText('₹239')).toBeInTheDocument();
  });

  it('clicking Large updates price to ₹389', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: 'Large' }));

    // Math.round(299 × 1.3) = 389
    expect(screen.getByText('₹389')).toBeInTheDocument();
  });

  it('clicking Medium after Large resets price to ₹299', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: 'Large' }));
    expect(screen.getByText('₹389')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Medium' }));
    expect(screen.getByText('₹299')).toBeInTheDocument();
  });

  it('selected pill has aria-pressed=true; others have aria-pressed=false', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: 'Large' }));

    expect(screen.getByRole('button', { name: 'Large' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Small' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Medium' })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('PizzaDetailModal – quantity stepper', () => {
  it('initial quantity is 1', () => {
    renderModal();
    // The quantity value is displayed in a span with aria-live
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('clicking + increments quantity to 2', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('clicking − at quantity=1 does not go below 1', async () => {
    const user = userEvent.setup();
    renderModal();

    // The decrement button is disabled at qty=1
    const decrementBtn = screen.getByRole('button', { name: 'Decrease quantity' });
    expect(decrementBtn).toBeDisabled();

    // Attempt to click anyway (should be a no-op)
    await user.click(decrementBtn).catch(() => {
      // userEvent may throw on disabled buttons — that's fine
    });

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('clicking + then − returns to 1', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(screen.getByText('2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});

describe('PizzaDetailModal – add to cart', () => {
  it('clicking Add to Cart with default settings (Medium, qty=1) inserts one line with size Medium and effectivePrice 299', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].size).toBe('Medium');
    expect(items[0].effectivePrice).toBe(299);
    expect(items[0].quantity).toBe(1);
    expect(items[0].menuItem.id).toBe('pizza-001');
  });

  it('clicking Add to Cart with Large selected inserts line with size Large and effectivePrice 389', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: 'Large' }));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].size).toBe('Large');
    expect(items[0].effectivePrice).toBe(389);
    expect(items[0].quantity).toBe(1);
  });

  it('clicking Add to Cart with qty=2 inserts a line with quantity 2 in the store', async () => {
    const user = userEvent.setup();
    renderModal();

    // Increment quantity to 2
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    expect(items[0].size).toBe('Medium');
    expect(items[0].effectivePrice).toBe(299);
  });

  it('clicking Add to Cart calls onClose', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('adding same pizza twice in Medium increments quantity to 2 (dedup by id+size)', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    // First render + add
    const { unmount } = render(
      <PizzaDetailModal menuItem={mockPizza} onClose={onClose} />,
    );
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    unmount();

    // Second render + add (onClose was called, simulating re-open)
    render(<PizzaDetailModal menuItem={mockPizza} onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    expect(items[0].size).toBe('Medium');
  });
});

describe('PizzaDetailModal – keyboard', () => {
  it('pressing Escape calls onClose', () => {
    const { onClose } = renderModal();

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('PizzaDetailModal – null menuItem', () => {
  it('renders nothing when menuItem is null', () => {
    const { container } = renderModal(null);
    expect(container).toBeEmptyDOMElement();
  });
});
