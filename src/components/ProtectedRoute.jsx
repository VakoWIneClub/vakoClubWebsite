import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert } from 'lucide-react';
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
    return <div className="min-h-[60vh] flex items-center justify-center">
        <div className="wine-text-gradient text-2xl font-playfair">Cargando...</div>
      </div>;
  }
  if (!user) {
    return <div className="min-h-[60vh] flex items-center justify-center wine-pattern p-4">
          <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.5
      }} className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl text-center max-w-lg">
              <Lock className="h-16 w-16 mx-auto wine-text-gradient mb-6" />
              <h1 className="font-playfair text-4xl font-bold wine-text-gradient mb-4">Acceso sólo para socios</h1>
              <p className="text-amber-100/80 mb-8 text-lg">
                  Necesitas iniciar sesión para acceder a esta página. ¡Únete a la comunidad Vako Club!
              </p>
              <div className="flex gap-4 justify-center">
                  <Button asChild size="lg">
                      <Link to="/login" state={{
              from: location
            }} replace>Iniciar Sesión</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                      <Link to="/suscripcion" state={{
              from: location
            }} replace>Registrarse</Link>
                  </Button>
              </div>
          </motion.div>
      </div>;
  }
  if (adminOnly && user.role !== 'admin' && user.role !== 'superadmin') {
    return <div className="min-h-[60vh] flex items-center justify-center wine-pattern p-4">
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.5
      }} className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl text-center max-w-lg">
          <ShieldAlert className="h-16 w-16 mx-auto text-red-400 mb-6" />
          <h1 className="font-playfair text-4xl font-bold text-red-400/80 mb-4">Acceso Denegado</h1>
          <p className="text-amber-100/80 mb-8 text-lg">
            No tienes los permisos necesarios para acceder a esta página.
          </p>
          <Button asChild size="lg">
            <Link to="/">Volver al Inicio</Link>
          </Button>
        </motion.div>
      </div>;
  }
  return children;
};
export default ProtectedRoute;