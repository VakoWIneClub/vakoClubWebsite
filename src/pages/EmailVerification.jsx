import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MailCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const EmailVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const [verificationState, setVerificationState] = useState('verifying'); // verifying, verified, failed

    useEffect(() => {
        // Supabase handles email verification via the URL hash.
        // The onAuthStateChange listener in SupabaseAuthContext will detect the sign-in event.
        // We can check for the hash to update the UI.
        if (location.hash.includes('type=signup') || location.hash.includes('type=recovery')) {
            setVerificationState('verified');
             toast({
                title: "¡Éxito!",
                description: "Tu correo electrónico ha sido verificado.",
                variant: "success",
            });
        } else {
             // This can happen if the user navigates to the page directly without the token
             // or if the token is invalid.
             setVerificationState('failed');
        }
    }, [location.hash, toast]);


    const handleRedirect = () => {
        navigate('/');
    };

    const renderContent = () => {
        switch (verificationState) {
            case 'verifying':
                return (
                    <>
                        <Loader2 className="h-20 w-20 mx-auto wine-text-gradient mb-6 animate-spin" />
                        <h1 className="font-playfair text-4xl font-bold wine-text-gradient">
                            Verificando...
                        </h1>
                        <p className="mt-4 text-lg text-amber-100/80">
                            Un momento, por favor. Estamos verificando tu correo electrónico.
                        </p>
                    </>
                );
            case 'verified':
                return (
                    <>
                         <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-block"
                        >
                            <MailCheck className="h-20 w-20 mx-auto wine-text-gradient mb-6" />
                        </motion.div>
                        <h1 className="font-playfair text-4xl font-bold wine-text-gradient">
                           ¡Email Verificado!
                        </h1>
                        <p className="mt-4 text-lg text-amber-100/80">
                            ¡Gracias por confirmar tu correo! Ahora eres parte de Vako Club.
                        </p>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <Button
                                onClick={handleRedirect}
                                className="w-full text-lg py-6 mt-8"
                                variant="default"
                            >
                                Ir al Inicio
                            </Button>
                        </motion.div>
                    </>
                );
            case 'failed':
                 return (
                    <>
                        <MailCheck className="h-20 w-20 mx-auto text-red-400 mb-6" />
                        <h1 className="font-playfair text-4xl font-bold text-red-400">
                           Verificación Fallida
                        </h1>
                        <p className="mt-4 text-lg text-amber-100/80">
                           El enlace de verificación no es válido o ha expirado. Por favor, intenta iniciar sesión de nuevo para reenviar el correo.
                        </p>
                         <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full text-lg py-6 mt-8"
                                variant="destructive"
                            >
                                Ir a Iniciar Sesión
                            </Button>
                        </motion.div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Helmet>
                <title>Verificar Email - Vako Club</title>
                <meta name="description" content="Verifica tu dirección de correo electrónico para completar tu registro en Vako Club." />
            </Helmet>
            <div className="min-h-screen wine-pattern flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md text-center"
                >
                    <div className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
                       {renderContent()}
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default EmailVerification;