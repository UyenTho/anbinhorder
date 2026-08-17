import "./ThankYouScreen.css";

export function ThankYouScreen({
  tableId,
  hasOrdered,
  onBack,
}: {
  tableId: number;
  hasOrdered: boolean;
  onBack: () => void;
}) {
  return (
    <div className="ab-thankyou">
      <div className="ab-thankyou__card">
        <div className="ab-thankyou__icon">🌿</div>
        <span className="ab-thankyou__eyebrow">Vườn Sinh Thái An Bình</span>
        <h1>Cảm ơn quý khách!</h1>
        {hasOrdered ? (
          <p>
            Món ăn từ Bàn {tableId} đang được nhà bếp chuẩn bị.
            <br />
            Kính chúc quý khách ngon miệng và có một bữa ăn thật vui vẻ!
          </p>
        ) : (
          <p>
            Cảm ơn quý khách đã ghé Bàn {tableId}.
            <br />
            Khi nào sẵn sàng gọi món, mời quý khách xem lại thực đơn bất cứ lúc nào.
          </p>
        )}
        <button className="ab-thankyou__back" onClick={onBack}>
          Xem lại thực đơn / gọi thêm món
        </button>
      </div>
    </div>
  );
}
