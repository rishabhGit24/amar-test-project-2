import { useCartStore } from '../hooks/useCartStore';

interface PizzeriaHeaderProps {
  onCartOpen: () => void;
}

function PizzeriaHeader({ onCartOpen }: PizzeriaHeaderProps) {
  const totalCount = useCartStore((state) => state.totalCount);

  return (
    <header className="pz-header">
      <h1 className="pz-header__logo">Amar's Pizzeria</h1>

      <button
        className="pz-cart-btn"
        onClick={onCartOpen}
        aria-label={`Open cart${totalCount > 0 ? `, ${totalCount} items` : ''}`}
      >
        🛒
        <span
          className="pz-cart-badge"
          style={{ display: totalCount === 0 ? 'none' : undefined }}
        >
          {totalCount}
        </span>
      </button>
    </header>
  );
}

export default PizzeriaHeader;
