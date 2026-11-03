"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { exposiciones as exposicionesSeed, type Exposicion } from "@/data/exposiciones";
import { tienda as tiendaSeed, type ItemTienda } from "@/data/tienda";
import { generateId } from "@/lib/id";
import { createSyncedStore } from "@/lib/syncedStore";

const exposicionesStore = createSyncedStore<Exposicion[]>(
  "magenta_exposiciones",
  exposicionesSeed,
);
const tiendaStore = createSyncedStore<ItemTienda[]>("magenta_tienda", tiendaSeed);

interface ContentContextValue {
  exposiciones: Exposicion[];
  tienda: ItemTienda[];
  addExposicion: (data: Omit<Exposicion, "id">) => Exposicion;
  updateExposicion: (id: string, data: Omit<Exposicion, "id">) => void;
  deleteExposicion: (id: string) => void;
  addItemTienda: (data: Omit<ItemTienda, "id">) => ItemTienda;
  updateItemTienda: (id: string, data: Omit<ItemTienda, "id">) => void;
  deleteItemTienda: (id: string) => void;
  restaurarDatosOriginales: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const exposiciones = useSyncExternalStore(
    exposicionesStore.subscribe,
    exposicionesStore.getSnapshot,
    exposicionesStore.getServerSnapshot,
  );
  const tienda = useSyncExternalStore(
    tiendaStore.subscribe,
    tiendaStore.getSnapshot,
    tiendaStore.getServerSnapshot,
  );

  function addExposicion(data: Omit<Exposicion, "id">) {
    const nueva: Exposicion = {
      ...data,
      id: generateId(data.titulo, exposiciones.map((e) => e.id)),
    };
    exposicionesStore.set([nueva, ...exposiciones]);
    return nueva;
  }

  function updateExposicion(id: string, data: Omit<Exposicion, "id">) {
    exposicionesStore.set(exposiciones.map((e) => (e.id === id ? { ...data, id } : e)));
  }

  function deleteExposicion(id: string) {
    exposicionesStore.set(exposiciones.filter((e) => e.id !== id));
  }

  function addItemTienda(data: Omit<ItemTienda, "id">) {
    const nuevo: ItemTienda = {
      ...data,
      id: generateId(`${data.tipo}-${data.titulo}`, tienda.map((t) => t.id)),
    };
    tiendaStore.set([nuevo, ...tienda]);
    return nuevo;
  }

  function updateItemTienda(id: string, data: Omit<ItemTienda, "id">) {
    tiendaStore.set(tienda.map((t) => (t.id === id ? { ...data, id } : t)));
  }

  function deleteItemTienda(id: string) {
    tiendaStore.set(tienda.filter((t) => t.id !== id));
  }

  function restaurarDatosOriginales() {
    exposicionesStore.set(exposicionesSeed);
    tiendaStore.set(tiendaSeed);
  }

  const value = useMemo<ContentContextValue>(
    () => ({
      exposiciones,
      tienda,
      addExposicion,
      updateExposicion,
      deleteExposicion,
      addItemTienda,
      updateItemTienda,
      deleteItemTienda,
      restaurarDatosOriginales,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- las funciones se redefinen cada render pero solo dependen de exposiciones/tienda, ya listados
    [exposiciones, tienda],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent debe usarse dentro de ContentProvider");
  return ctx;
}
