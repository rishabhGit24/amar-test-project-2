import menuData from '../data/menu.json';
import type { MenuItem } from '../types';
import PizzaCard from './PizzaCard';

interface MenuSectionProps {
  onCardClick: (item: MenuItem) => void;
}

const menuItems = menuData as MenuItem[];

export default function MenuSection({ onCardClick }: MenuSectionProps) {
  return (
    <section id="menu" className="pz-menu">
      <h2>Our Menu</h2>
      <div className="pz-menu-grid">
        {menuItems.map((item) => (
          <PizzaCard key={item.id} menuItem={item} onCardClick={onCardClick} />
        ))}
      </div>
    </section>
  );
}
