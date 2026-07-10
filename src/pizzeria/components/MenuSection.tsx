import menuData from '../data/menu.json';
import type { MenuItem } from '../types';
import PizzaCard from './PizzaCard';

interface MenuSectionProps {
  onAdd: (item: MenuItem) => void;
}

function MenuSection({ onAdd }: MenuSectionProps) {
  return (
    <section id="menu" className="pz-menu">
      <h2>Our Menu</h2>
      <div className="pz-menu-grid">
        {(menuData as MenuItem[]).map((item) => (
          <PizzaCard key={item.id} menuItem={item} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}

export default MenuSection;
