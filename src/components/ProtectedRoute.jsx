
import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';
import { ShieldAlert, Wine, Star, Users, BookOpen } from 'lucide-react';
import { Button } from './ui/button';

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="wine-text-gradient text-2xl font-playfair">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center wine-pattern p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl text-center max-w-2xl"
        >
          <Wine className="h-20 w-20 mx-auto wine-text-gradient mb-6" />
          <h1 className="font-playfair text-4xl md:text-5xl font-bold wine-text-gradient mb-4">
            ¡Descorcha un Mundo de Sabores!
          </h1>
          <p className="text-amber-100/80 mb-8 text-lg">
            Regístrate gratis en Vako Club y accede a contenido exclusivo.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mb-10 px-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-6 w-6 text-amber-300 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-100">Guía Exclusiva</h3>
                <p className="text-sm text-amber-100/70">Accede a nuestra guía de bodegas con puntajes únicos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="h-6 w-6 text-amber-300 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-100">Guarda Favoritos</h3>
                <p className="text-sm text-amber-100/70">Crea tu lista personal de bodegas y vinos preferidos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-6 w-6 text-amber-300 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-100">Únete a la Comunidad</h3>
                <p className="text-sm text-amber-100/70">Participa en foros y conecta con otros amantes del vino.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/suscripcion" state={{ from: location }} replace>
                Registrarse Gratis
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/login" state={{ from: location }} replace>
                Ya tengo cuenta
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (adminOnly && user.role !== 'admin' && user.role !== 'superadmin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center wine-pattern p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl text-center max-w-lg"
        >
          <ShieldAlert className="h-16 w-16 mx-auto text-red-400 mb-6" />
          <h1 className="font-playfair text-4xl font-bold text-red-400/80 mb-4">Acceso Denegado</h1>
          <p className="text-amber-100/80 mb-8 text-lg">
            No tienes los permisos necesarios para acceder a esta página.
          </p>
          <Button asChild size="lg">
            <Link to="/">Volver al Inicio</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
