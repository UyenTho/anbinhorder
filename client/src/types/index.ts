export interface MenuItem {
  id: string;
  name: string;
  /** null = giá theo thời giá / liên hệ trực tiếp */
  price: number | null;
  /** đơn vị hiển thị sau giá, vd "/con", "/kg", "/tô", "/ống" */
  unit?: string;
  /** các lựa chọn chế biến, vd ["Luộc", "Nướng"] - không đổi giá */
  options?: string[];
  tag?: string;
}

export interface MenuSubGroup {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface MenuCategory {
  id: string;
  title: string;
  subtitle?: string;
  /** ảnh bảng thực đơn gốc, dùng làm ảnh bìa cho danh mục */
  image?: string;
  groups: MenuSubGroup[];
}

export type OrderStatus = "moi" | "dang_lam" | "xong" | "huy";

export interface OrderItem {
  itemId: string;
  name: string;
  price: number | null;
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

export interface CartLine {
  key: string;
  itemId: string;
  name: string;
  price: number | null;
  unit?: string;
  quantity: number;
  note: string;
}
