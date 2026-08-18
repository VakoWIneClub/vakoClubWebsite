
import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';
import { ShieldAlert, Wine, Star, Users, BookOpen } from 'lucide-react';
import { isAdminUser } from '@/lib/utils';

const ProtectedRoute = ({
  children,
  adminOnly = false
}) => {
  const {
    user,
    loading
  } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-copa-cream">
        <div className="font-cormorant font-light text-2xl text-copa-burgundy">Cargando…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="min-h-[80vh] flex items-center justify-center bg-copa-cream p-4"
        style={{ fontFamily: "'EB Garamond', serif" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-copa-gold bg-copa-cream p-8 md:p-12 text-center max-w-2xl text-copa-ink"
        >
          <Wine className="h-14 w-14 mx-auto text-copa-burgundy mb-6" />
          <h1
            className="font-cormorant font-light leading-[1.05]"
            style={{ fontSize: 'clamp(32px,5vw,48px)' }}
          >
            ¡Descorcha un Mundo de Sabores!
          </h1>
          <p className="text-copa-ink/75 mt-5" style={{ fontSize: 18, lineHeight: 1.6 }}>
            Regístrate gratis en Vako Club y accede a contenido exclusivo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mt-10 px-2">
            <div className="flex items-start gap-3">
              <BookOpen className="h-6 w-6 text-copa-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-cormorant" style={{ fontSize: 19 }}>Guía Exclusiva</h3>
                <p className="text-sm text-copa-ink/70 mt-1">Accede a nuestra guía de bodegas con puntajes únicos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="h-6 w-6 text-copa-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-cormorant" style={{ fontSize: 19 }}>Guarda Favoritos</h3>
                <p className="text-sm text-copa-ink/70 mt-1">Crea tu lista personal de bodegas y vinos preferidos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-6 w-6 text-copa-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-cormorant" style={{ fontSize: 19 }}>Únete a la Comunidad</h3>
                <p className="text-sm text-copa-ink/70 mt-1">Participa en foros y conecta con otros amantes del vino.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/suscripcion" state={{ from: location }} replace className="copa-btn-primary">
              Registrarse Gratis
            </Link>
            <Link to="/login" state={{ from: location }} replace className="copa-btn-secondary">
              Ya tengo cuenta
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const isAdmin = isAdminUser(user);

  if (adminOnly && !isAdmin) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center bg-copa-cream p-4"
        style={{ fontFamily: "'EB Garamond', serif" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-copa-gold bg-copa-cream p-8 md:p-12 text-center max-w-lg text-copa-ink"
        >
          <ShieldAlert className="h-14 w-14 mx-auto text-copa-burgundy mb-6" />
          <h1 className="font-cormorant font-light" style={{ fontSize: 36 }}>Acceso Denegado</h1>
          <p className="text-copa-ink/75 mt-5" style={{ fontSize: 18, lineHeight: 1.6 }}>
            No tienes los permisos necesarios para acceder a esta página.
          </p>
          <Link to="/" className="copa-btn-primary mt-8 inline-flex">Volver al Inicio</Link>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
