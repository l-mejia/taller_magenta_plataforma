"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { CloseIcon } from "@/components/icons";

export function AdminLoginModal() {
  const { loginOpen, closeLogin, login } = useAdminAuth();
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (!loginOpen) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = login(usuario, password);
    if (ok) {
      setUsuario("");
      setPassword("");
      setError(false);
      router.push("/admin");
    } else {
      setError(true);
    }
  }

  function handleClose() {
    setUsuario("");
    setPassword("");
    setError(false);
    closeLogin();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative w-full max-w-sm bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-neutral-900">Acceso administrador</h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={handleClose}
            className="text-neutral-500 hover:text-[#c2185b]"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-neutral-600" htmlFor="admin-usuario">
              Usuario
            </label>
            <input
              id="admin-usuario"
              autoFocus
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-600" htmlFor="admin-password">
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
            />
          </div>

          {error && (
            <p className="text-sm text-[#c2185b]">Usuario o contraseña incorrectos.</p>
          )}

          <button
            type="submit"
            className="w-full bg-neutral-900 py-3 text-sm text-white transition-colors hover:bg-[#c2185b]"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
