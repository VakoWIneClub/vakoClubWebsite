import React from 'react';
import { Helmet } from 'react-helmet';

export const SITE_URL = 'https://vakoclub.com';
// El PDF pago es lo que más se comparte/anuncia — sirve de imagen OG por defecto para cualquier
// página que no traiga la suya propia (bodega, evento o artículo con foto).
export const DEFAULT_OG_IMAGE = '/images/guias/el-mundo-de-la-copa-tapa.jpg';

const toAbsoluteUrl = (value) => {
  if (!value) return null;
  return value.startsWith('http') ? value : `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`;
};

// Centraliza title/description/canonical + Open Graph/Twitter Card en un solo lugar — antes cada
// página repetía su propio <Helmet> con solo title/description, sin og:image/og:url/twitter:*,
// que es justo lo que faltaba para que la landing se vea bien al compartirse en anuncios/redes.
const Seo = ({ title, description, path = '/', image = DEFAULT_OG_IMAGE, type = 'website', lang, noindex = false }) => {
  const url = toAbsoluteUrl(path);
  const absoluteImage = toAbsoluteUrl(image);

  return (
    <Helmet htmlAttributes={lang ? { lang } : undefined}>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {url && <link rel="canonical" href={url} />}

      <meta property="og:site_name" content="Vako Club" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}
      {url && <meta property="og:url" content={url} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}
    </Helmet>
  );
};

export default Seo;
