import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { menu } from "../data/menu";
import { MenuItem } from "../types";
import { CartProvider, useCart } from "../context/CartContext";
import { Header } from "../components/Header";
import { CategoryNav } from "../components/CategoryNav";
import { CategorySection } from "../components/CategorySection";
import { AddItemSheet } from "../components/AddItemSheet";
import { CartBar } from "../components/CartBar";
import { CartDrawer } from "../components/CartDrawer";
import { OrderSuccessModal } from "../components/OrderSuccessModal";
import { submitOrder } from "../lib/api";
import { TablePicker } from "./TablePicker";
import "./CustomerMenu.css";

function CustomerMenuInner({ tableId }: { tableId: number }) {
  const { lines, addItem, clearCart } = useCart();
  const [activeCategory, setActiveCategory] = useState(menu[0].id);
  const [sheetItem, setSheetItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveCategory(visible.target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0.01 }
    );
    const nodes = Object.values(sectionRefs.current).filter(Boolean) as HTMLDivElement[];
    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToCategory(id: string) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleConfirmAdd(quantity: number, note: string) {
    if (!sheetItem) return;
    addItem(sheetItem, quantity, note);
    setSheetItem(null);
  }

  async function handleSubmit(orderNote: string) {
    setSubmitting(true);
    setError(null);
    try {
      await submitOrder({
        tableId,
        items: lines.map((l) => ({
          itemId: l.itemId,
          name: l.name,
          price: l.price,
          quantity: l.quantity,
          note: l.note,
        })),
        note: orderNote,
      });
      clearCart();
      setCartOpen(false);
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không gửi được đơn, vui lòng thử lại");
      setTimeout(() => setError(null), 4000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ab-page">
      <Header tableId={tableId} />
      <CategoryNav activeId={activeCategory} onSelect={scrollToCategory} />

      <main className="ab-main">
        {menu.map((cat) => (
          <CategorySection
            key={cat.id}
            category={cat}
            ref={(el) => {
              sectionRefs.current[cat.id] = el;
            }}
            onAdd={(item) => setSheetItem(item)}
          />
        ))}
        <p className="ab-footnote">Món ăn theo thời giá sẽ được nhân viên báo giá cụ thể khi lên món.</p>
      </main>

      {error && <div className="ab-error-toast">{error}</div>}

      {!cartOpen && <CartBar onOpen={() => setCartOpen(true)} />}

      {sheetItem && (
        <AddItemSheet item={sheetItem} onClose={() => setSheetItem(null)} onConfirm={handleConfirmAdd} />
      )}

      {cartOpen && (
        <CartDrawer onClose={() => setCartOpen(false)} onSubmit={handleSubmit} submitting={submitting} />
      )}

      {success && <OrderSuccessModal onClose={() => setSuccess(false)} />}
    </div>
  );
}

export function CustomerMenu() {
  const [params] = useSearchParams();
  const tableParam = params.get("table");
  const tableId = useMemo(() => (tableParam ? Number(tableParam) : NaN), [tableParam]);

  if (!tableParam || Number.isNaN(tableId) || tableId < 1 || tableId > 10) {
    return <TablePicker />;
  }

  return (
    <CartProvider tableId={tableId}>
      <CustomerMenuInner tableId={tableId} />
    </CartProvider>
  );
}
