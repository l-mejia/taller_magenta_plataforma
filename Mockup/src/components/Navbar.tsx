"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminHoldTrigger } from "@/components/admin/AdminHoldTrigger";
import { CartIcon, CloseIcon, MenuIcon } from "./icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/exposiciones", label: "Exposiciones" },
  { href: "/tienda", label: "Tienda" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { isAdmin, logout } = useAdminAuth();
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <AdminHoldTrigger className="text-lg font-medium tracking-wide">
          Magenta
        </AdminHoldTrigger>

        <nav className="hidden gap-8 font-heading text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`border-b pb-0.5 transition-colors ${
                isActive(link.href)
                  ? "border-[#c2185b] text-[#c2185b]"
                  : "border-transparent text-neutral-600 hover:text-[#c2185b]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              aria-current={isActive("/admin") ? "page" : undefined}
              className={`border-b pb-0.5 transition-colors ${
                isActive("/admin")
                  ? "border-[#c2185b] text-[#c2185b]"
                  : "border-transparent text-neutral-600 hover:text-[#c2185b]"
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <button
              type="button"
              onClick={logout}
              className="hidden text-xs text-neutral-400 hover:text-[#c2185b] md:inline"
            >
              Cerrar sesión
            </button>
          )}

          <button
            type="button"
            aria-label="Abrir carrito"
            onClick={openCart}
            className="relative text-neutral-800 hover:text-[#c2185b]"
          >
            <CartIcon className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c2185b] px-1 text-[10px] text-white">
                {totalItems}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
            className="text-neutral-800 md:hidden"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/5 bg-white px-6 py-4 font-heading md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`py-2 transition-colors ${
                isActive(link.href)
                  ? "text-[#c2185b]"
                  : "text-neutral-700 hover:text-[#c2185b]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className={`py-2 transition-colors ${
                  isActive("/admin") ? "text-[#c2185b]" : "text-neutral-700 hover:text-[#c2185b]"
                }`}
              >
                Admin
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="py-2 text-left text-sm text-neutral-400 hover:text-[#c2185b]"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
