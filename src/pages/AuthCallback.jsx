import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // onAuthStateChange in AuthProvider handles session updates.
    // We just need to wait for the session to be available and then redirect.
    if (session) {
      toast({
        title: "¡Bienvenido de vuelta!",
        description: "Has iniciado sesión correctamente.",
        variant: "success",
      });
      // Redirect to the intended page after verification/login
      // For a new signup, this effectively takes them to the email-verification success page.
      // For other auth actions, it will also show a success page.
      navigate('/email-verification');
    }
  }, [session, navigate, toast]);

  return (
    <>
      <Helmet>
        <title>Autenticando - Vako Club</title>
        <meta name="description" content="Procesando autenticación. Por favor, espere." />
      </Helmet>
      <div className="min-h-screen wine-pattern flex flex-col items-center justify-center text-center text-amber-100">
        <Loader2 className="h-16 w-16 animate-spin text-amber-300 mb-4" />
        <h1 className="text-3xl font-playfair mb-2">Autenticando...</h1>
        <p className="text-lg">Por favor, espera un momento.</p>
      </div>
    </>
  );
};

export default AuthCallback;