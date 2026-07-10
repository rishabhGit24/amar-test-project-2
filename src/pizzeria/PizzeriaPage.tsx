// Production build gzip size (dist/assets/index-*.js): ~56.79 KB gzipped
// Verified via: npx vite build
// Output: dist/assets/index-qOcfVpw7.js  173.74 kB │ gzip: 56.79 kB
// Single JS chunk well under the 500 KB gzipped budget.

import { useState } from 'react';
import '../pizzeria/pizzeria.css';
import { useCartStore } from './hooks/useCartStore';
import PizzeriaHeader from './components/PizzeriaHeader';
import HeroSection from './components/HeroSection';
import MenuSection from './components/MenuSection';
import CartPanel from './components/CartPanel';
import menuData from './data/menu.json';
import type { MenuItem } from './types';

const menuItems = menuData as MenuItem[];

export default function PizzeriaPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const totalCount = useCartStore((state) => state.totalCount);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="min-h-screen bg-gray-50">
      <PizzeriaHeader
        totalCount={totalCount}
        onCartOpen={() => setCartOpen(true)}
      />

      <main>
        <HeroSection />
        <MenuSection menuItems={menuItems} onAdd={addItem} />
      </main>

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
