import type { MenuItem } from '../types';

interface PizzaCardProps {
  menuItem: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export default function PizzaCard({ menuItem, onAdd }: PizzaCardProps) {
  const { name, description, price, tag } = menuItem;

  return (
    <article className="pz-card" aria-label={menuItem.name}>
      <div className={`pz-card-tag pz-tag--${tag}`}>
        {tag === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
      </div>
      <h3>{name}</h3>
      <p className="pz-card-desc">{description}</p>
      <p className="pz-card-price">₹{price}</p>
      <button
        className="pz-btn-add"
        aria-label={`Add ${menuItem.name} to cart`}
        onClick={() => onAdd(menuItem)}
      >
        Add to Cart
      </button>
    </article>
  );
}
