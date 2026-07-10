import type { MenuItem } from '../types';

interface PizzaCardProps {
  menuItem: MenuItem;
  onAdd: (item: MenuItem) => void;
}

function PizzaCard({ menuItem, onAdd }: PizzaCardProps) {
  const isVeg = menuItem.tag === 'veg';

  return (
    <article className="pz-card">
      <div className={`pz-card-tag pz-tag--${menuItem.tag}`}>
        {isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
      </div>
      <h3>{menuItem.name}</h3>
      <p className="pz-card-desc">{menuItem.description}</p>
      <p className="pz-card-price">₹{menuItem.price}</p>
      <button className="pz-btn-add" onClick={() => onAdd(menuItem)}>
        Add to Cart
      </button>
    </article>
  );
}

export default PizzaCard;
