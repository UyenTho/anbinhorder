import { MenuItem } from "../types";
import { formatPrice } from "../lib/format";
import "./MenuItemRow.css";

export function MenuItemRow({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
  return (
    <div className="ab-item">
      <div className="ab-item__info">
        <div className="ab-item__name-row">
          <h4>{item.name}</h4>
          {item.tag && <span className="ab-item__tag">{item.tag}</span>}
        </div>
        {item.options && (
          <p className="ab-item__options">{item.options.join(" · ")}</p>
        )}
        <p className="ab-item__price">{formatPrice(item.price, item.unit)}</p>
      </div>
      <button className="ab-item__add" onClick={() => onAdd(item)} aria-label={`Thêm ${item.name}`}>
        +
      </button>
    </div>
  );
}
