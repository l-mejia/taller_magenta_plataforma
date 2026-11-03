# Magenta — Mockup

Mockup frontend en Next.js de la plataforma de Taller Magenta (galería de arte en Barranco, Lima). Página única con secciones ancladas (Home, Quiénes somos, Exposiciones, Tienda, Contacto). Sin backend: los datos viven en `src/data/*.ts` como seed estático.

Ver `Docs/design.md` (en la raíz del repo) para el documento de diseño original.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

- `src/app/page.tsx` — ensambla las secciones de la página.
- `src/components/sections/` — una sección por bloque de la página.
- `src/data/` — seed de exposiciones, tienda y contacto.
- `public/images/placeholder.svg` — imagen genérica reutilizada en tarjetas y galerías.
