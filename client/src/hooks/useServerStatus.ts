import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "../lib/socket";
import { checkHealth } from "../lib/api";

export type ConnectionStatus = "checking" | "connected" | "disconnected";

const POLL_INTERVAL_MS = 6000;

/**
 * Theo dõi trạng thái kết nối tới server backend:
 * - Gọi /api/health ngay khi mount, và lặp lại mỗi 6 giây khi đang mất kết
 *   nối, để tự phục hồi ngay khi server được bật lên mà không cần tải lại
 *   trang.
 * - Lắng nghe socket.io connect / disconnect / connect_error để cập nhật
 *   realtime ngay khi có thay đổi.
 * - Trả thêm hàm `retry` để người dùng chủ động bấm "Thử lại".
 */
export function useServerStatus(): { status: ConnectionStatus; retry: () => void } {
  const [status, setStatus] = useState<ConnectionStatus>("checking");
  const statusRef = useRef(status);
  statusRef.current = status;

  const runCheck = useCallback(async () => {
    const ok = await checkHealth();
    setStatus(ok ? "connected" : "disconnected");
    return ok;
  }, []);

  useEffect(() => {
    let cancelled = false;

    runCheck();

    const intervalId = window.setInterval(() => {
      if (cancelled) return;
      // chỉ tự động dò lại khi đang mất kết nối, tránh gọi thừa lúc bình thường
      if (statusRef.current !== "connected") runCheck();
    }, POLL_INTERVAL_MS);

    const socket = getSocket();

    function handleConnect() {
      setStatus("connected");
    }
    function handleDisconnect() {
      setStatus("disconnected");
    }
    function handleConnectError() {
      setStatus("disconnected");
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [runCheck]);

  const retry = useCallback(() => {
    setStatus("checking");
    runCheck();
    getSocket().connect();
  }, [runCheck]);

  return { status, retry };
}
