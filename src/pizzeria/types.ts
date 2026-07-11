export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  tag: 'veg' | 'non-veg';
  imageAlt: string;
}

export type PizzaSize = 'Small' | 'Medium' | 'Large';

export const SIZE_MULTIPLIERS: Record<PizzaSize, number> = {
  Small: 0.8,
  Medium: 1.0,
  Large: 1.3,
};

export interface CartItem {
  menuItem: MenuItem;
  size: PizzaSize;
  effectivePrice: number;
  quantity: number;
}
