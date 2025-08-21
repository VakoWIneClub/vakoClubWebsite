import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/');
    };

    return (
        <>
            <Helmet>
                <title>Email Verificado - Vako Club</title>
                <meta name="description" content="Tu dirección de correo electrónico ha sido verificada con éxito en Vako Club." />
            </Helmet>
            <div className="min-h-screen wine-pattern flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md text-center"
                >
                    <div className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
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
                            ¡Gracias por confirmar tu correo! Tu cuenta ha sido verificada y ahora eres parte de Vako Club.
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
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default EmailVerification;