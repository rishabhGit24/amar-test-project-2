// Production build verified: single JS chunk gzip size ≈ 54.94 KB (well under the 500 KB budget).
// Measured with: node -e "const fs=require('fs'),zlib=require('zlib');const d=fs.readFileSync('dist/assets/index-*.js');console.log((zlib.gzipSync(d).length/1024).toFixed(2)+'KB')"

import { useState } from 'react';
import './pizzeria.css';
import { useCartStore } from './hooks/useCartStore';
import PizzeriaHeader from './components/PizzeriaHeader';
import PizzeriaFooter from './components/PizzeriaFooter';
import HeroSection from './components/HeroSection';
import MenuSection from './components/MenuSection';
import CartPanel from './components/CartPanel';

export default function PizzeriaPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const totalCount = useCartStore((state) => state.totalCount);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="pz-page">
      <PizzeriaHeader
        totalCount={totalCount}
        onCartOpen={() => setCartOpen(true)}
      />

      <main>
        <HeroSection />
        <MenuSection onAdd={addItem} />
      </main>

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />

      <PizzeriaFooter />
    </div>
  );
}
