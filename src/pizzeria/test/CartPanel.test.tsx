/**
 * Integration tests for the CartPanel component.
 *
 * These tests use the REAL Zustand store (no mocking of the store internals).
 * The store is reset before every test via setState so each test is isolated.
 *
 * Covers:
 *  - Panel does NOT have pz-cart-panel--open when open={false}
 *  - Panel HAS pz-cart-panel--open when open={true}
 *  - Empty cart renders "Your cart is empty."
 *  - After adding an item via the store, the item name and price are rendered
 *  - Clicking + increments the quantity shown in the panel
 *  - Clicking − when quantity===1 removes the item from the rendered list
 *  - Grand total displays correctly
 *  - Clicking "Clear Cart" empties the rendered list
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartPanel from '../components/CartPanel';
import { useCartStore } from '../hooks/useCartStore';
import type { MenuItem } from '../types';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const margherita: MenuItem = {
  id: 'pizza-001',
  name: 'Margherita',
  description: 'Classic Italian pizza.',
  price: 299,
  tag: 'veg',
  imageAlt: 'Margherita pizza',
};

const pepperoni: MenuItem = {
  id: 'pizza-002',
  name: 'Pepperoni',
  description: 'Spicy pepperoni pizza.',
  price: 449,
  tag: 'non-veg',
  imageAlt: 'Pepperoni pizza',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Render CartPanel with sensible defaults. */
function renderPanel(open = true) {
  const onClose = () => {};
  return render(<CartPanel open={open} onClose={onClose} />);
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  // Reset store to a clean slate before every test
  useCartStore.setState({ items: [], totalCount: 0, grandTotal: 0 });
  localStorage.clear();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CartPanel – open / closed state', () => {
  it('does NOT have class pz-cart-panel--open when open={false}', () => {
    renderPanel(false);
    // The <aside> is always rendered; only the class changes
    const aside = document.querySelector('.pz-cart-panel');
    expect(aside).not.toHaveClass('pz-cart-panel--open');
  });

  it('HAS class pz-cart-panel--open when open={true}', () => {
    renderPanel(true);
    const aside = document.querySelector('.pz-cart-panel');
    expect(aside).toHaveClass('pz-cart-panel--open');
  });
});

describe('CartPanel – empty cart', () => {
  it('renders "Your cart is empty." when the cart has no items', () => {
    renderPanel();
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });
});

describe('CartPanel – item display', () => {
  it('renders the item name and formatted price after adding one item via the store', () => {
    useCartStore.getState().addItem(margherita);
    renderPanel();

    expect(screen.getByText('Margherita')).toBeInTheDocument();
    // Subtotal for qty=1: ₹299
    expect(screen.getByText('₹299')).toBeInTheDocument();
  });

  it('renders the correct subtotal for quantity > 1', () => {
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().addItem(margherita); // qty = 2 → ₹598
    renderPanel();

    expect(screen.getByText('₹598')).toBeInTheDocument();
  });
});

describe('CartPanel – + / − controls', () => {
  it('clicking + increments the displayed quantity', async () => {
    const user = userEvent.setup();
    useCartStore.getState().addItem(margherita); // qty = 1
    renderPanel();

    const increaseBtn = screen.getByRole('button', {
      name: /increase quantity of margherita/i,
    });
    await user.click(increaseBtn);

    // qty should now be 2
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('clicking − when quantity===1 removes the item from the rendered list', async () => {
    const user = userEvent.setup();
    useCartStore.getState().addItem(margherita); // qty = 1
    renderPanel();

    const decreaseBtn = screen.getByRole('button', {
      name: /decrease quantity of margherita/i,
    });
    await user.click(decreaseBtn);

    // Item should be gone; empty-cart message should appear
    expect(screen.queryByText('Margherita')).not.toBeInTheDocument();
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('clicking − when quantity===2 decrements to 1 without removing the item', async () => {
    const user = userEvent.setup();
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().addItem(margherita); // qty = 2
    renderPanel();

    const decreaseBtn = screen.getByRole('button', {
      name: /decrease quantity of margherita/i,
    });
    await user.click(decreaseBtn);

    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });
});

describe('CartPanel – grand total', () => {
  it('displays grand total of 0 for an empty cart', () => {
    renderPanel();
    expect(screen.getByText('Total: ₹0')).toBeInTheDocument();
  });

  it('displays the correct grand total for a single item', () => {
    useCartStore.getState().addItem(margherita); // 299 × 1 = 299
    renderPanel();
    expect(screen.getByText('Total: ₹299')).toBeInTheDocument();
  });

  it('displays the correct grand total for multiple items', () => {
    useCartStore.getState().addItem(margherita); // 299
    useCartStore.getState().addItem(margherita); // 299 × 2 = 598
    useCartStore.getState().addItem(pepperoni);  // 449 × 1 = 449
    // Total = 598 + 449 = 1047
    renderPanel();
    expect(screen.getByText('Total: ₹1047')).toBeInTheDocument();
  });
});

describe('CartPanel – Clear Cart', () => {
  it('clicking "Clear Cart" empties the rendered list', async () => {
    const user = userEvent.setup();
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().addItem(pepperoni);
    renderPanel();

    // Verify items are present before clearing
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear cart/i }));

    expect(screen.queryByText('Margherita')).not.toBeInTheDocument();
    expect(screen.queryByText('Pepperoni')).not.toBeInTheDocument();
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('grand total resets to ₹0 after clearing the cart', async () => {
    const user = userEvent.setup();
    useCartStore.getState().addItem(margherita);
    renderPanel();

    await user.click(screen.getByRole('button', { name: /clear cart/i }));

    expect(screen.getByText('Total: ₹0')).toBeInTheDocument();
  });
});

describe('CartPanel – multiple items in list', () => {
  it('renders all added items in the cart list', () => {
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().addItem(pepperoni);
    renderPanel();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);

    const names = listItems.map((li) => within(li).getByText(/Margherita|Pepperoni/).textContent);
    expect(names).toContain('Margherita');
    expect(names).toContain('Pepperoni');
  });
});
