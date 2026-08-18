import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, RefreshCw, XCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Reveal from '@/components/copa/Reveal';

const PerfilSuscripcion = () => {
  const { toast } = useToast();

  // This would come from user data in a real scenario
  const currentPlan = 'Plan Aficionado';

  const handleCancelAction = () => {
    toast({
      title: "Función en desarrollo",
      description: "Esta funcionalidad estará disponible próximamente. ¡Gracias por tu paciencia!",
    });
  };

  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>Mi Suscripción - Vako Club</title>
        <meta name="description" content="Gestiona tu suscripción y beneficios en Vako Club." />
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20">
        <div className="mb-8">
          <Link to="/perfil" className="copa-link-nav font-jost text-[11px] tracking-[0.14em] uppercase inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Perfil
          </Link>
        </div>

        <Reveal className="text-center mb-12">
          <div className="copa-eyebrow">Vako Club</div>
          <h1 className="font-cormorant font-light leading-[1.05] mt-4" style={{ fontSize: 'clamp(36px,5.5vw,56px)' }}>
            Mi Suscripción
          </h1>
          <p className="mt-5 text-copa-ink/75" style={{ fontSize: 18 }}>Gestiona tu plan y accede a tus beneficios.</p>
        </Reveal>

        <Reveal delay={0.05} className="border border-copa-gold p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <p className="text-copa-ink/60 text-sm">Tu plan actual</p>
              <h2 className="font-cormorant flex items-center justify-center md:justify-start mt-1" style={{ fontSize: 32 }}>
                <Star className="h-6 w-6 mr-3 text-copa-gold" fill="currentColor" />
                {currentPlan}
              </h2>
            </div>
            <div className="text-center md:text-right">
              <p className="font-cormorant text-copa-burgundy" style={{ fontSize: 32 }}>Gratis</p>
              <p className="text-copa-ink/60 text-sm">Para siempre</p>
            </div>
          </div>

          <div className="border-t border-copa-gold/40 pt-8">
            <h3 className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/70 mb-4">Beneficios del plan</h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-copa-burgundy shrink-0" />
                <span className="text-copa-ink/80">Acceso a la Guía Exclusiva de Bodegas</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-copa-burgundy shrink-0" />
                <span className="text-copa-ink/80">Participación en el foro de la comunidad</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-copa-burgundy shrink-0" />
                <span className="text-copa-ink/80">Creación de tu perfil de miembro personalizado</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/suscripcion" className="copa-btn-primary w-full inline-flex items-center justify-center">
                <RefreshCw className="mr-2 h-4 w-4" /> Cambiar Plan
              </Link>
              {currentPlan !== 'Plan Aficionado' && (
                <button
                  type="button"
                  onClick={handleCancelAction}
                  className="w-full inline-flex items-center justify-center font-jost text-xs font-medium tracking-[0.14em] uppercase text-copa-cream bg-red-700 px-8 py-[19px] transition-colors duration-300 hover:bg-red-800"
                >
                  <XCircle className="mr-2 h-4 w-4" /> Cancelar Suscripción
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default PerfilSuscripcion;
