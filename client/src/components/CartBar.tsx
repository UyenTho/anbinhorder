import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import "./CartBar.css";

export function CartBar({ onOpen }: { onOpen: () => void }) {
  const { totalItems, totalPrice, hasUnknownPriceItem } = useCart();

  if (totalItems === 0) return null;

  return (
    <button className="ab-cartbar" onClick={onOpen}>
      <span className="ab-cartbar__count">{totalItems}</span>
      <span className="ab-cartbar__label">Xem giỏ món</span>
      <span className="ab-cartbar__total">
        {formatPrice(totalPrice)}
        {hasUnknownPriceItem ? "+" : ""}
      </span>
    </button>
  );
}
