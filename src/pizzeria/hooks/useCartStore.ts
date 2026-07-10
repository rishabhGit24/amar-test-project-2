import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (menuItem: MenuItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalCount: number;
  grandTotal: number;
}

const computeTotalCount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0);

const computeGrandTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalCount: 0,
      grandTotal: 0,

      addItem: (menuItem: MenuItem) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.menuItem.id === menuItem.id,
          );
          const updatedItems = existing
            ? state.items.map((item) =>
                item.menuItem.id === menuItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              )
            : [...state.items, { menuItem, quantity: 1 }];

          return {
            items: updatedItems,
            totalCount: computeTotalCount(updatedItems),
            grandTotal: computeGrandTotal(updatedItems),
          };
        });
      },

      removeItem: (id: string) => {
        set((state) => {
          const existing = state.items.find((item) => item.menuItem.id === id);
          if (!existing) return state;

          const updatedItems =
            existing.quantity === 1
              ? state.items.filter((item) => item.menuItem.id !== id)
              : state.items.map((item) =>
                  item.menuItem.id === id
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
