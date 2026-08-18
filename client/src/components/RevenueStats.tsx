import { useMemo } from "react";
import { Order } from "../types";
import { formatCurrency } from "../lib/format";
import { isToday } from "../lib/format";
import "./RevenueStats.css";

export function RevenueStats({ orders }: { orders: Order[] }) {
  const stats = useMemo(() => {
    const todayOrders = orders.filter((o) => isToday(o.createdAt) && o.status !== "huy");

    let revenue = 0;
    let itemCount = 0;
    let unknownPriceItemCount = 0;

    todayOrders.forEach((order) => {
      order.items.forEach((item) => {
        itemCount += item.quantity;
        if (item.price === null) {
          unknownPriceItemCount += item.quantity;
        } else {
          revenue += item.price * item.quantity;
        }
      });
    });

    const revenueByTable = new Map<number, number>();
    todayOrders.forEach((order) => {
      const orderTotal = order.items.reduce(
        (sum, item) => sum + (item.price ?? 0) * item.quantity,
        0
      );
      revenueByTable.set(order.tableId, (revenueByTable.get(order.tableId) ?? 0) + orderTotal);
    });
    const topTable = [...revenueByTable.entries()].sort((a, b) => b[1] - a[1])[0];

    return {
      orderCount: todayOrders.length,
      revenue,
      itemCount,
      unknownPriceItemCount,
      topTable,
    };
  }, [orders]);

  return (
    <section className="ab-revenue" aria-label="Thống kê doanh thu hôm nay">
      <div className="ab-revenue__main">
        <span className="ab-revenue__label">Doanh thu hôm nay</span>
        <span className="ab-revenue__amount">{formatCurrency(stats.revenue)}</span>
      </div>
      <div className="ab-revenue__meta">
        <div className="ab-revenue__stat">
          <span className="ab-revenue__stat-value">{stats.orderCount}</span>
          <span className="ab-revenue__stat-label">đơn</span>
        </div>
        <div className="ab-revenue__stat">
          <span className="ab-revenue__stat-value">{stats.itemCount}</span>
          <span className="ab-revenue__stat-label">món</span>
        </div>
        {stats.topTable && (
          <div className="ab-revenue__stat">
            <span className="ab-revenue__stat-value">Bàn {stats.topTable[0]}</span>
            <span className="ab-revenue__stat-label">cao nhất</span>
          </div>
        )}
      </div>
      {stats.unknownPriceItemCount > 0 && (
        <p className="ab-revenue__note">
          Chưa gồm {stats.unknownPriceItemCount} món tính theo thời giá (chưa có giá cố định).
        </p>
      )}
    </section>
  );
}
