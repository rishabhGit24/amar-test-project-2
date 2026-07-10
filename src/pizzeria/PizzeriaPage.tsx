import { useState } from 'react';
import './pizzeria.css';
import PizzeriaHeader from './components/PizzeriaHeader';
import PizzeriaFooter from './components/PizzeriaFooter';
import HeroSection from './components/HeroSection';
import MenuSection from './components/MenuSection';
import CartPanel from './components/CartPanel';
import { useCartStore } from './hooks/useCartStore';

function PizzeriaPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);

  return (
    <div className="pz-page">
      <PizzeriaHeader onCartOpen={handleCartOpen} />

      <main>
        <HeroSection />
        <MenuSection onAdd={addItem} />
      </main>

      <CartPanel open={cartOpen} onClose={handleCartClose} />

      <PizzeriaFooter />
    </div>
  );
}

export default PizzeriaPage;
