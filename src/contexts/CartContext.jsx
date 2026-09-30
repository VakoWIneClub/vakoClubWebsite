import React, { createContext, useContext, useEffect, useState } from 'react';

// Carrito para comprar más de una guía en un solo pago. Vive solo en localStorage (no hay
// backend de carritos) — el precio real y la disponibilidad SIEMPRE se resuelven en el servidor
// contra api/_lib/catalog.js al momento de armar el checkout; este mapa es solo para poder
// mostrar nombre y precio en el widget sin pegarle a una API. Si el precio de alguna guía cambia
// en el catálogo del servidor, actualizar también acá.
// `nombre` trae las tres traducciones porque "guia-general" (El Mundo de la Copa) sí tiene
// edición real en inglés y portugués — su carrito puede mostrarse en cualquiera de los tres
// idiomas (ver CartWidget). "guia-espanol"/"guia-argentino" solo existen en español, así que
// repiten el mismo nombre en las tres claves: no hay nada más honesto que mostrar para ellas.
// `idiomas` son las ediciones que realmente existen de cada guía, y es lo que ofrece el selector
// de idioma al agregarla al carrito (ElegirIdiomaDialog) y lo que muestra la grilla de /tienda.
// Tiene que coincidir con `filePathByLang` de api/_lib/catalog.js — el servidor rechaza cualquier
// idioma que no tenga su PDF. Para lanzar una edición nueva (ej. una regional en portugués): subir
// el PDF, sumarlo en `filePathByLang` del servidor y agregar el código acá.
export const CART_CATALOG = {
  'guia-general': {
    nombre: { es: 'El Mundo de la Copa', en: 'The World of the Glass', pt: 'O Mundo da Taça' },
    amountCents: 1499,
    idiomas: ['es', 'en', 'pt'],
  },
  'guia-espanol': {
    nombre: { es: 'Guía del Vino Español', en: 'Guía del Vino Español', pt: 'Guía del Vino Español' },
    amountCents: 1499,
    idiomas: ['es'],
  },
  'guia-argentino': {
    nombre: { es: 'Guía del Vino Argentino', en: 'Guía del Vino Argentino', pt: 'Guía del Vino Argentino' },
    amountCents: 1499,
    idiomas: ['es'],
  },
  'guia-frances': {
    nombre: { es: 'Guía del Vino Francés', en: 'Guía del Vino Francés', pt: 'Guía del Vino Francés' },
    amountCents: 1499,
    idiomas: ['es'],
  },
  'guia-italiano': {
    nombre: { es: 'Guía del Vino Italiano', en: 'Guía del Vino Italiano', pt: 'Guía del Vino Italiano' },
    amountCents: 1499,
    idiomas: ['es'],
  },
};

// Todos los idiomas que el sitio contempla, en el orden en que se ofrecen. Cada uno con su nombre
// en su propio idioma, para que un visitante de Brasil reconozca "Português" aunque la página
// esté en español.
export const IDIOMAS = ['es', 'en', 'pt'];
export const NOMBRE_IDIOMA = { es: 'Español', en: 'English', pt: 'Português' };

export const idiomasDeGuia = (id) => CART_CATALOG[id]?.idiomas || ['es'];

// Idioma válido para una guía: el pedido si esa edición existe, si no el primero disponible. Cubre
// ítems viejos guardados en localStorage sin `lang` (las regionales, antes del selector).
const resolverIdioma = (id, lang) => {
  const disponibles = idiomasDeGuia(id);
  return disponibles.includes(lang) ? lang : disponibles[0];
};

// Compartido por CartWidget y las landings (para mostrar el precio en el botón "Agregar al
// carrito") — un solo lugar para el formato de precio en USD.
export const formatUsd = (cents) => `USD ${(cents / 100).toFixed(2)}`;

// Promo de la colección: a partir de 3 guías en el carrito, la más barata de todas sale gratis —
// un solo descuento por compra, no uno por cada grupo de 3 (llevando 3 se pagan 2, llevando 4 se
// pagan 3, llevando 6 se siguen pagando 5, etc). Esta es SOLO la versión de exhibición para el
// panel del carrito — la que de verdad determina lo que se cobra vive en api/_lib/catalog.js
// (misma regla, implementada aparte porque el frontend y las funciones serverless no comparten
// módulos); si esta regla cambia, hay que actualizarla en los dos lugares.
export const PROMO_3X2_MINIMO = 3;

export function calcularPromo3x2(items) {
  const conPrecio = items
    .map((it) => ({ id: it.id, amountCents: CART_CATALOG[it.id]?.amountCents || 0 }))
    .sort((a, b) => a.amountCents - b.amountCents);
  const gratisCount = items.length >= PROMO_3X2_MINIMO ? 1 : 0;
  const gratis = conPrecio.slice(0, gratisCount);
  return {
    gratisCount,
    idsGratis: new Set(gratis.map((it) => it.id)),
    descuentoCents: gratis.reduce((sum, it) => sum + it.amountCents, 0),
  };
}

const STORAGE_KEY = 'vako-carrito';

const readStoredItems = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Filtra cualquier id que ya no exista en el catálogo (guía descontinuada, dato corrupto) para
    // que el widget nunca intente mostrar o cobrar algo que ya no se vende.
    return Array.isArray(parsed)
      ? parsed.filter((it) => it && CART_CATALOG[it.id]).map((it) => ({ ...it, lang: resolverIdioma(it.id, it.lang) }))
      : [];
  } catch {
    return [];
  }
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStoredItems);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage puede fallar en modo privado — el carrito simplemente no persiste entre
      // recargas, no es crítico.
    }
  }, [items]);

  // Un ítem por guía — agregar una que ya está adentro solo actualiza el idioma elegido en vez de
  // duplicar la línea.
  const addItem = (id, rawLang) => {
    if (!CART_CATALOG[id]) return;
    const lang = resolverIdioma(id, rawLang);
    setItems((prev) => {
      const existe = prev.some((it) => it.id === id);
      if (existe) return prev.map((it) => (it.id === id ? { ...it, lang } : it));
      return [...prev, { id, lang }];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  const clear = () => setItems([]);

  const value = { items, addItem, removeItem, clear, count: items.length };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
};
