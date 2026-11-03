"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createSyncedStore } from "@/lib/syncedStore";

const SESSION_KEY = "magenta_admin_session";
const ADMIN_USER = "admin";
const ADMIN_PASS = "123";

const sessionStore = createSyncedStore<boolean>(SESSION_KEY, false, "session");

interface AdminAuthContextValue {
  isAdmin: boolean;
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  login: (usuario: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const isAdmin = useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
    sessionStore.getServerSnapshot,
  );
  const [loginOpen, setLoginOpen] = useState(false);

  function login(usuario: string, password: string) {
    const ok = usuario === ADMIN_USER && password === ADMIN_PASS;
    if (ok) {
      sessionStore.set(true);
      setLoginOpen(false);
    }
    return ok;
  }

  function logout() {
    sessionStore.set(false);
  }

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isAdmin,
      loginOpen,
      openLogin: () => setLoginOpen(true),
      closeLogin: () => setLoginOpen(false),
      login,
      logout,
    }),
    [isAdmin, loginOpen],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth debe usarse dentro de AdminAuthProvider");
  return ctx;
}
