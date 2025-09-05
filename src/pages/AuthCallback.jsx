
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
    if (session) {
      toast({
        title: "¡Sesión iniciada!",
        description: "Has sido autenticado correctamente.",
        variant: "success",
      });
      navigate('/email-verification');
    }
  }, [session, navigate, toast]);

  return (
    <>
      <Helmet>
        <title>Verificando...</title>
        <meta name="description" content="Procesando autenticación." />
      </Helmet>
      <div className="min-h-screen wine-pattern flex flex-col items-center justify-center text-center text-amber-100">
        <Loader2 className="h-16 w-16 animate-spin text-amber-300 mb-4" />
        <h1 className="text-3xl font-playfair mb-2">Verificando tu sesión</h1>
        <p className="text-lg">Por favor, espera un momento.</p>
      </div>
    </>
  );
};

export default AuthCallback;
