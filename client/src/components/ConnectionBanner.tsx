import { API_URL } from "../lib/api";
import { ConnectionStatus } from "../hooks/useServerStatus";
import "./ConnectionBanner.css";

export function ConnectionBanner({ status }: { status: ConnectionStatus }) {
  if (status !== "disconnected") return null;

  return (
    <div className="ab-conn-banner" role="alert">
      <span className="ab-conn-banner__icon">⚠️</span>
      <div>
        <strong>Mất kết nối tới máy chủ bếp</strong>
        <p>
          Không gọi được đến <code>{API_URL}</code>. Kiểm tra lại: máy chủ backend (server)
          đã bật chưa, hoặc biến <code>VITE_API_URL</code> đã trỏ đúng địa chỉ server đã
          deploy chưa.
        </p>
      </div>
    </div>
  );
}
