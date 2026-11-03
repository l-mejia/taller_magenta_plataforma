"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase, SUPABASE_NO_CONFIGURADO } from "@/lib/supabase";

interface AdminAuthContextValue {
  isAdmin: boolean;
  /** true mientras se recupera la sesión guardada, para no mostrar "acceso restringido" de golpe */
  authLoading: boolean;
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  /** Devuelve null si entró, o el mensaje de error. */
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

async function esAdmin(userId: string): Promise<boolean> {
  if (!supabase) return false;
  // RLS solo deja ver la fila propia: si existe, es admin
  const { data } = await supabase.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
  return data !== null;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(supabase !== null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      if (!session) setAuthLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // la consulta va fuera del callback de onAuthStateChange: hacer llamadas a Supabase ahí adentro puede trabar el cliente
  useEffect(() => {
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sin sesión no hay nada que consultar
      setIsAdmin(false);
      return;
    }
    let vigente = true;
    esAdmin(userId).then((ok) => {
      if (!vigente) return;
      setIsAdmin(ok);
      setAuthLoading(false);
    });
    return () => {
      vigente = false;
    };
  }, [userId]);

  async function login(email: string, password: string) {
    if (!supabase) return SUPABASE_NO_CONFIGURADO;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return "Email o contraseña incorrectos.";
    if (!(await esAdmin(data.user.id))) {
      await supabase.auth.signOut();
      return "Esta cuenta no tiene permisos de administrador.";
    }
    setLoginOpen(false);
    return null;
  }

  async function logout() {
    await supabase?.auth.signOut();
  }

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isAdmin,
      authLoading,
      loginOpen,
      openLogin: () => setLoginOpen(true),
      closeLogin: () => setLoginOpen(false),
      login,
      logout,
    }),
    [isAdmin, authLoading, loginOpen],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth debe usarse dentro de AdminAuthProvider");
  return ctx;
}
