
import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Seo from '@/components/Seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Guia from '@/pages/Guia';
import WineryPage from '@/pages/guia/WineryPage';
import WineryEditor from '@/pages/guia/WineryEditor';
import Noticias from '@/pages/Noticias';
import Eventos from '@/pages/Eventos';
import Comunidad from '@/pages/Comunidad';
import Tienda from '@/pages/Tienda';
import ElMundoDeLaCopaLanding from '@/pages/tienda/ElMundoDeLaCopaLanding';
import GuiaVinoEspanolLanding from '@/pages/tienda/GuiaVinoEspanolLanding';
import GuiaVinoArgentinoLanding from '@/pages/tienda/GuiaVinoArgentinoLanding';
import Contacto from '@/pages/Contacto';
import Suscripcion from '@/pages/Suscripcion';
import Perfil from '@/pages/Perfil';
import Login from '@/pages/Login';
import Terminos from '@/pages/Terminos';
import PoliticaPrivacidad from '@/pages/PoliticaPrivacidad';
import EmailVerification from '@/pages/EmailVerification';
import AuthCallback from '@/pages/AuthCallback';
import ScrollToTop from '@/components/ScrollToTop';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import ProtectedRoute from '@/components/ProtectedRoute';
import ArticlePage from '@/pages/noticias/ArticlePage';
import ArticleEditor from '@/pages/noticias/ArticleEditor';
import EventoPage from '@/pages/eventos/EventoPage';
import EventoEditor from '@/pages/eventos/EventoEditor';
import SobreNosotros from '@/pages/SobreNosotros';
import Educacion from '@/pages/Educacion';
import AgeVerificationPopup from '@/components/AgeVerificationPopup';
import PerfilSuscripcion from '@/pages/perfil/PerfilSuscripcion';
import GuideCtaBar from '@/components/tienda/GuideCtaBar';

// Guía, Eventos and Noticias (list pages + detail subpages) get the floating guide CTA —
// but not their /crear or /editar/:slug admin forms, which aren't content-browsing pages.
const GUIDE_PROMO_SECTIONS = ['/guia', '/eventos', '/noticias'];
const isGuidePromoPath = pathname =>
  GUIDE_PROMO_SECTIONS.some(base => pathname === base || pathname.startsWith(`${base}/`)) &&
  !/\/(crear|editar)(\/|$)/.test(pathname);

// Mirrors public/robots.txt's Disallow list — /guia sits behind a login wall (crawlers only ever
// see ProtectedRoute's signup gate there, never real content) and the rest are admin/account
// utility pages with nothing worth indexing. robots.txt only stops crawling; this stops indexing
// if one of these URLs ever gets linked from somewhere robots.txt can't control.
const NOINDEX_PATHS = ['/guia', '/login', '/perfil', '/email-verification', '/auth/callback', '/educacion'];
const isNoindexPath = pathname =>
  NOINDEX_PATHS.some(base => pathname === base || pathname.startsWith(`${base}/`)) ||
  /\/(crear|editar)(\/|$)/.test(pathname);

function App() {
  const location = useLocation();
  // "El mundo de la copa" is a standalone sales landing with its own minimal chrome
  // (language + CTA header, no multi-page nav) — it opts out of the site-wide Navbar/Footer
  // instead of fighting them with overrides, even though both now share its crema/borgoña/oro
  // design system.
  const isCopaLanding = location.pathname === '/tienda/el-mundo-de-la-copa';
  const showGuidePromo = isGuidePromoPath(location.pathname);
  const noindex = isNoindexPath(location.pathname);

  return (
    <>
      <ScrollToTop />
      <AnalyticsTracker />
      {/* "El mundo de la copa" has its own language + 18+ gate baked into the landing itself
          (src/pages/tienda/ElMundoDeLaCopaLanding.jsx), so it opts out of the generic
          site-wide age gate to avoid showing two age checks back to back. */}
      {!isCopaLanding && <AgeVerificationPopup />}
      <div className={isCopaLanding ? 'min-h-screen flex flex-col' : 'min-h-screen wine-pattern flex flex-col'}>
        {/* Baseline OG/Twitter tags for any route without its own <Seo> (login, perfil, /guia,
            admin editors) — pages that need something more specific render their own further
            down the tree and win, same override behavior the old per-page <Helmet> blocks
            already relied on. */}
        <Seo
          title="Vako Club - Descubre el Mundo del Vino"
          description="Explora el fascinante mundo del vino con nuestra comunidad de expertos en Vako Club. Aprende sobre catas, maridajes y descubre vinos excepcionales."
          path={location.pathname}
          noindex={noindex}
        />

        {!isCopaLanding && <Navbar />}

        {/* Navbar is sticky (not fixed), same as the copa landing's own header, so no
            top-padding spacer is needed here anymore. */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guia" element={<ProtectedRoute><Guia /></ProtectedRoute>} />
            <Route path="/guia/crear" element={<ProtectedRoute adminOnly><WineryEditor /></ProtectedRoute>} />
            <Route path="/guia/editar/:slug" element={<ProtectedRoute adminOnly><WineryEditor /></ProtectedRoute>} />
            <Route path="/guia/:slug" element={<ProtectedRoute><WineryPage /></ProtectedRoute>} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticias/crear" element={<ProtectedRoute adminOnly><ArticleEditor /></ProtectedRoute>} />
            <Route path="/noticias/editar/:slug" element={<ProtectedRoute adminOnly><ArticleEditor /></ProtectedRoute>} />
            <Route path="/noticias/:slug" element={<ArticlePage />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/eventos/crear" element={<ProtectedRoute adminOnly><EventoEditor /></ProtectedRoute>} />
            <Route path="/eventos/editar/:slug" element={<ProtectedRoute adminOnly><EventoEditor /></ProtectedRoute>} />
            <Route path="/eventos/:slug" element={<EventoPage />} />
            <Route path="/comunidad" element={<Comunidad />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/tienda/el-mundo-de-la-copa" element={<ElMundoDeLaCopaLanding />} />
            <Route path="/tienda/guia-vino-espanol" element={<GuiaVinoEspanolLanding />} />
            <Route path="/tienda/guia-vino-argentino" element={<GuiaVinoArgentinoLanding />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/suscripcion" element={<Suscripcion />} />
            <Route path="/login" element={<Login />} />
            <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
            <Route path="/perfil/suscripcion" element={<ProtectedRoute><PerfilSuscripcion /></ProtectedRoute>} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            {/* Academia is built but not launched — gated to admins until it's ready for everyone. */}
            <Route path="/educacion" element={<ProtectedRoute adminOnly><Educacion /></ProtectedRoute>} />
          </Routes>
        </main>

        {!isCopaLanding && <Footer />}
        {showGuidePromo && <GuideCtaBar />}
        <Toaster />
          <SpeedInsights />
          <Analytics />
      </div>
    </>
  );
}

export default App;
