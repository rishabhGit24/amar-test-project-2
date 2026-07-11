import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem, PizzaSize } from '../types';

/** Composite dedup key: same pizza in different sizes → different lines. */
const lineKey = (id: string, size: PizzaSize): string => `${id}-${size}`;

interface CartState {
  items: CartItem[];
  addItem: (menuItem: MenuItem, size: PizzaSize, effectivePrice: number) => void;
  removeItem: (id: string, size: PizzaSize) => void;
  clearCart: () => void;
  totalCount: number;
  grandTotal: number;
}

const computeTotalCount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0);

const computeGrandTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.effectivePrice * item.quantity, 0);

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalCount: 0,
      grandTotal: 0,

      addItem: (menuItem: MenuItem, size: PizzaSize, effectivePrice: number) => {
        set((state) => {
          const key = lineKey(menuItem.id, size);
          const existing = state.items.find(
            (item) => lineKey(item.menuItem.id, item.size) === key,
          );
          const updatedItems = existing
            ? state.items.map((item) =>
                lineKey(item.menuItem.id, item.size) === key
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              )
            : [...state.items, { menuItem, size, effectivePrice, quantity: 1 }];

          return {
            items: updatedItems,
            totalCount: computeTotalCount(updatedItems),
            grandTotal: computeGrandTotal(updatedItems),
          };
        });
      },

      removeItem: (id: string, size: PizzaSize) => {
        set((state) => {
          const key = lineKey(id, size);
          const existing = state.items.find(
            (item) => lineKey(item.menuItem.id, item.size) === key,
          );
          if (!existing) return state;

          const updatedItems =
            existing.quantity === 1
              ? state.items.filter(
                  (item) => lineKey(item.menuItem.id, item.size) !== key,
                )
              : state.items.map((item) =>
                  lineKey(item.menuItem.id, item.size) === key
                    ? { ...item, quantity: item.quantity - 1 }
                    : item,
                );

          return {
            items: updatedItems,
            totalCount: computeTotalCount(updatedItems),
            grandTotal: computeGrandTotal(updatedItems),
          };
        });
      },

      clearCart: () => set({ items: [], totalCount: 0, grandTotal: 0 }),
    }),
    {
      name: 'pizzeria-cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.totalCount = computeTotalCount(state.items);
          state.grandTotal = computeGrandTotal(state.items);
        }
      },
    },
  ),
);
