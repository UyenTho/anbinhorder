import { Order, OrderStatus } from "../types";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const CONNECTION_ERROR_MESSAGE =
  "Không kết nối được tới máy chủ bếp. Vui lòng kiểm tra: (1) máy chủ backend " +
  `(server) đã được bật tại ${API_URL} chưa, (2) nếu đang chạy thật thì biến ` +
  "VITE_API_URL trên client đã trỏ đúng địa chỉ server chưa.";

async function safeFetch(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch {
    // fetch ném TypeError khi không kết nối được server (server chưa chạy,
    // sai địa chỉ, CORS, mất mạng...). Gói lại thành lỗi dễ hiểu cho người dùng.
    throw new Error(CONNECTION_ERROR_MESSAGE);
  }
}

/** Lỗi riêng cho trường hợp sai/thiếu mật khẩu quản lý (401) — để phân biệt
 * với lỗi mất kết nối mạng, tránh việc mất kết nối lại bị hiểu nhầm là sai
 * mật khẩu rồi tự đăng xuất người dùng. */
export class AuthError extends Error {}

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as { error?: string }).error || "Có lỗi xảy ra, vui lòng thử lại";
    if (res.status === 401) throw new AuthError(message);
    throw new Error(message);
  }
  return data as T;
}

export async function submitOrder(payload: {
  tableId: number;
  items: Order["items"];
  note?: string;
}): Promise<{ order: Order }> {
  const res = await safeFetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function adminLogin(password: string): Promise<{ ok: boolean }> {
  const res = await safeFetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return handle(res);
}

export async function fetchOrders(password: string): Promise<{ orders: Order[] }> {
  const res = await safeFetch(`${API_URL}/api/orders`, {
    headers: { "x-admin-password": password },
  });
  return handle(res);
}

export async function updateOrderStatus(
  password: string,
  id: string,
  status: OrderStatus
): Promise<{ order: Order }> {
  const res = await safeFetch(`${API_URL}/api/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-admin-password": password },
    body: JSON.stringify({ status }),
  });
  return handle(res);
}

export async function clearOrders(password: string): Promise<{ ok: boolean }> {
  const res = await safeFetch(`${API_URL}/api/orders`, {
    method: "DELETE",
    headers: { "x-admin-password": password },
  });
  return handle(res);
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}
