import { useState } from "react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import "./CartDrawer.css";

export function CartDrawer({
  onClose,
  onSubmit,
  submitting,
}: {
  onClose: () => void;
  onSubmit: (orderNote: string) => void;
  submitting: boolean;
}) {
  const { lines, updateLine, removeLine, totalPrice, hasUnknownPriceItem } = useCart();
  const [orderNote, setOrderNote] = useState("");

  return (
    <div className="ab-sheet-overlay" onClick={onClose}>
      <div
        className="ab-sheet ab-cart-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="ab-sheet__handle" />
        <h3 className="ab-sheet__title">Giỏ món của bạn</h3>

        {lines.length === 0 ? (
          <p className="ab-cart-empty">Chưa có món nào được chọn.</p>
        ) : (
          <div className="ab-cart-lines">
            {lines.map((line) => (
              <div className="ab-cart-line" key={line.key}>
                <div className="ab-cart-line__main">
                  <h4>{line.name}</h4>
                  {line.note && <p className="ab-cart-line__note">Ghi chú: {line.note}</p>}
                  <p className="ab-cart-line__price">{formatPrice(line.price)}</p>
                </div>
                <div className="ab-qty ab-qty--sm">
                  <button
                    onClick={() => updateLine(line.key, line.quantity - 1, line.note)}
                    aria-label="Giảm"
                  >
                    −
                  </button>
                  <span>{line.quantity}</span>
                  <button
                    onClick={() => updateLine(line.key, line.quantity + 1, line.note)}
                    aria-label="Tăng"
                  >
                    +
                  </button>
                </div>
                <button
                  className="ab-cart-line__remove"
                  onClick={() => removeLine(line.key)}
                  aria-label={`Xoá ${line.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="ab-sheet__label" htmlFor="order-note" style={{ marginTop: 16 }}>
          Ghi chú chung cho đơn (không bắt buộc)
        </label>
        <textarea
          id="order-note"
          className="ab-sheet__textarea"
          placeholder="Vd: mang ra cùng lúc, có trẻ nhỏ, dị ứng hải sản..."
          rows={2}
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
        />

        <div className="ab-cart-total-row">
          <span>Tạm tính</span>
          <strong>
            {formatPrice(totalPrice)}
            {hasUnknownPriceItem ? "+" : ""}
          </strong>
        </div>
        {hasUnknownPriceItem && (
          <p className="ab-cart-hint">
            (*) Một số món tính theo thời giá, nhân viên sẽ báo giá cụ thể khi lên món.
          </p>
        )}

        <button
          className="ab-sheet__confirm"
          disabled={lines.length === 0 || submitting}
          onClick={() => onSubmit(orderNote)}
        >
          {submitting ? "Đang gửi..." : "Gửi món cho bếp"}
        </button>
        <button className="ab-sheet__cancel" onClick={onClose}>
          Tiếp tục chọn món
        </button>
      </div>
    </div>
  );
}
