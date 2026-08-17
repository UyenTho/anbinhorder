export function formatPrice(price: number | null, unit?: string): string {
  if (price === null) return "Theo thời giá";
  const formatted = price.toLocaleString("vi-VN") + "đ";
  return unit ? `${formatted}${unit}` : formatted;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
