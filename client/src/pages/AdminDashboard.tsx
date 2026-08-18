import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { fetchOrders, updateOrderStatus, clearOrders, AuthError } from "../lib/api";
import { getSocket } from "../lib/socket";
import { Order, OrderStatus } from "../types";
import { formatDateTime, formatPrice } from "../lib/format";
import { useServerStatus } from "../hooks/useServerStatus";
import { ConnectionBanner } from "../components/ConnectionBanner";
import { RevenueStats } from "../components/RevenueStats";
import "./AdminDashboard.css";

const STATUS_LABEL: Record<OrderStatus, string> = {
  moi: "Món mới",
  dang_lam: "Đang chuẩn bị",
  xong: "Đã xong",
  huy: "Đã huỷ",
};

const STATUS_ORDER: OrderStatus[] = ["moi", "dang_lam", "xong", "huy"];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  moi: "dang_lam",
  dang_lam: "xong",
};

const TABLE_COUNT = 10;

export function AdminDashboard() {
  const { password, logout } = useAdminAuth();
  const navigate = useNavigate();
  const { status: serverStatus, retry: retryConnection } = useServerStatus();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableFilter, setTableFilter] = useState<number | "all">("all");
  const [soundOn, setSoundOn] = useState(true);
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const load = useCallback(async () => {
    if (!password) return;
    try {
      const res = await fetchOrders(password);
      setOrders(res.orders);
    } catch (e) {
      // Chỉ đăng xuất khi thật sự sai mật khẩu (401). Nếu là lỗi mất kết nối
      // (server chưa bật, sập mạng...) thì giữ nguyên trang, banner cảnh báo
      // ở trên sẽ báo cho người dùng, và trang sẽ tự tải lại khi có mạng lại.
      if (e instanceof AuthError) {
        logout();
        navigate("/admin");
      }
    } finally {
      setLoading(false);
    }
  }, [password, logout, navigate]);

  useEffect(() => {
    if (!password) {
      navigate("/admin");
      return;
    }
    load();
  }, [password, load, navigate]);

  // Tự tải lại danh sách đơn ngay khi kết nối tới server được khôi phục
  useEffect(() => {
    if (serverStatus === "connected" && password) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverStatus]);

  useEffect(() => {
    const socket = getSocket();

    function handleNewOrder(order: Order) {
      setOrders((prev) => [order, ...prev]);
      setNewOrderIds((prev) => new Set(prev).add(order.id));
      if (soundOn) {
        audioRef.current?.play().catch(() => {});
      }
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(`Bàn ${order.tableId} vừa gọi món`, {
          body: order.items.map((i) => `${i.name} x${i.quantity}`).join(", "),
          icon: "/icons/icon-192.png",
        });
      }
    }

    function handleOrderUpdated(order: Order) {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
    }

    function handleOrdersCleared() {
      setOrders([]);
    }

    socket.on("new-order", handleNewOrder);
    socket.on("order-updated", handleOrderUpdated);
    socket.on("orders-cleared", handleOrdersCleared);

    return () => {
      socket.off("new-order", handleNewOrder);
      socket.off("order-updated", handleOrderUpdated);
      socket.off("orders-cleared", handleOrdersCleared);
    };
  }, [soundOn]);

  async function handleStatusChange(order: Order, status: OrderStatus) {
    if (!password) return;
    setNewOrderIds((prev) => {
      const next = new Set(prev);
      next.delete(order.id);
      return next;
    });
    try {
      await updateOrderStatus(password, order.id, status);
    } catch {
      // đồng bộ lại nếu lỗi
      load();
    }
  }

  async function handleClearAll() {
    if (!password) return;
    if (!confirm("Xoá toàn bộ lịch sử đơn hàng? Hành động này không thể hoàn tác.")) return;
    await clearOrders(password);
  }

  function requestNotifPermission() {
    if (typeof Notification === "undefined") return;
    Notification.requestPermission().then(setNotifPermission);
  }

  const filteredOrders = useMemo(() => {
    if (tableFilter === "all") return orders;
    return orders.filter((o) => o.tableId === tableFilter);
  }, [orders, tableFilter]);

  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === "moi" || o.status === "dang_lam").length,
    [orders]
  );

  const tablesWithPending = useMemo(() => {
    const set = new Set<number>();
    orders.forEach((o) => {
      if (o.status === "moi" || o.status === "dang_lam") set.add(o.tableId);
    });
    return set;
  }, [orders]);

  return (
    <div className="ab-admin">
      <audio ref={audioRef} src="/sounds/bell.wav" preload="auto" />

      <ConnectionBanner status={serverStatus} onRetry={retryConnection} />

      <header className="ab-admin__header">
        <div>
          <span className="ab-admin__eyebrow">Vườn Sinh Thái An Bình · Trang Bếp / Quản lý</span>
          <h1>Đơn đặt món ({pendingCount} đang chờ)</h1>
        </div>
        <div className="ab-admin__actions">
          <button
            className={`ab-admin__icon-btn ${soundOn ? "is-on" : ""}`}
            onClick={() => setSoundOn((s) => !s)}
            title={soundOn ? "Tắt chuông" : "Bật chuông"}
          >
            {soundOn ? "🔔" : "🔕"}
          </button>
          {notifPermission !== "granted" && (
            <button className="ab-admin__link-btn" onClick={requestNotifPermission}>
              Bật thông báo
            </button>
          )}
          <button className="ab-admin__link-btn" onClick={() => navigate("/admin/qrcodes")}>
            Mã QR bàn
          </button>
          <button
            className="ab-admin__link-btn"
            onClick={() => {
              logout();
              navigate("/admin");
            }}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <RevenueStats orders={orders} />

      <div className="ab-admin__filters">
        <button
          className={`ab-admin__filter-pill ${tableFilter === "all" ? "is-active" : ""}`}
          onClick={() => setTableFilter("all")}
        >
          Tất cả bàn
        </button>
        {Array.from({ length: TABLE_COUNT }, (_, i) => i + 1).map((t) => (
          <button
            key={t}
            className={`ab-admin__filter-pill ${tableFilter === t ? "is-active" : ""}`}
            onClick={() => setTableFilter(t)}
          >
            Bàn {t}
            {tablesWithPending.has(t) && <span className="ab-admin__dot" />}
          </button>
        ))}
      </div>

      <main className="ab-admin__list">
        {loading && <p className="ab-admin__empty">Đang tải đơn hàng...</p>}
        {!loading && filteredOrders.length === 0 && (
          <p className="ab-admin__empty">Chưa có đơn hàng nào.</p>
        )}
        {filteredOrders.map((order) => (
          <article
            key={order.id}
            className={`ab-order-card ab-order-card--${order.status} ${
              newOrderIds.has(order.id) ? "is-new" : ""
            }`}
          >
            <div className="ab-order-card__head">
              <div>
                <h3>Bàn {order.tableId}</h3>
                <span className="ab-order-card__time">{formatDateTime(order.createdAt)}</span>
              </div>
              <span className={`ab-status-badge ab-status-badge--${order.status}`}>
                {STATUS_LABEL[order.status]}
              </span>
            </div>

            <ul className="ab-order-card__items">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  <span className="ab-order-card__item-name">
                    {item.name} <strong>x{item.quantity}</strong>
                  </span>
                  {item.note && <span className="ab-order-card__item-note">Ghi chú: {item.note}</span>}
                  <span className="ab-order-card__item-price">{formatPrice(item.price)}</span>
                </li>
              ))}
            </ul>

            {order.note && <p className="ab-order-card__note">Ghi chú đơn: {order.note}</p>}

            <div className="ab-order-card__actions">
              {STATUS_ORDER.filter((s) => s !== "huy").map((s) => (
                <button
                  key={s}
                  className={`ab-order-card__status-btn ${order.status === s ? "is-current" : ""}`}
                  onClick={() => handleStatusChange(order, s)}
                  disabled={order.status === s}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
              {order.status !== "huy" && (
                <button
                  className="ab-order-card__cancel-btn"
                  onClick={() => handleStatusChange(order, "huy")}
                >
                  Huỷ đơn
                </button>
              )}
            </div>
          </article>
        ))}
      </main>

      {orders.length > 0 && (
        <footer className="ab-admin__footer">
          <button onClick={handleClearAll}>Xoá toàn bộ lịch sử đơn</button>
        </footer>
      )}
    </div>
  );
}
