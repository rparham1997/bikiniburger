"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { menuItems, merchItems, type MenuItem } from "@/lib/menu";

export type CartLine = {
  item: MenuItem;
  quantity: number;
  note?: string;
};

type CartContextValue = {
  lines: CartLine[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateLineNote: (id: string, note: string) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "bikini-burger-cart";
const orderableItems = [...menuItems, ...merchItems].filter((item) => item.price !== undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!savedCart) {
        setHasHydrated(true);
        return;
      }

      const savedLines = JSON.parse(savedCart) as Array<{ id: string; quantity: number; note?: string }>;
      const restoredLines = savedLines.reduce<CartLine[]>((cartLines, line) => {
        const item = orderableItems.find((orderableItem) => orderableItem.id === line.id);
        if (!item) {
          return cartLines;
        }

        const quantity = Math.max(1, Math.min(20, Math.floor(Number(line.quantity) || 1)));
        return [...cartLines, { item, quantity, note: String(line.note || "").slice(0, 180) }];
      }, []);
      setLines(restoredLines);
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(lines.map((line) => ({ id: line.item.id, quantity: line.quantity, note: line.note || "" })))
    );
  }, [hasHydrated, lines]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((sum, line) => sum + (line.item.price ?? 0) * line.quantity, 0);
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);

    return {
      lines,
      subtotal,
      count,
      addItem: (item) => {
        if (item.price === undefined) {
          return;
        }

        setLines((current) => {
          const existing = current.find((line) => line.item.id === item.id);
          if (existing) {
            return current.map((line) =>
              line.item.id === item.id ? { ...line, quantity: Math.min(20, line.quantity + 1) } : line
            );
          }

          return [...current, { item, quantity: 1, note: "" }];
        });
      },
      removeItem: (id) => setLines((current) => current.filter((line) => line.item.id !== id)),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          setLines((current) => current.filter((line) => line.item.id !== id));
          return;
        }

        setLines((current) =>
          current.map((line) =>
            line.item.id === id ? { ...line, quantity: Math.min(20, Math.floor(quantity)) } : line
          )
        );
      },
      updateLineNote: (id, note) =>
        setLines((current) =>
          current.map((line) => (line.item.id === id ? { ...line, note: note.slice(0, 180) } : line))
        ),
      clearCart: () => setLines([])
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
