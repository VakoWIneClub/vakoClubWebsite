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
export const CART_CATALOG = {
  'guia-general': {
    nombre: { es: 'El Mundo de la Copa', en: 'The World of the Glass', pt: 'O Mundo da Taça' },
    amountCents: 1499,
  },
  'guia-espanol': {
    nombre: { es: 'Guía del Vino Español', en: 'Guía del Vino Español', pt: 'Guía del Vino Español' },
    amountCents: 1499,
  },
  'guia-argentino': {
    nombre: { es: 'Guía del Vino Argentino', en: 'Guía del Vino Argentino', pt: 'Guía del Vino Argentino' },
    amountCents: 1499,
  },
};

// Compartido por CartWidget y las landings (para mostrar el precio en el botón "Agregar al
// carrito") — un solo lugar para el formato de precio en USD.
export const formatUsd = (cents) => `USD ${(cents / 100).toFixed(2)}`;

const STORAGE_KEY = 'vako-carrito';

const readStoredItems = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Filtra cualquier id que ya no exista en el catálogo (guía descontinuada, dato corrupto) para
    // que el widget nunca intente mostrar o cobrar algo que ya no se vende.
    return Array.isArray(parsed) ? parsed.filter((it) => it && CART_CATALOG[it.id]) : [];
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

  // Un ítem por guía — agregar una que ya está adentro solo actualiza el idioma elegido (relevante
  // hoy únicamente para "guia-general", la única con más de una edición de idioma) en vez de
  // duplicar la línea.
  const addItem = (id, lang) => {
    if (!CART_CATALOG[id]) return;
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
