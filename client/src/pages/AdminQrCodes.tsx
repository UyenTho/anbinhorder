import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import "./AdminQrCodes.css";

const TABLE_COUNT = 10;

export function AdminQrCodes() {
  const { password } = useAdminAuth();
  const navigate = useNavigate();
  const [baseUrl, setBaseUrl] = useState(window.location.origin);

  useEffect(() => {
    if (!password) navigate("/admin");
  }, [password, navigate]);

  if (!password) return null;

  const tables = Array.from({ length: TABLE_COUNT }, (_, i) => i + 1);

  return (
    <div className="ab-qrpage">
      <div className="ab-qrpage__toolbar">
        <div>
          <button className="ab-qrpage__back" onClick={() => navigate("/admin/dashboard")}>
            ← Quay lại
          </button>
          <h1>Mã QR đặt món cho từng bàn</h1>
          <p>Nhập đúng địa chỉ website đã triển khai (Vercel), rồi in trang này ra và dán lên từng bàn.</p>
        </div>
        <div className="ab-qrpage__url-row">
          <label htmlFor="base-url">Địa chỉ website</label>
          <input
            id="base-url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://ten-quan-cua-ban.vercel.app"
          />
          <button onClick={() => window.print()}>In trang này</button>
        </div>
      </div>

      <div className="ab-qrpage__grid">
        {tables.map((t) => {
          const url = `${baseUrl.replace(/\/$/, "")}/?table=${t}`;
          return (
            <div className="ab-qrcard" key={t}>
              <span className="ab-qrcard__eyebrow">Vườn Sinh Thái An Bình</span>
              <QRCodeSVG value={url} size={168} bgColor="#fffdf8" fgColor="#1f3d2b" level="M" />
              <h2>Bàn {t}</h2>
              <p>{url}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
