import { menu } from "../data/menu";
import "./CategoryNav.css";

export function CategoryNav({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="ab-catnav" aria-label="Danh mục thực đơn">
      {menu.map((cat) => (
        <button
          key={cat.id}
          className={`ab-catnav__pill ${cat.id === activeId ? "is-active" : ""}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.title}
        </button>
      ))}
    </nav>
  );
}
