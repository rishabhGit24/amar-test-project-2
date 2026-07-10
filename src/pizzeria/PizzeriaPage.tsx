import { useState } from 'react';
import './pizzeria.css';
import PizzeriaHeader from './components/PizzeriaHeader';
import PizzeriaFooter from './components/PizzeriaFooter';

function PizzeriaPage() {
  const [cartOpen, setCartOpen] = useState(false);

  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);

  return (
    <div className="pz-page">
      <PizzeriaHeader onCartOpen={handleCartOpen} />

      <main>
        {/* Hero, Menu, sections added in later stories */}
      </main>

      {/* CartPanel stubbed until story 3 — cartOpen and onCartClose wired up */}
      {null /* <CartPanel open={cartOpen} onClose={handleCartClose} /> */}

      <PizzeriaFooter />
    </div>
  );
}

export default PizzeriaPage;
