import { useState } from 'react';
import './pizzeria.css';
import PizzeriaHeader from './components/PizzeriaHeader';
import PizzeriaFooter from './components/PizzeriaFooter';
import HeroSection from './components/HeroSection';
import MenuSection from './components/MenuSection';
import { useCartStore } from './hooks/useCartStore';

function PizzeriaPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);

  // suppress unused variable warning until CartPanel is wired in story 3
  void cartOpen;
  void handleCartClose;

  return (
    <div className="pz-page">
      <PizzeriaHeader onCartOpen={handleCartOpen} />

      <main>
        <HeroSection />
        <MenuSection onAdd={addItem} />
      </main>

      {/* CartPanel stubbed until story 3 — cartOpen and onCartClose wired up */}
      {null /* <CartPanel open={cartOpen} onClose={handleCartClose} /> */}

      <PizzeriaFooter />
    </div>
  );
}

export default PizzeriaPage;
