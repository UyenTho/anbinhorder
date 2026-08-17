import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";
import { checkHealth } from "../lib/api";

export type ConnectionStatus = "checking" | "connected" | "disconnected";

/**
 * Theo dõi trạng thái kết nối tới server backend:
 * - Gọi /api/health mỗi khi mount để kiểm tra ngay lập tức
 * - Lắng nghe socket.io connect / disconnect / connect_error để cập nhật realtime
 */
export function useServerStatus(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>("checking");

  useEffect(() => {
    let cancelled = false;

    checkHealth().then((ok) => {
      if (!cancelled) setStatus(ok ? "connected" : "disconnected");
    });

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
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  return status;
}
