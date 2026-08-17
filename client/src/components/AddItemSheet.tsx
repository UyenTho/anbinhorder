import { useState } from "react";
import { MenuItem } from "../types";
import { formatPrice } from "../lib/format";
import "./AddItemSheet.css";

export function AddItemSheet({
  item,
  onClose,
  onConfirm,
}: {
  item: MenuItem;
  onClose: () => void;
  onConfirm: (quantity: number, note: string) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  return (
    <div className="ab-sheet-overlay" onClick={onClose}>
      <div className="ab-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="ab-sheet__handle" />
        <h3 className="ab-sheet__title">{item.name}</h3>
        {item.options && <p className="ab-sheet__options">Cách chế biến: {item.options.join(" · ")}</p>}
        <p className="ab-sheet__price">{formatPrice(item.price, item.unit)}</p>

        <label className="ab-sheet__label" htmlFor="item-note">
          Ghi chú cho món này (không bắt buộc)
        </label>
        <textarea
          id="item-note"
          className="ab-sheet__textarea"
          placeholder="Vd: ít cay, không hành, chọn món nướng..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />

        <div className="ab-sheet__qty-row">
          <span className="ab-sheet__label" style={{ marginBottom: 0 }}>
            Số lượng
          </span>
          <div className="ab-qty">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Giảm số lượng"
            >
              −
            </button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Tăng số lượng">
              +
            </button>
          </div>
        </div>

        <button className="ab-sheet__confirm" onClick={() => onConfirm(quantity, note)}>
          Thêm vào giỏ
        </button>
        <button className="ab-sheet__cancel" onClick={onClose}>
          Huỷ
        </button>
      </div>
    </div>
  );
}
