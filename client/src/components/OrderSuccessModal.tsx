import "./OrderSuccessModal.css";

export function OrderSuccessModal({
  onOrderMore,
  onExit,
}: {
  onOrderMore: () => void;
  onExit: () => void;
}) {
  return (
    <div className="ab-sheet-overlay" onClick={onOrderMore}>
      <div className="ab-success" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <div className="ab-success__icon">✓</div>
        <h3>Đã gửi món cho bếp!</h3>
        <p>Nhân viên sẽ mang món ra bàn của bạn trong ít phút. Cảm ơn quý khách!</p>
        <button className="ab-success__primary" onClick={onOrderMore}>
          Gọi thêm món
        </button>
        <button className="ab-success__secondary" onClick={onExit}>
          Thoát
        </button>
      </div>
    </div>
  );
}
