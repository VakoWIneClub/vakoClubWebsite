
import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Guia from '@/pages/Guia';
import Eventos from '@/pages/Eventos';
import Comunidad from '@/pages/Comunidad';
import Tienda from '@/pages/Tienda';
import Contacto from '@/pages/Contacto';
import Suscripcion from '@/pages/Suscripcion';
import Perfil from '@/pages/Perfil';
import Login from '@/pages/Login';
import Terminos from '@/pages/Terminos';
import PoliticaPrivacidad from '@/pages/PoliticaPrivacidad';
import EmailVerification from '@/pages/EmailVerification';
import AuthCallback from '@/pages/AuthCallback';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import ArticlePage from '@/pages/guia/ArticlePage';
import ArticleEditor from '@/pages/guia/ArticleEditor';
import EventoPage from '@/pages/eventos/EventoPage';
import EventoEditor from '@/pages/eventos/EventoEditor';
import SobreNosotros from '@/pages/SobreNosotros';
import AgeVerificationPopup from '@/components/AgeVerificationPopup';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <AgeVerificationPopup />
        <div className="min-h-screen wine-pattern flex flex-col">
          <Helmet>
            <title>Vako Club - Descubre el Mundo del Vino</title>
            <meta name="description" content="Explora el fascinante mundo del vino con nuestra comunidad de expertos en Vako Club. Aprende sobre catas, maridajes y descubre vinos excepcionales." />
          </Helmet>
          
          <Navbar />
          
          <main className="pt-20 flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/guia" element={<Guia />} />
              <Route path="/guia/crear" element={<ProtectedRoute adminOnly><ArticleEditor /></ProtectedRoute>} />
              <Route path="/guia/editar/:slug" element={<ProtectedRoute adminOnly><ArticleEditor /></ProtectedRoute>} />
              <Route path="/guia/:slug" element={<ArticlePage />} />
              <Route path="/eventos" element={<Eventos />} />
              <Route path="/eventos/crear" element={<ProtectedRoute adminOnly><EventoEditor /></ProtectedRoute>} />
              <Route path="/eventos/editar/:slug" element={<ProtectedRoute adminOnly><EventoEditor /></ProtectedRoute>} />
              <Route path="/eventos/:slug" element={<EventoPage />} />
              <Route path="/comunidad" element={<Comunidad />} />
              <Route path="/tienda" element={<Tienda />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/suscripcion" element={<Suscripcion />} />
              <Route path="/login" element={<Login />} />
              <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
              <Route path="/terminos" element={<Terminos />} />
              <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            </Routes>
          </main>
          
          <Footer />
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
