import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const MEDIA_BUCKET = "media";

/**
 * Cliente único del navegador. Usa la anon/publishable key: lo que puede
 * leer o escribir lo deciden las políticas RLS de supabase/schema.sql.
 * Es null si faltan las variables de entorno, para que la web muestre un
 * aviso en vez de romperse.
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const SUPABASE_NO_CONFIGURADO =
  "Supabase no está configurado: faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local.";

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error(SUPABASE_NO_CONFIGURADO);
  return supabase;
}
