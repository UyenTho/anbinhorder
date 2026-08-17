import { forwardRef } from "react";
import { MenuCategory, MenuItem } from "../types";
import { MenuItemRow } from "./MenuItemRow";
import "./CategorySection.css";

export const CategorySection = forwardRef<
  HTMLDivElement,
  { category: MenuCategory; onAdd: (item: MenuItem) => void }
>(function CategorySection({ category, onAdd }, ref) {
  return (
    <section className="ab-category" ref={ref} id={category.id}>
      {category.image && (
        <div className="ab-category__banner">
          <img src={category.image} alt={`Bảng thực đơn ${category.title}`} loading="lazy" />
          <div className="ab-category__banner-overlay">
            <span className="ab-category__eyebrow">Thực đơn</span>
            <h2>{category.title}</h2>
            {category.subtitle && <p>{category.subtitle}</p>}
          </div>
        </div>
      )}

      {category.groups.map((group) => (
        <div className="ab-group" key={group.id}>
          <h3 className="ab-group__title">{group.title}</h3>
          <div className="ab-group__items">
            {group.items.map((item) => (
              <MenuItemRow key={item.id} item={item} onAdd={onAdd} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
});
