import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CartLine, MenuItem } from "../types";

interface CartContextValue {
  lines: CartLine[];
  totalItems: number;
  totalPrice: number;
  hasUnknownPriceItem: boolean;
  addItem: (item: MenuItem, quantity: number, note: string) => void;
  updateLine: (key: string, quantity: number, note: string) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function storageKey(tableId: number) {
  return `an-binh-cart-table-${tableId}`;
}

export function CartProvider({ tableId, children }: { tableId: number; children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey(tableId));
      return raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey(tableId), JSON.stringify(lines));
  }, [lines, tableId]);

  const addItem = useCallback((item: MenuItem, quantity: number, note: string) => {
    setLines((prev) => {
      const key = `${item.id}::${note.trim()}`;
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, quantity: l.quantity + quantity } : l));
      }
      return [
        ...prev,
        {
          key,
          itemId: item.id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity,
          note: note.trim(),
        },
      ];
    });
  }, []);

  const updateLine = useCallback((key: string, quantity: number, note: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, quantity, note: note.trim() } : l))
        .filter((l) => l.quantity > 0)
    );
  }, []);

  const removeLine = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
  }, []);

  const totalItems = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const totalPrice = useMemo(
    () => lines.reduce((sum, l) => sum + (l.price ?? 0) * l.quantity, 0),
    [lines]
  );
  const hasUnknownPriceItem = useMemo(() => lines.some((l) => l.price === null), [lines]);

  const value: CartContextValue = {
    lines,
    totalItems,
    totalPrice,
    hasUnknownPriceItem,
    addItem,
    updateLine,
    removeLine,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải được dùng trong CartProvider");
  return ctx;
}
