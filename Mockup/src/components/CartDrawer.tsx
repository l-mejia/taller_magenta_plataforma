"use client";

import Link from "next/link";
import { useCart, formatMonto, parsePrecio } from "@/context/CartContext";
import { CloseIcon } from "./icons";

export function CartDrawer() {
  const { lines, isOpen, closeCart, setQuantity, removeItem, totalMonto } = useCart();

  return (
    <div
      className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <h2 className="text-lg font-medium text-neutral-900">Carrito</h2>
          <button
            type="button"
            aria-label="Cerrar carrito"
            onClick={closeCart}
            className="text-neutral-500 hover:text-[#c2185b]"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <p className="text-sm text-neutral-500">Tu carrito está vacío.</p>
          ) : (
            <ul className="space-y-6">
              {lines.map(({ item, cantidad }) => (
                <li key={item.id} className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-neutral-900">{item.titulo}</p>
                    <p className="text-xs text-neutral-500">{item.autor}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <button
                        type="button"
                        aria-label="Disminuir cantidad"
                        onClick={() => setQuantity(item.id, cantidad - 1)}
                        className="h-6 w-6 rounded-full border border-black/10 text-neutral-600 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
                      >
                        −
                      </button>
                      <span className="w-4 text-center">{cantidad}</span>
                      <button
                        type="button"
                        aria-label="Aumentar cantidad"
                        onClick={() => setQuantity(item.id, cantidad + 1)}
                        className="h-6 w-6 rounded-full border border-black/10 text-neutral-600 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-xs text-neutral-400 hover:text-[#c2185b]"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  <span className="text-sm text-neutral-900">
                    {formatMonto(parsePrecio(item.precio) * cantidad)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-black/5 px-6 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Subtotal</span>
              <span className="text-neutral-900">{formatMonto(totalMonto)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-4 flex w-full items-center justify-center bg-neutral-900 py-3 text-sm text-white transition-colors hover:bg-[#c2185b]"
            >
              Ir a pagar
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
