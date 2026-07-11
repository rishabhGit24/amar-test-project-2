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
    useCartStore.getState().addItem(margherita, 'Medium', 299);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].menuItem.id).toBe('pizza-001');
    expect(items[0].quantity).toBe(1);
  });

  it('increments quantity instead of adding a duplicate entry', () => {
    useCartStore.getState().addItem(margherita, 'Medium', 299);
    useCartStore.getState().addItem(margherita, 'Medium', 299);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('adds multiple distinct items as separate entries', () => {
    useCartStore.getState().addItem(margherita, 'Medium', 299);
    useCartStore.getState().addItem(pepperoni, 'Medium', 449);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(2);
  });

  it('creates separate lines for the same pizza in different sizes', () => {
    useCartStore.getState().addItem(margherita, 'Small', 239);
    useCartStore.getState().addItem(margherita, 'Large', 389);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(2);
    expect(items[0].size).toBe('Small');
    expect(items[1].size).toBe('Large');
  });

  it('increments quantity only for the matching size line', () => {
    useCartStore.getState().addItem(margherita, 'Small', 239);
    useCartStore.getState().addItem(margherita, 'Large', 389);
    useCartStore.getState().addItem(margherita, 'Small', 239);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(2);
    const smallLine = items.find((i) => i.size === 'Small');
    const largeLine = items.find((i) => i.size === 'Large');
    expect(smallLine?.quantity).toBe(2);
    expect(largeLine?.quantity).toBe(1);
  });
});

describe('useCartStore – removeItem', () => {
  it('decrements quantity when quantity > 1', () => {
    useCartStore.getState().addItem(margherita, 'Medium', 299);
    useCartStore.getState().addItem(margherita, 'Medium', 299);
    useCartStore.getState().removeItem('pizza-001', 'Medium');
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
  });

  it('removes the entry entirely when quantity === 1', () => {
    useCartStore.getState().addItem(margherita, 'Medium', 299);
    useCartStore.getState().removeItem('pizza-001', 'Medium');
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it('does nothing when the id is not in the cart', () => {
    useCartStore.getState().addItem(margherita, 'Medium', 299);
    useCartStore.getState().removeItem('pizza-999', 'Medium');
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
  });

  it('removes only the matching size line, leaving other size lines intact', () => {
    useCartStore.getState().addItem(margherita, 'Small', 239);
    useCartStore.getState().addItem(margherita, 'Large', 389);
    useCartStore.getState().removeItem('pizza-001', 'Small');
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].size).toBe('Large');
  });
});

describe('useCartStore – clearCart', () => {
  it('empties the cart', () => {
    useCartStore.getState().addItem(margherita, 'Medium', 299);
    useCartStore.getState().addItem(pepperoni, 'Medium', 449);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

describe('useCartStore – totalCount', () => {
  it('returns 0 for an empty cart', () => {
    expect(useCartStore.getState().totalCount).toBe(0);
  });

  it('returns the sum of all item quantities', () => {
    useCartStore.getState().addItem(margherita, 'Medium', 299);
    useCartStore.getState().addItem(margherita, 'Medium', 299);
    useCartStore.getState().addItem(pepperoni, 'Medium', 449);
    // margherita qty=2, pepperoni qty=1 → totalCount=3
    expect(useCartStore.getState().totalCount).toBe(3);
  });
});

describe('useCartStore – grandTotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(useCartStore.getState().grandTotal).toBe(0);
  });

  it('equals sum of (effectivePrice × quantity) for all items', () => {
    useCartStore.getState().addItem(margherita, 'Medium', 299); // 299 × 1
    useCartStore.getState().addItem(margherita, 'Medium', 299); // 299 × 2 = 598
    useCartStore.getState().addItem(pepperoni, 'Medium', 449);  // 449 × 1
    // 598 + 449 = 1047
    expect(useCartStore.getState().grandTotal).toBe(1047);
  });

  it('uses effectivePrice (not menuItem.price) for the grand total', () => {
    // Large margherita: effectivePrice = Math.round(299 * 1.3) = 389
    useCartStore.getState().addItem(margherita, 'Large', 389);
    useCartStore.getState().addItem(margherita, 'Large', 389); // qty = 2
    // grandTotal = 389 × 2 = 778 (not 299 × 2 = 598)
    expect(useCartStore.getState().grandTotal).toBe(778);
  });
});

describe('useCartStore – localStorage persistence', () => {
  it('writes to localStorage under key "pizzeria-cart" after addItem', () => {
    useCartStore.getState().addItem(margherita, 'Medium', 299);
    const raw = localStorage.getItem('pizzeria-cart');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    // Zustand persist wraps state in { state: { items: [...] }, version: 0 }
    expect(parsed.state.items).toHaveLength(1);
    expect(parsed.state.items[0].menuItem.id).toBe('pizza-001');
    expect(parsed.state.items[0].size).toBe('Medium');
    expect(parsed.state.items[0].effectivePrice).toBe(299);
  });
});
