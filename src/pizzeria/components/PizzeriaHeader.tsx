interface PizzeriaHeaderProps {
  totalCount: number;
  onCartOpen: () => void;
}

export default function PizzeriaHeader({ totalCount, onCartOpen }: PizzeriaHeaderProps) {
  return (
    <header className="pz-header">
      <h1 className="pz-header__logo">Amar's Pizzeria</h1>

      <button
        type="button"
        aria-label={`Open cart, ${totalCount} items`}
        onClick={onCartOpen}
        className="pz-cart-btn"
      >
        <span aria-hidden="true">🛒</span>
        <span>Cart</span>
        <span
          className="pz-cart-badge"
          aria-hidden="true"
          style={{ display: totalCount === 0 ? 'none' : undefined }}
        >
          {totalCount}
        </span>
      </button>
    </header>
  );
}
