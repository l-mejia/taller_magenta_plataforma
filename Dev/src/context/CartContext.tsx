"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ItemTienda } from "@/data/tienda";

export interface CartLine {
  item: ItemTienda;
  cantidad: number;
}

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: ItemTienda) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, cantidad: number) => void;
  clear: () => void;
  totalItems: number;
  totalMonto: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function parsePrecio(precio: string): number {
  // "S/ 1,234.50" → 1234.5 (es-PE usa coma de miles y punto decimal)
  return Number(precio.replace(/[^0-9.]/g, "")) || 0;
}

export function formatMonto(monto: number): string {
  return `S/ ${monto.toLocaleString("es-PE")}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function addItem(item: ItemTienda) {
    setLines((prev) => {
      const existente = prev.find((l) => l.item.id === item.id);
      if (existente) {
        if (existente.cantidad >= item.stock) return prev;
        return prev.map((l) =>
          l.item.id === item.id ? { ...l, cantidad: l.cantidad + 1 } : l,
        );
      }
      if (item.stock <= 0) return prev;
      return [...prev, { item, cantidad: 1 }];
    });
  }

  function removeItem(id: string) {
    setLines((prev) => prev.filter((l) => l.item.id !== id));
  }

  function setQuantity(id: string, cantidad: number) {
    setLines((prev) =>
      cantidad <= 0
        ? prev.filter((l) => l.item.id !== id)
        : prev.map((l) =>
            l.item.id === id
              ? { ...l, cantidad: Math.min(cantidad, l.item.stock) }
              : l,
          ),
    );
  }

  function clear() {
    setLines([]);
  }

  const totalItems = lines.reduce((sum, l) => sum + l.cantidad, 0);
  const totalMonto = lines.reduce(
    (sum, l) => sum + parsePrecio(l.item.precio) * l.cantidad,
    0,
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      setQuantity,
      clear,
      totalItems,
      totalMonto,
    }),
    [lines, isOpen, totalItems, totalMonto],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
