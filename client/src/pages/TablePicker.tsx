import { useNavigate } from "react-router-dom";
import "./TablePicker.css";

const TABLE_COUNT = 10;

export function TablePicker() {
  const navigate = useNavigate();
  const tables = Array.from({ length: TABLE_COUNT }, (_, i) => i + 1);

  return (
    <div className="ab-picker">
      <div className="ab-picker__card">
        <span className="ab-picker__eyebrow">Vườn Sinh Thái An Bình</span>
        <h1>Chọn bàn của bạn</h1>
        <p>Vui lòng quét mã QR đặt trên bàn. Nếu chưa có mã QR, chọn số bàn bên dưới để xem thực đơn.</p>
        <div className="ab-picker__grid">
          {tables.map((t) => (
            <button key={t} onClick={() => navigate(`/?table=${t}`)}>
              {t}
            </button>
          ))}
        </div>
        <button className="ab-picker__staff-link" onClick={() => navigate("/kitchen")}>
          Nhân viên bếp / quản lý bấm vào đây →
        </button>
      </div>
    </div>
  );
}
