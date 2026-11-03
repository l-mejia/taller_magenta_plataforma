# Documento de diseño - Plataforma Magenta

## Visión general

Plataforma web para la galería Magenta, enfocada en una experiencia minimalista, fondo blanco y tipografía simple. El proyecto es solo frontend en Next.js, sin backend.

### Objetivos

- Mostrar identidad y propuesta curatorial de Magenta.
- Facilitar navegación clara entre secciones.
- Presentar exposiciones, tienda y contacto con un diseño limpio y directo.
- Generar un prototipo legible y fácil de implementar para un developer.

## Estructura de la web

La plataforma tendrá 5 secciones principales en el layout o navegación principal:

0. Home
1. Quiénes somos
2. Exposiciones
3. Tienda
4. Contacto

> En la versión inicial se maneja un solo layout main con navegación fija y scroll suave entre secciones.

### 0. Home

- Fondo blanco completo.
- Logo de Magenta centrado en la vista inicial.
- Tipografía simple, elegante y legible.
- Mensaje corto opcional: “Espacio cultural autogestionado en Barranco, Lima.”
- Botones o links suaves para ir a “Quiénes somos” y “Exposiciones”.

### 1. Quiénes somos

Usa el texto proporcionado para construir una sección directa y narrativa.

Contenido:
- Título: “Quiénes somos”
- Párrafos con la historia de Magenta.
- Propósito, Objetivo general y Objetivos específicos.
- Lista de objetivos específicos como bullets.

### 2. Exposiciones

- Título: “Exposiciones”
- Lista de tarjetas o bloques de exposición con imagen genérica, título y breve descripción.
- Cada tarjeta es clicable y abre una vista expandida de la exposición.
- En la vista de exposición:
  - Texto curatorial fijo y visible.
  - Galería de imágenes con desplazamiento horizontal o vertical.
  - Imagen genérica placeholder para cada foto.
  - Texto curatorial siempre presente en la parte superior o lateral.

### 3. Tienda

Se divide en dos secciones:

- Arte utilitario
- Obras

Cada item debe mostrar:
- autor
- medidas
- título de la obra
- técnica
- año de ejecución
- precio
- tipo

La visualización puede ser una cuadrícula simple con tarjetas.

### 4. Contacto

- Título: “Contacto”
- Nombre: Nuria Cano Erazo
- Email: tallermagentalima@gmail.com
- Teléfono: 992654575
- Instagram: @megenta.galeria
- Ubicación Google Maps: https://maps.app.goo.gl/yGNe4sTvbUSasdQh7
- Presentarlo con iconos simples y texto claro.

## Requisitos de implementación

### Tech stack

- Next.js (app router o pages router, según preferencia del developer)
- React
- CSS Modules, Tailwind o styled-jsx para estilo minimalista
- Sin backend, datos en JSON/JavaScript estático
- Imágenes genéricas usando `public/images/placeholder.jpg` o `https://via.placeholder.com`

### Navegación

- Navegación principal con enlaces internos a las secciones.
- Comportamiento de scroll suave.
- Anchor links: `#home`, `#quienes-somos`, `#exposiciones`, `#tienda`, `#contacto`.

### Diseño responsive

- Mobile-first con columnas simples.
- Header fijo o sección hero clara.
- Galería de exposiciones con scroll horizontal controlado en mobile.

### Estilo visual

- Fondo: blanco total.
- Tipografía: sans serif simple (por ejemplo, Inter o system-ui).
- Espaciado amplio, mucho aire entre secciones.
- Colores: negro/gris muy oscuro para texto, detalles en magenta suave si se desea.
- Botones y tarjetas con bordes finos y sombra ligera opcional.

## Estructura de datos / seed

Usar un módulo estático como `data.js` o `data.ts` con los siguientes ejemplos:

### Exposiciones

```js
export const exposiciones = [
  {
    id: 'luz-y-materia',
    titulo: 'Luz y materia',
    imagen: '/images/expo-1.jpg',
    textoCuratorial: 'Una exploración de la presencia material y la luz en el taller, donde cada pieza dialoga con el espacio y el tiempo.',
    fotos: ['/images/expo-1.jpg', '/images/expo-2.jpg', '/images/expo-3.jpg'],
  },
  {
    id: 'voces-del-sur',
    titulo: 'Voces del sur',
    imagen: '/images/expo-4.jpg',
    textoCuratorial: 'Una muestra que reúne relatos visuales de artistas del interior del país, poniendo en primer plano perspectivas contemporáneas y contextuales.',
    fotos: ['/images/expo-4.jpg', '/images/expo-5.jpg', '/images/expo-6.jpg'],
  },
  {
    id: 'trazos-contemporaneos',
    titulo: 'Trazos contemporáneos',
    imagen: '/images/expo-7.jpg',
    textoCuratorial: 'Obras que redefinen la pintura y el objeto, con procesos artesanales y materiales experimentales.',
    fotos: ['/images/expo-7.jpg', '/images/expo-8.jpg', '/images/expo-9.jpg'],
  },
];
```

### Tienda

```js
export const tienda = {
  utilitario: [
    {
      id: 'llavero-magenta',
      autor: 'Taller Magenta',
      medidas: '5 x 3 cm',
      titulo: 'Llavero Magenta',
      tecnica: 'Acrílico y metal',
      ano: 2024,
      precio: 'S/ 45',
      tipo: 'Arte utilitario',
    },
    {
      id: 'bolsa-lima',
      autor: 'Nuria Cano',
      medidas: '40 x 35 cm',
      titulo: 'Bolsa Lima',
      tecnica: 'Serigrafía textil',
      ano: 2024,
      precio: 'S/ 95',
      tipo: 'Arte utilitario',
    },
  ],
  obras: [
    {
      id: 'cuadro-memoria',
      autor: 'María Rojas',
      medidas: '60 x 80 cm',
      titulo: 'Memoria expandida',
      tecnica: 'Óleo sobre lienzo',
      ano: 2023,
      precio: 'S/ 3,200',
      tipo: 'Cuadro',
    },
    {
      id: 'escultura-aire',
      autor: 'Carlos Paredes',
      medidas: '30 x 20 x 15 cm',
      titulo: 'Aire en fuga',
      tecnica: 'Madera y metal',
      ano: 2024,
      precio: 'S/ 5,800',
      tipo: 'Escultura',
    },
  ],
};
```

## Notas para el developer

- No hay backend ni gestión de datos dinámica. Todos los contenidos son estáticos.
- Evitar animaciones recargadas; priorizar la claridad y el ritmo visual.
- Preparar componentes reutilizables para tarjetas de exposición y tarjetas de producto.
- Para imágenes, usar placeholders locales o rutas genéricas.
- Si se desea, dejar espacio para un futuro `pages/[expoId].js` o ruta dinámica en `app/exposiciones/[id]/page.tsx`.

## Archivos recomendados

- `Docs/design.md` (este documento)
- `Mockup/` para bocetos visuales de frontend
- `Test/` para pruebas de implementación y recursos de desarrollo
- `Dev/` si se requiere un entorno de desarrollo final o ajustes posteriores

## Link de referencia

- https://www.espacio218.com/

---

Este documento define el diseño para construir la plataforma de Magenta con Next.js, frontend estático y un estilo minimalista basado en el texto e imágenes de referencia.