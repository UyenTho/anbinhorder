import "./OrderSuccessModal.css";

export function OrderSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="ab-sheet-overlay" onClick={onClose}>
      <div className="ab-success" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <div className="ab-success__icon">✓</div>
        <h3>Đã gửi món cho bếp!</h3>
        <p>Nhân viên sẽ mang món ra bàn của bạn trong ít phút. Cảm ơn quý khách!</p>
        <button onClick={onClose}>Gọi thêm món</button>
      </div>
    </div>
  );
}
