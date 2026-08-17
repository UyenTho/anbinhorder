import { Order, OrderStatus } from "../types";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Có lỗi xảy ra, vui lòng thử lại");
  }
  return data as T;
}

export async function submitOrder(payload: {
  tableId: number;
  items: Order["items"];
  note?: string;
}): Promise<{ order: Order }> {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function adminLogin(password: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return handle(res);
}

export async function fetchOrders(password: string): Promise<{ orders: Order[] }> {
  const res = await fetch(`${API_URL}/api/orders`, {
    headers: { "x-admin-password": password },
  });
  return handle(res);
}

export async function updateOrderStatus(
  password: string,
  id: string,
  status: OrderStatus
): Promise<{ order: Order }> {
  const res = await fetch(`${API_URL}/api/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-admin-password": password },
    body: JSON.stringify({ status }),
  });
  return handle(res);
}

export async function clearOrders(password: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "DELETE",
    headers: { "x-admin-password": password },
  });
  return handle(res);
}
