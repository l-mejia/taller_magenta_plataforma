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
import { artistas as artistasSeed, type Artista } from "@/data/artistas";
import { exposiciones as exposicionesSeed, ordenarPorFecha as ordenarExposiciones, type Exposicion } from "@/data/exposiciones";
import { tienda as tiendaSeed, type ItemTienda } from "@/data/tienda";
import { revista as revistaSeed, type Publicacion } from "@/data/revista";
import type { MediaItem } from "@/data/media";
import { formatMonto, parsePrecio } from "@/context/CartContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { generateId } from "@/lib/id";
import { borrarMedia } from "@/lib/storage";
import { requireSupabase, supabase, SUPABASE_NO_CONFIGURADO } from "@/lib/supabase";

// --- Mapeo entre filas de Postgres (snake_case) y los tipos de la app -------

interface ArtistaRow {
  id: string;
  nombre: string;
  region: string;
  bio: string;
  instagram: string;
  foto_url: string | null;
}

interface ExposicionRow {
  id: string;
  titulo: string;
  descripcion: string;
  parrafo_explicativo: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  publicado: boolean;
  media: MediaItem[];
  exposicion_artistas?: { artista_id: string; orden: number }[];
}

interface ItemTiendaRow {
  id: string;
  categoria: ItemTienda["categoria"];
  tipo: string;
  titulo: string;
  artista_id: string | null;
  autor: string;
  precio: number | string;
  descripcion: string;
  medidas: string;
  tecnica: string;
  ano: number | null;
  stock: number;
  visible: boolean;
  media: MediaItem[];
}

interface PublicacionRow {
  id: string;
  tipo: Publicacion["tipo"];
  titulo: string;
  resumen: string;
  cuerpo: string;
  autor: string;
  fecha: string;
  publicado: boolean;
  media: MediaItem[];
  revista_artistas?: { artista_id: string; orden: number }[];
}

function rowToPublicacion(row: PublicacionRow): Publicacion {
  return {
    id: row.id,
    tipo: row.tipo,
    titulo: row.titulo,
    resumen: row.resumen,
    cuerpo: row.cuerpo,
    autor: row.autor,
    fecha: row.fecha,
    publicado: row.publicado,
    media: row.media ?? [],
    artistaIds: [...(row.revista_artistas ?? [])]
      .sort((a, b) => a.orden - b.orden)
      .map((r) => r.artista_id),
  };
}

function publicacionToRow(p: Publicacion): Omit<PublicacionRow, "revista_artistas"> {
  return {
    id: p.id,
    tipo: p.tipo,
    titulo: p.titulo,
    resumen: p.resumen,
    cuerpo: p.cuerpo,
    autor: p.autor,
    fecha: p.fecha,
    publicado: p.publicado,
    media: p.media,
  };
}

function rowToArtista(row: ArtistaRow): Artista {
  return {
    id: row.id,
    nombre: row.nombre,
    region: row.region,
    bio: row.bio,
    instagram: row.instagram,
    fotoUrl: row.foto_url,
  };
}

function artistaToRow(a: Artista): ArtistaRow {
  return {
    id: a.id,
    nombre: a.nombre,
    region: a.region,
    bio: a.bio,
    instagram: a.instagram.replace(/^@/, ""),
    foto_url: a.fotoUrl,
  };
}

function rowToExposicion(row: ExposicionRow): Exposicion {
  return {
    id: row.id,
    titulo: row.titulo,
    descripcion: row.descripcion,
    parrafoExplicativo: row.parrafo_explicativo,
    fechaInicio: row.fecha_inicio,
    fechaFin: row.fecha_fin,
    publicado: row.publicado,
    media: row.media ?? [],
    artistaIds: [...(row.exposicion_artistas ?? [])]
      .sort((a, b) => a.orden - b.orden)
      .map((r) => r.artista_id),
  };
}

function exposicionToRow(e: Exposicion): Omit<ExposicionRow, "exposicion_artistas"> {
  return {
    id: e.id,
    titulo: e.titulo,
    descripcion: e.descripcion,
    parrafo_explicativo: e.parrafoExplicativo,
    fecha_inicio: e.fechaInicio || null,
    fecha_fin: e.fechaFin || null,
    publicado: e.publicado,
    media: e.media,
  };
}

function rowToItem(row: ItemTiendaRow): ItemTienda {
  return {
    id: row.id,
    categoria: row.categoria,
    tipo: row.tipo,
    titulo: row.titulo,
    artistaId: row.artista_id,
    autor: row.autor,
    precio: formatMonto(Number(row.precio)),
    descripcion: row.descripcion,
    medidas: row.medidas,
    tecnica: row.tecnica,
    ano: row.ano ?? new Date().getFullYear(),
    stock: row.stock,
    visible: row.visible,
    media: row.media ?? [],
  };
}

function itemToRow(i: ItemTienda): ItemTiendaRow {
  return {
    id: i.id,
    categoria: i.categoria,
    tipo: i.tipo,
    titulo: i.titulo,
    artista_id: i.artistaId,
    autor: i.autor,
    precio: parsePrecio(i.precio),
    descripcion: i.descripcion,
    medidas: i.medidas,
    tecnica: i.tecnica,
    ano: i.ano,
    stock: i.stock,
    visible: i.visible,
    media: i.media,
  };
}

/** Media que estaba antes y ya no está: se borra del storage para no dejar huérfanos. */
function mediaQuitada(antes: MediaItem[], despues: MediaItem[]): MediaItem[] {
  const urls = new Set(despues.map((m) => m.url));
  return antes.filter((m) => !urls.has(m.url));
}

function fotoComoMedia(url: string | null): MediaItem[] {
  return url ? [{ url, tipo: "imagen" }] : [];
}

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

const SELECT_EXPOSICIONES = "*, exposicion_artistas(artista_id, orden)";
const SELECT_REVISTA = "*, revista_artistas(artista_id, orden)";

// --- Contexto ---------------------------------------------------------------

type DatosExposicion = Omit<Exposicion, "id">;
type DatosItem = Omit<ItemTienda, "id">;
type DatosArtista = Omit<Artista, "id">;
type DatosPublicacion = Omit<Publicacion, "id">;

interface ContentContextValue {
  artistas: Artista[];
  exposiciones: Exposicion[];
  tienda: ItemTienda[];
  /** Ordenada de la más reciente a la más antigua. */
  revista: Publicacion[];
  loading: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  artistaPorId: (id: string | null | undefined) => Artista | undefined;
  addArtista: (data: DatosArtista) => Promise<Artista>;
  updateArtista: (id: string, data: DatosArtista) => Promise<void>;
  deleteArtista: (id: string) => Promise<void>;
  addExposicion: (data: DatosExposicion) => Promise<Exposicion>;
  updateExposicion: (id: string, data: DatosExposicion) => Promise<void>;
  deleteExposicion: (id: string) => Promise<void>;
  addItemTienda: (data: DatosItem) => Promise<ItemTienda>;
  updateItemTienda: (id: string, data: DatosItem) => Promise<void>;
  deleteItemTienda: (id: string) => Promise<void>;
  addPublicacion: (data: DatosPublicacion) => Promise<Publicacion>;
  updatePublicacion: (id: string, data: DatosPublicacion) => Promise<void>;
  deletePublicacion: (id: string) => Promise<void>;
  cargarContenidoDeEjemplo: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAdminAuth();
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [exposiciones, setExposiciones] = useState<Exposicion[]>([]);
  const [tiendaRaw, setTiendaRaw] = useState<ItemTienda[]>([]);
  const [revista, setRevista] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(supabase !== null);
  const [error, setError] = useState<string | null>(supabase ? null : SUPABASE_NO_CONFIGURADO);

  const recargar = useCallback(async () => {
    if (!supabase) return;
    try {
      const [arts, expos, items, pubs] = await Promise.all([
        supabase.from("artistas").select("*").order("nombre"),
        supabase
          .from("exposiciones")
          .select(SELECT_EXPOSICIONES)
          .order("created_at", { ascending: false }),
        supabase.from("items_tienda").select("*").order("created_at", { ascending: false }),
        supabase
          .from("revista")
          .select(SELECT_REVISTA)
          .order("fecha", { ascending: false })
          .order("created_at", { ascending: false }),
      ]);
      setArtistas((check(arts) ?? []).map((r) => rowToArtista(r as ArtistaRow)));
      setExposiciones(ordenarExposiciones((check(expos) ?? []).map((r) => rowToExposicion(r as ExposicionRow))));
      setTiendaRaw((check(items) ?? []).map((r) => rowToItem(r as ItemTiendaRow)));
      setRevista((check(pubs) ?? []).map((r) => rowToPublicacion(r as PublicacionRow)));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el contenido.");
    } finally {
      setLoading(false);
    }
  }, []);

  // se recarga al entrar o salir como admin: el admin también ve borradores y productos ocultos
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga desde Supabase; los setState ocurren al resolver la promesa
    void recargar();
  }, [recargar, isAdmin]);

  const artistasPorId = useMemo(() => new Map(artistas.map((a) => [a.id, a])), [artistas]);

  // el nombre del autor sale del catálogo, así un cambio de nombre se ve en todos sus productos
  const tienda = useMemo(
    () =>
      tiendaRaw.map((i) => {
        const artista = i.artistaId ? artistasPorId.get(i.artistaId) : undefined;
        return artista ? { ...i, autor: artista.nombre } : i;
      }),
    [tiendaRaw, artistasPorId],
  );

  function conAutor(data: DatosItem): DatosItem {
    const artista = data.artistaId ? artistasPorId.get(data.artistaId) : undefined;
    return { ...data, autor: artista?.nombre ?? data.autor };
  }

  // --- Artistas ---

  async function addArtista(data: DatosArtista) {
    const nuevo: Artista = { ...data, id: generateId(data.nombre, artistas.map((a) => a.id)) };
    const row = check(
      await requireSupabase().from("artistas").insert(artistaToRow(nuevo)).select().single(),
    );
    const creado = rowToArtista(row as ArtistaRow);
    setArtistas((prev) => [...prev, creado].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    return creado;
  }

  async function updateArtista(id: string, data: DatosArtista) {
    const anterior = artistasPorId.get(id);
    const row = check(
      await requireSupabase()
        .from("artistas")
        .update(artistaToRow({ ...data, id }))
        .eq("id", id)
        .select()
        .single(),
    );
    const actualizado = rowToArtista(row as ArtistaRow);
    setArtistas((prev) =>
      prev.map((a) => (a.id === id ? actualizado : a)).sort((a, b) => a.nombre.localeCompare(b.nombre)),
    );
    if (anterior) await borrarMedia(mediaQuitada(fotoComoMedia(anterior.fotoUrl), fotoComoMedia(data.fotoUrl)));
  }

  async function deleteArtista(id: string) {
    const anterior = artistasPorId.get(id);
    check(await requireSupabase().from("artistas").delete().eq("id", id));
    setArtistas((prev) => prev.filter((a) => a.id !== id));
    // la base ya quitó el vínculo en exposiciones (cascade) y en tienda (set null)
    setExposiciones((prev) =>
      prev.map((e) => ({ ...e, artistaIds: e.artistaIds.filter((a) => a !== id) })),
    );
    setTiendaRaw((prev) => prev.map((i) => (i.artistaId === id ? { ...i, artistaId: null } : i)));
    setRevista((prev) =>
      prev.map((p) => ({ ...p, artistaIds: p.artistaIds.filter((a) => a !== id) })),
    );
    if (anterior) await borrarMedia(fotoComoMedia(anterior.fotoUrl));
  }

  // --- Exposiciones ---

  async function guardarArtistasDeExposicion(exposicionId: string, artistaIds: string[]) {
    const db = requireSupabase();
    check(await db.from("exposicion_artistas").delete().eq("exposicion_id", exposicionId));
    if (artistaIds.length === 0) return;
    check(
      await db.from("exposicion_artistas").insert(
        artistaIds.map((artista_id, orden) => ({ exposicion_id: exposicionId, artista_id, orden })),
      ),
    );
  }

  async function addExposicion(data: DatosExposicion) {
    const nueva: Exposicion = {
      ...data,
      id: generateId(data.titulo, exposiciones.map((e) => e.id)),
    };
    check(await requireSupabase().from("exposiciones").insert(exposicionToRow(nueva)));
    await guardarArtistasDeExposicion(nueva.id, nueva.artistaIds);
    setExposiciones((prev) => ordenarExposiciones([nueva, ...prev]));
    return nueva;
  }

  async function updateExposicion(id: string, data: DatosExposicion) {
    const anterior = exposiciones.find((e) => e.id === id);
    const actualizada: Exposicion = { ...data, id };
    check(
      await requireSupabase().from("exposiciones").update(exposicionToRow(actualizada)).eq("id", id),
    );
    await guardarArtistasDeExposicion(id, data.artistaIds);
    setExposiciones((prev) => ordenarExposiciones(prev.map((e) => (e.id === id ? actualizada : e))));
    if (anterior) await borrarMedia(mediaQuitada(anterior.media, data.media));
  }

  async function deleteExposicion(id: string) {
    const anterior = exposiciones.find((e) => e.id === id);
    check(await requireSupabase().from("exposiciones").delete().eq("id", id));
    setExposiciones((prev) => prev.filter((e) => e.id !== id));
    if (anterior) await borrarMedia(anterior.media);
  }

  // --- Tienda ---

  async function addItemTienda(data: DatosItem) {
    const nuevo: ItemTienda = {
      ...conAutor(data),
      id: generateId(`${data.tipo}-${data.titulo}`, tiendaRaw.map((t) => t.id)),
    };
    const row = check(
      await requireSupabase().from("items_tienda").insert(itemToRow(nuevo)).select().single(),
    );
    const creado = rowToItem(row as ItemTiendaRow);
    setTiendaRaw((prev) => [creado, ...prev]);
    return creado;
  }

  async function updateItemTienda(id: string, data: DatosItem) {
    const anterior = tiendaRaw.find((t) => t.id === id);
    const row = check(
      await requireSupabase()
        .from("items_tienda")
        .update(itemToRow({ ...conAutor(data), id }))
        .eq("id", id)
        .select()
        .single(),
    );
    const actualizado = rowToItem(row as ItemTiendaRow);
    setTiendaRaw((prev) => prev.map((t) => (t.id === id ? actualizado : t)));
    if (anterior) await borrarMedia(mediaQuitada(anterior.media, data.media));
  }

  async function deleteItemTienda(id: string) {
    const anterior = tiendaRaw.find((t) => t.id === id);
    check(await requireSupabase().from("items_tienda").delete().eq("id", id));
    setTiendaRaw((prev) => prev.filter((t) => t.id !== id));
    if (anterior) await borrarMedia(anterior.media);
  }

  // --- Revista ---

  async function guardarArtistasDePublicacion(revistaId: string, artistaIds: string[]) {
    const db = requireSupabase();
    check(await db.from("revista_artistas").delete().eq("revista_id", revistaId));
    if (artistaIds.length === 0) return;
    check(
      await db.from("revista_artistas").insert(
        artistaIds.map((artista_id, orden) => ({ revista_id: revistaId, artista_id, orden })),
      ),
    );
  }

  function ordenarPorFecha(lista: Publicacion[]): Publicacion[] {
    return [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  async function addPublicacion(data: DatosPublicacion) {
    const nueva: Publicacion = { ...data, id: generateId(data.titulo, revista.map((p) => p.id)) };
    check(await requireSupabase().from("revista").insert(publicacionToRow(nueva)));
    await guardarArtistasDePublicacion(nueva.id, nueva.artistaIds);
    setRevista((prev) => ordenarPorFecha([nueva, ...prev]));
    return nueva;
  }

  async function updatePublicacion(id: string, data: DatosPublicacion) {
    const anterior = revista.find((p) => p.id === id);
    const actualizada: Publicacion = { ...data, id };
    check(await requireSupabase().from("revista").update(publicacionToRow(actualizada)).eq("id", id));
    await guardarArtistasDePublicacion(id, data.artistaIds);
    setRevista((prev) => ordenarPorFecha(prev.map((p) => (p.id === id ? actualizada : p))));
    if (anterior) await borrarMedia(mediaQuitada(anterior.media, data.media));
  }

  async function deletePublicacion(id: string) {
    const anterior = revista.find((p) => p.id === id);
    check(await requireSupabase().from("revista").delete().eq("id", id));
    setRevista((prev) => prev.filter((p) => p.id !== id));
    if (anterior) await borrarMedia(anterior.media);
  }

  /** Reemplaza todo el contenido por el de ejemplo de src/data (para pruebas internas). */
  async function cargarContenidoDeEjemplo() {
    const db = requireSupabase();
    const ahora = Date.now();
    // created_at escalonado para que el orden "más nuevo primero" respete el del seed
    const conFecha = <T,>(rows: T[]) =>
      rows.map((r, i) => ({ ...r, created_at: new Date(ahora - i * 1000).toISOString() }));

    check(await db.from("revista").delete().neq("id", ""));
    check(await db.from("exposiciones").delete().neq("id", ""));
    check(await db.from("items_tienda").delete().neq("id", ""));
    check(await db.from("artistas").delete().neq("id", ""));
    await borrarMedia([
      ...exposiciones.flatMap((e) => e.media),
      ...tiendaRaw.flatMap((i) => i.media),
      ...revista.flatMap((p) => p.media),
      ...artistas.flatMap((a) => fotoComoMedia(a.fotoUrl)),
    ]);

    check(await db.from("artistas").insert(artistasSeed.map(artistaToRow)));
    check(await db.from("exposiciones").insert(conFecha(exposicionesSeed.map(exposicionToRow))));
    check(
      await db.from("exposicion_artistas").insert(
        exposicionesSeed.flatMap((e) =>
          e.artistaIds.map((artista_id, orden) => ({ exposicion_id: e.id, artista_id, orden })),
        ),
      ),
    );
    check(await db.from("items_tienda").insert(conFecha(tiendaSeed.map(itemToRow))));
    check(await db.from("revista").insert(revistaSeed.map(publicacionToRow)));
    check(
      await db.from("revista_artistas").insert(
        revistaSeed.flatMap((p) =>
          p.artistaIds.map((artista_id, orden) => ({ revista_id: p.id, artista_id, orden })),
        ),
      ),
    );
    await recargar();
  }

  const value = useMemo<ContentContextValue>(
    () => ({
      artistas,
      exposiciones,
      tienda,
      revista,
      loading,
      error,
      recargar,
      artistaPorId: (id) => (id ? artistasPorId.get(id) : undefined),
      addArtista,
      updateArtista,
      deleteArtista,
      addExposicion,
      updateExposicion,
      deleteExposicion,
      addItemTienda,
      updateItemTienda,
      deleteItemTienda,
      addPublicacion,
      updatePublicacion,
      deletePublicacion,
      cargarContenidoDeEjemplo,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- las funciones se redefinen cada render pero solo dependen del estado listado
    [artistas, exposiciones, tienda, tiendaRaw, revista, artistasPorId, loading, error, recargar],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent debe usarse dentro de ContentProvider");
  return ctx;
}
