
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Link } from 'react-router-dom';
import { Gem, Star, CheckCircle, RefreshCw, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PerfilSuscripcion = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // This would come from user data in a real scenario
  const currentPlan = 'Plan Aficionado'; 

  const handleCancelAction = () => {
    toast({
      title: "🚧 Función en desarrollo",
      description: "Esta funcionalidad estará disponible próximamente. ¡Gracias por tu paciencia!",
    });
  };

  return (
    <>
      <Helmet>
        <title>Mi Suscripción - Vako Club</title>
        <meta name="description" content="Gestiona tu suscripción y beneficios en Vako Club." />
      </Helmet>
      <div className="min-h-screen wine-pattern py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-8">
            <Button asChild variant="outline">
              <Link to="/perfil">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Perfil
              </Link>
            </Button>
          </div>

          <div className="text-center mb-12">
            <h1 className="font-playfair text-5xl font-bold wine-text-gradient mb-4">Mi Suscripción</h1>
            <p className="text-xl text-amber-100/80">Gestiona tu plan y accede a tus beneficios.</p>
          </div>

          <div className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <p className="text-amber-100/70">Tu plan actual</p>
                <h2 className="font-playfair text-4xl font-bold text-amber-100 flex items-center justify-center md:justify-start">
                  <Star className="h-8 w-8 mr-3 text-yellow-400" />
                  {currentPlan}
                </h2>
              </div>
              <div className="text-center md:text-right">
                <p className="text-4xl font-bold wine-text-gradient">Gratis</p>
                <p className="text-amber-100/70">Para siempre</p>
              </div>
            </div>

            <div className="border-t border-amber-200/20 pt-8">
              <h3 className="text-xl font-semibold text-amber-200 mb-4">Beneficios del plan:</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-amber-100/80">Acceso a la Guía Exclusiva de Bodegas</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-amber-100/80">Participación en el foro de la comunidad</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-amber-100/80">Creación de tu perfil de miembro personalizado</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="w-full">
                  <Link to="/suscripcion">
                    <RefreshCw className="mr-2 h-4 w-4" /> Cambiar Plan
                  </Link>
                </Button>
                {currentPlan !== 'Plan Aficionado' && (
                  <Button variant="destructive" className="w-full" onClick={handleCancelAction}>
                    <XCircle className="mr-2 h-4 w-4" /> Cancelar Suscripción
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PerfilSuscripcion;
