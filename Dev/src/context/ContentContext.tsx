"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { exposiciones as exposicionesSeed, type Exposicion } from "@/data/exposiciones";
import { tienda as tiendaSeed, type ItemTienda } from "@/data/tienda";
import type { MediaItem } from "@/data/media";
import { formatMonto, parsePrecio } from "@/context/CartContext";
import { generateId } from "@/lib/id";
import { borrarMedia } from "@/lib/storage";
import { requireSupabase, supabase, SUPABASE_NO_CONFIGURADO } from "@/lib/supabase";

// --- Mapeo entre filas de Postgres (snake_case) y los tipos de la app -------

interface ExposicionRow {
  id: string;
  titulo: string;
  descripcion: string;
  parrafo_explicativo: string;
  bio_artista: string;
  media: MediaItem[];
}

interface ItemTiendaRow {
  id: string;
  categoria: ItemTienda["categoria"];
  tipo: string;
  titulo: string;
  autor: string;
  precio: number | string;
  descripcion: string;
  medidas: string;
  tecnica: string;
  ano: number | null;
  stock: number;
  media: MediaItem[];
}

function rowToExposicion(row: ExposicionRow): Exposicion {
  return {
    id: row.id,
    titulo: row.titulo,
    descripcion: row.descripcion,
    parrafoExplicativo: row.parrafo_explicativo,
    bioArtista: row.bio_artista,
    media: row.media ?? [],
  };
}

function exposicionToRow(e: Exposicion): ExposicionRow {
  return {
    id: e.id,
    titulo: e.titulo,
    descripcion: e.descripcion,
    parrafo_explicativo: e.parrafoExplicativo,
    bio_artista: e.bioArtista,
    media: e.media,
  };
}

function rowToItem(row: ItemTiendaRow): ItemTienda {
  return {
    id: row.id,
    categoria: row.categoria,
    tipo: row.tipo,
    titulo: row.titulo,
    autor: row.autor,
    precio: formatMonto(Number(row.precio)),
    descripcion: row.descripcion,
    medidas: row.medidas,
    tecnica: row.tecnica,
    ano: row.ano ?? new Date().getFullYear(),
    stock: row.stock,
    media: row.media ?? [],
  };
}

function itemToRow(i: ItemTienda): ItemTiendaRow {
  return {
    id: i.id,
    categoria: i.categoria,
    tipo: i.tipo,
    titulo: i.titulo,
    autor: i.autor,
    precio: parsePrecio(i.precio),
    descripcion: i.descripcion,
    medidas: i.medidas,
    tecnica: i.tecnica,
    ano: i.ano,
    stock: i.stock,
    media: i.media,
  };
}

/** Media que estaba antes y ya no está: se borra del storage para no dejar huérfanos. */
function mediaQuitada(antes: MediaItem[], despues: MediaItem[]): MediaItem[] {
  const urls = new Set(despues.map((m) => m.url));
  return antes.filter((m) => !urls.has(m.url));
}

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

// --- Contexto ---------------------------------------------------------------

interface ContentContextValue {
  exposiciones: Exposicion[];
  tienda: ItemTienda[];
  loading: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  addExposicion: (data: Omit<Exposicion, "id">) => Promise<Exposicion>;
  updateExposicion: (id: string, data: Omit<Exposicion, "id">) => Promise<void>;
  deleteExposicion: (id: string) => Promise<void>;
  addItemTienda: (data: Omit<ItemTienda, "id">) => Promise<ItemTienda>;
  updateItemTienda: (id: string, data: Omit<ItemTienda, "id">) => Promise<void>;
  deleteItemTienda: (id: string) => Promise<void>;
  cargarContenidoDeEjemplo: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [exposiciones, setExposiciones] = useState<Exposicion[]>([]);
  const [tienda, setTienda] = useState<ItemTienda[]>([]);
  const [loading, setLoading] = useState(supabase !== null);
  const [error, setError] = useState<string | null>(supabase ? null : SUPABASE_NO_CONFIGURADO);

  const recargar = useCallback(async () => {
    if (!supabase) return;
    try {
      const [expos, items] = await Promise.all([
        supabase.from("exposiciones").select("*").order("created_at", { ascending: false }),
        supabase.from("items_tienda").select("*").order("created_at", { ascending: false }),
      ]);
      setExposiciones((check(expos) ?? []).map((r) => rowToExposicion(r as ExposicionRow)));
      setTienda((check(items) ?? []).map((r) => rowToItem(r as ItemTiendaRow)));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el contenido.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial desde Supabase; los setState ocurren al resolver la promesa
    void recargar();
  }, [recargar]);

  async function addExposicion(data: Omit<Exposicion, "id">) {
    const nueva: Exposicion = {
      ...data,
      id: generateId(data.titulo, exposiciones.map((e) => e.id)),
    };
    const row = check(
      await requireSupabase().from("exposiciones").insert(exposicionToRow(nueva)).select().single(),
    );
    const creada = rowToExposicion(row as ExposicionRow);
    setExposiciones((prev) => [creada, ...prev]);
    return creada;
  }

  async function updateExposicion(id: string, data: Omit<Exposicion, "id">) {
    const anterior = exposiciones.find((e) => e.id === id);
    const row = check(
      await requireSupabase()
        .from("exposiciones")
        .update(exposicionToRow({ ...data, id }))
        .eq("id", id)
        .select()
        .single(),
    );
    const actualizada = rowToExposicion(row as ExposicionRow);
    setExposiciones((prev) => prev.map((e) => (e.id === id ? actualizada : e)));
    if (anterior) await borrarMedia(mediaQuitada(anterior.media, data.media));
  }

  async function deleteExposicion(id: string) {
    const anterior = exposiciones.find((e) => e.id === id);
    check(await requireSupabase().from("exposiciones").delete().eq("id", id));
    setExposiciones((prev) => prev.filter((e) => e.id !== id));
    if (anterior) await borrarMedia(anterior.media);
  }

  async function addItemTienda(data: Omit<ItemTienda, "id">) {
    const nuevo: ItemTienda = {
      ...data,
      id: generateId(`${data.tipo}-${data.titulo}`, tienda.map((t) => t.id)),
    };
    const row = check(
      await requireSupabase().from("items_tienda").insert(itemToRow(nuevo)).select().single(),
    );
    const creado = rowToItem(row as ItemTiendaRow);
    setTienda((prev) => [creado, ...prev]);
    return creado;
  }

  async function updateItemTienda(id: string, data: Omit<ItemTienda, "id">) {
    const anterior = tienda.find((t) => t.id === id);
    const row = check(
      await requireSupabase()
        .from("items_tienda")
        .update(itemToRow({ ...data, id }))
        .eq("id", id)
        .select()
        .single(),
    );
    const actualizado = rowToItem(row as ItemTiendaRow);
    setTienda((prev) => prev.map((t) => (t.id === id ? actualizado : t)));
    if (anterior) await borrarMedia(mediaQuitada(anterior.media, data.media));
  }

  async function deleteItemTienda(id: string) {
    const anterior = tienda.find((t) => t.id === id);
    check(await requireSupabase().from("items_tienda").delete().eq("id", id));
    setTienda((prev) => prev.filter((t) => t.id !== id));
    if (anterior) await borrarMedia(anterior.media);
  }

  /** Reemplaza todo el contenido por el de ejemplo de src/data (para pruebas internas). */
  async function cargarContenidoDeEjemplo() {
    const db = requireSupabase();
    const ahora = Date.now();
    // created_at escalonado para que el orden "más nuevo primero" respete el del seed
    const conFecha = <T,>(rows: T[]) =>
      rows.map((r, i) => ({ ...r, created_at: new Date(ahora - i * 1000).toISOString() }));

    check(await db.from("exposiciones").delete().neq("id", ""));
    check(await db.from("items_tienda").delete().neq("id", ""));
    await borrarMedia([...exposiciones, ...tienda].flatMap((x) => x.media));
    check(await db.from("exposiciones").insert(conFecha(exposicionesSeed.map(exposicionToRow))));
    check(await db.from("items_tienda").insert(conFecha(tiendaSeed.map(itemToRow))));
    await recargar();
  }

  const value = useMemo<ContentContextValue>(
    () => ({
      exposiciones,
      tienda,
      loading,
      error,
      recargar,
      addExposicion,
      updateExposicion,
      deleteExposicion,
      addItemTienda,
      updateItemTienda,
      deleteItemTienda,
      cargarContenidoDeEjemplo,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- las funciones se redefinen cada render pero solo dependen de exposiciones/tienda, ya listados
    [exposiciones, tienda, loading, error, recargar],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent debe usarse dentro de ContentProvider");
  return ctx;
}
