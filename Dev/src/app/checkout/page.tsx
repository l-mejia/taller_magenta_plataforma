"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart, formatMonto, parsePrecio } from "@/context/CartContext";

type Estado = "carrito" | "procesando" | "exito";

export default function CheckoutPage() {
  const { lines, totalMonto, clear } = useCart();
  const [estado, setEstado] = useState<Estado>("carrito");
  const [orden, setOrden] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEstado("procesando");
    window.setTimeout(() => {
      setOrden(`MG-${Date.now().toString().slice(-8)}`);
      setEstado("exito");
      clear();
    }, 1400);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
      {estado === "exito" ? (
        <div className="text-center">
          <h1 className="text-2xl font-medium text-neutral-900">
            ¡Pago simulado con éxito!
          </h1>
          <p className="mt-3 text-neutral-600">
            Pedido {orden}. Esta es una simulación de pago: la integración
            real con la pasarela EasyPay se habilitará cuando el backend
            esté disponible.
          </p>
          <Link
            href="/tienda"
            className="mt-8 inline-block border-b border-transparent pb-0.5 text-sm text-neutral-700 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
          >
            Volver a la tienda
          </Link>
        </div>
      ) : lines.length === 0 ? (
        <div className="text-center">
          <h1 className="text-2xl font-medium text-neutral-900">
            Tu carrito está vacío
          </h1>
          <Link
            href="/tienda"
            className="mt-6 inline-block border-b border-transparent pb-0.5 text-sm text-neutral-700 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
          >
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-medium text-neutral-900">Checkout</h1>

          <ul className="mt-8 divide-y divide-black/5">
            {lines.map(({ item, cantidad }) => (
              <li key={item.id} className="flex justify-between py-3 text-sm">
                <span className="text-neutral-700">
                  {item.titulo} × {cantidad}
                </span>
                <span className="text-neutral-900">
                  {formatMonto(parsePrecio(item.precio) * cantidad)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between border-t border-black/10 pt-4 text-neutral-900">
            <span>Total</span>
            <span>{formatMonto(totalMonto)}</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <div>
              <label className="block text-sm text-neutral-600" htmlFor="nombre">
                Nombre
              </label>
              <input
                id="nombre"
                required
                className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-600" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
              />
            </div>

            <div className="flex items-center justify-between rounded-sm border border-black/10 px-4 py-3 text-sm text-neutral-600">
              <span>Método de pago</span>
              <span className="font-medium text-neutral-900">EasyPay</span>
            </div>

            <button
              type="submit"
              disabled={estado === "procesando"}
              className="flex w-full items-center justify-center bg-neutral-900 py-3 text-sm text-white transition-colors hover:bg-[#c2185b] disabled:opacity-60"
            >
              {estado === "procesando" ? "Procesando pago…" : "Pagar con EasyPay"}
            </button>

            <p className="text-center text-xs text-neutral-400">
              Simulación de pago — la integración real con EasyPay se
              habilitará junto con el backend.
            </p>
          </form>
        </>
      )}
    </main>
  );
}
