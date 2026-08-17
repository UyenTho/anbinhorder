import { API_URL } from "../lib/api";
import { ConnectionStatus } from "../hooks/useServerStatus";
import "./ConnectionBanner.css";

export function ConnectionBanner({
  status,
  onRetry,
}: {
  status: ConnectionStatus;
  onRetry?: () => void;
}) {
  if (status !== "disconnected") return null;

  return (
    <div className="ab-conn-banner" role="alert">
      <span className="ab-conn-banner__icon">⚠️</span>
      <div className="ab-conn-banner__body">
        <strong>Mất kết nối tới máy chủ bếp</strong>
        <p>
          Không gọi được đến <code>{API_URL}</code>. Kiểm tra lại: máy chủ backend (server)
          đã bật chưa, hoặc biến <code>VITE_API_URL</code> đã trỏ đúng địa chỉ server đã
          deploy chưa.
        </p>
        {onRetry && (
          <button className="ab-conn-banner__retry" onClick={onRetry}>
            Thử kết nối lại
          </button>
        )}
      </div>
    </div>
  );
}
