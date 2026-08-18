import React from 'react';
import { Helmet } from 'react-helmet';
import { Mail, MailCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Reveal from '@/components/copa/Reveal';

const EmailVerification = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleRedirect = () => {
    navigate('/');
  };

  // This page is reached from two different moments, which used to share one unconditional
  // "¡Verificación Exitosa!" message:
  // - Suscripcion.jsx navigates here immediately after signUp() succeeds, before the visitor has
  //   opened their inbox — a session may not exist yet if the Supabase project requires email
  //   confirmation, directly contradicting a page that claims verification already happened.
  // - AuthCallback.jsx only navigates here once `session` is truthy, i.e. after the visitor
  //   actually clicked the confirmation link and Supabase established a real session — the one
  //   case where "verified" is accurate.
  // Branching on the real `session` state instead of assuming it keeps the copy honest either way.
  const isVerified = !!session;

  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen flex items-center justify-center py-16 px-4" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>{isVerified ? '¡Verificación Exitosa!' : 'Revisá tu correo'} - Vako Club</title>
        <meta
          name="description"
          content={isVerified ? 'Tu correo electrónico ha sido verificado con éxito.' : 'Confirmá tu cuenta desde el correo que te enviamos.'}
        />
      </Helmet>
      <Reveal className="w-full max-w-md text-center">
        <div className="border border-copa-gold p-8 md:p-12">
          {isVerified ? (
            <>
              <MailCheck className="h-14 w-14 text-copa-burgundy mx-auto mb-6" />
              <div className="copa-eyebrow">Vako Club</div>
              <h1 className="font-cormorant font-light mt-3" style={{ fontSize: 'clamp(30px,4vw,40px)' }}>
                ¡Verificación Exitosa!
              </h1>
              <p className="mt-4 text-copa-ink/75" style={{ fontSize: 17 }}>
                Tu cuenta ha sido verificada. ¡Bienvenido a Vako Club!
              </p>
            </>
          ) : (
            <>
              <Mail className="h-14 w-14 text-copa-burgundy mx-auto mb-6" />
              <div className="copa-eyebrow">Vako Club</div>
              <h1 className="font-cormorant font-light mt-3" style={{ fontSize: 'clamp(30px,4vw,40px)' }}>
                Revisá tu correo
              </h1>
              <p className="mt-4 text-copa-ink/75" style={{ fontSize: 17 }}>
                Te enviamos un enlace de confirmación. Abrilo desde tu bandeja de entrada para activar tu cuenta.
              </p>
            </>
          )}
          <button type="button" onClick={handleRedirect} className="copa-btn-primary w-full mt-8">
            Continuar
          </button>
        </div>
      </Reveal>
    </div>
  );
};

export default EmailVerification;
