// Mapea cada variante de la tienda de Hostinger Ecommerce (store_01M0YWCN5GTW7AGM0YBNYR8B2W) a su
// variante correspondiente en Printify. Existe porque el catálogo de Hostinger no está sincronizado
// con Printify (son productos recreados a mano ahí) y su API no permite setear el SKU para
// vincularlos automáticamente (PATCH en variante → 405; PATCH en producto solo acepta
// name/description/status). Cuando Julian agregue un producto nuevo a la tienda, agregar su entrada
// acá antes de que se pueda vender — si no está mapeado, el sync lo salta y lo loguea.
export const HOSTINGER_TO_PRINTIFY_VARIANT = {
  // "Poster Print, Vako Wine Club Art..." (€28,33) → 16″x12″ horizontal, marco negro, mate
  variant_01M123S29762Q5GV2F395KTDHC: {
    printifyProductId: '6a8ed299a049847a9105fafc',
    printifyVariantId: 96196,
  },
  // "Vako Wine Club Framed Poster..." (€39,04) → 11″x14″, marco negro
  variant_01M123P7B901VA14H08N7T54YK: {
    printifyProductId: '6a8ed2a03a219ee1eb0507c2',
    printifyVariantId: 65400,
  },
};
