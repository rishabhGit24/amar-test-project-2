import type { MenuItem } from '../types';

interface PizzaCardProps {
  menuItem: MenuItem;
  /** Called when the card or its button is clicked (opens the detail modal). */
  onCardClick: (item: MenuItem) => void;
  /**
   * @deprecated Use onCardClick instead.
   * Kept for backward compatibility with existing tests.
   */
  onAdd?: (item: MenuItem) => void;
}

export default function PizzaCard({ menuItem, onCardClick, onAdd }: PizzaCardProps) {
  const { name, description, price, tag } = menuItem;

  const handleCardClick = () => {
    onCardClick(menuItem);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If onCardClick is the real handler (modal flow), use it.
    // If only onAdd is provided (legacy / test usage), use that.
    if (onCardClick) {
      onCardClick(menuItem);
    } else if (onAdd) {
      onAdd(menuItem);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCardClick(menuItem);
    }
  };

  return (
    <article
      className="pz-card"
      aria-label={menuItem.name}
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <div className={`pz-card-tag pz-tag--${tag}`}>
        {tag === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
      </div>
      <h3>{name}</h3>
      <p className="pz-card-desc">{description}</p>
      <p className="pz-card-price">₹{price}</p>
      <button
        className="pz-btn-add"
        aria-label={`Add ${menuItem.name} to cart`}
        onClick={handleButtonClick}
      >
        Add to Cart
      </button>
    </article>
  );
}
