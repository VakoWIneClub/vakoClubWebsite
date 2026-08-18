import React from 'react';
import { Helmet } from 'react-helmet';
import { MailCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Reveal from '@/components/copa/Reveal';

const EmailVerification = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen flex items-center justify-center py-16 px-4" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>¡Verificación Exitosa! - Vako Club</title>
        <meta name="description" content="Tu correo electrónico ha sido verificado con éxito." />
      </Helmet>
      <Reveal className="w-full max-w-md text-center">
        <div className="border border-copa-gold p-8 md:p-12">
          <MailCheck className="h-14 w-14 text-copa-burgundy mx-auto mb-6" />
          <div className="copa-eyebrow">Vako Club</div>
          <h1 className="font-cormorant font-light mt-3" style={{ fontSize: 'clamp(30px,4vw,40px)' }}>
            ¡Verificación Exitosa!
          </h1>
          <p className="mt-4 text-copa-ink/75" style={{ fontSize: 17 }}>
            Tu cuenta ha sido verificada. ¡Bienvenido a Vako Club!
          </p>
          <button type="button" onClick={handleRedirect} className="copa-btn-primary w-full mt-8">
            Continuar
          </button>
        </div>
      </Reveal>
    </div>
  );
};

export default EmailVerification;
