"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { CloseIcon } from "@/components/icons";

export function AdminLoginModal() {
  const { loginOpen, closeLogin, login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (!loginOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    const mensaje = await login(email.trim(), password);
    setEnviando(false);
    if (mensaje === null) {
      setEmail("");
      setPassword("");
      setError(null);
      router.push("/admin");
    } else {
      setError(mensaje);
    }
  }

  function handleClose() {
    setEmail("");
    setPassword("");
    setError(null);
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
            <label className="block text-sm text-neutral-600" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
            />
          </div>

          {error && <p className="text-sm text-[#c2185b]">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-neutral-900 py-3 text-sm text-white transition-colors hover:bg-[#c2185b] disabled:opacity-60"
          >
            {enviando ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
