export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  tag: 'veg' | 'non-veg';
  imageAlt: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}
