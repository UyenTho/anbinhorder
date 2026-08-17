export type OrderStatus = "moi" | "dang_lam" | "xong" | "huy";

export interface OrderItem {
  itemId: string;
  name: string;
  price: number | null; // null = giá theo thời giá / liên hệ
  quantity: number;
  note?: string;
}

export interface Order {
  id: string;
  tableId: number;
  items: OrderItem[];
  note?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  tableId: number;
  items: OrderItem[];
  note?: string;
}
