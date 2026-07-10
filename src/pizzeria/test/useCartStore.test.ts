import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../hooks/useCartStore';
import type { MenuItem } from '../types';

const margherita: MenuItem = {
  id: 'pizza-001',
  name: 'Margherita',
  description: 'Classic Italian pizza with fresh tomato sauce and mozzarella.',
  price: 299,
  tag: 'veg',
  imageAlt: 'Margherita pizza with golden cheese and fresh basil',
};

const pepperoni: MenuItem = {
  id: 'pizza-002',
  name: 'Pepperoni',
  description: 'Loaded with generous slices of spicy pepperoni.',
  price: 449,
  tag: 'non-veg',
  imageAlt: 'Pepperoni pizza with crispy pepperoni slices',
};

// Reset store state and localStorage before each test
beforeEach(() => {
  useCartStore.setState({ items: [], totalCount: 0, grandTotal: 0 });
  localStorage.clear();
});

describe('useCartStore – addItem', () => {
  it('adds a new item with quantity 1 when the cart is empty', () => {
    useCartStore.getState().addItem(margherita);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].menuItem.id).toBe('pizza-001');
    expect(items[0].quantity).toBe(1);
  });

  it('increments quantity instead of adding a duplicate entry', () => {
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().addItem(margherita);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('adds multiple distinct items as separate entries', () => {
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().addItem(pepperoni);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(2);
  });
});

describe('useCartStore – removeItem', () => {
  it('decrements quantity when quantity > 1', () => {
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().removeItem('pizza-001');
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
  });

  it('removes the entry entirely when quantity === 1', () => {
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().removeItem('pizza-001');
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it('does nothing when the id is not in the cart', () => {
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().removeItem('pizza-999');
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
  });
});

describe('useCartStore – clearCart', () => {
  it('empties the cart', () => {
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().addItem(pepperoni);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

describe('useCartStore – totalCount', () => {
  it('returns 0 for an empty cart', () => {
    expect(useCartStore.getState().totalCount).toBe(0);
  });

  it('returns the sum of all item quantities', () => {
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().addItem(margherita);
    useCartStore.getState().addItem(pepperoni);
    // margherita qty=2, pepperoni qty=1 → totalCount=3
    expect(useCartStore.getState().totalCount).toBe(3);
  });
});

describe('useCartStore – grandTotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(useCartStore.getState().grandTotal).toBe(0);
  });

  it('equals sum of (price × quantity) for all items', () => {
    useCartStore.getState().addItem(margherita); // 299 × 1
    useCartStore.getState().addItem(margherita); // 299 × 2 = 598
    useCartStore.getState().addItem(pepperoni);  // 449 × 1
    // 598 + 449 = 1047
    expect(useCartStore.getState().grandTotal).toBe(1047);
  });
});

describe('useCartStore – localStorage persistence', () => {
  it('writes to localStorage under key "pizzeria-cart" after addItem', () => {
    useCartStore.getState().addItem(margherita);
    const raw = localStorage.getItem('pizzeria-cart');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    // Zustand persist wraps state in { state: { items: [...] }, version: 0 }
    expect(parsed.state.items).toHaveLength(1);
    expect(parsed.state.items[0].menuItem.id).toBe('pizza-001');
  });
});
