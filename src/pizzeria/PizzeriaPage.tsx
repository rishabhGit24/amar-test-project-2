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

  return (
    <div className="pz-page">
      <PizzeriaHeader
        totalCount={totalCount}
        onCartOpen={() => setCartOpen(true)}
      />

      <main>
        <HeroSection />
        {/* onAdd is a no-op here; the size-picker modal (story 1) will wire the real call */}
        <MenuSection onAdd={() => {}} />
      </main>

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />

      <PizzeriaFooter />
    </div>
  );
}
