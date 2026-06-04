"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { MenuItem } from "@/lib/menu";

export type CartLine = {
  item: MenuItem;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

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
              line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line
            );
          }

          return [...current, { item, quantity: 1 }];
        });
      },
      removeItem: (id) => setLines((current) => current.filter((line) => line.item.id !== id)),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          setLines((current) => current.filter((line) => line.item.id !== id));
          return;
        }

        setLines((current) =>
          current.map((line) => (line.item.id === id ? { ...line, quantity } : line))
        );
      },
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
