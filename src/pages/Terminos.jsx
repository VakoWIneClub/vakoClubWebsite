import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const LegalSection = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-8"
  >
    <h2 className="font-playfair text-2xl font-bold wine-text-gradient mb-4">{title}</h2>
    <div className="space-y-4 text-amber-100/80 prose prose-invert max-w-none">
      {children}
    </div>
  </motion.div>
);

const Terminos = () => {
  return (
    <>
      <Helmet>
        <title>Términos y Condiciones - Vako Club</title>
        <meta name="description" content="Lee los Términos y Condiciones de uso de la plataforma y servicios de Vako Club." />
      </Helmet>
      <div className="min-h-screen wine-pattern py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
             <div className="inline-flex p-4 rounded-full bg-amber-200/10 mb-4">
                <FileText className="h-12 w-12 text-amber-200" />
              </div>
            <h1 className="font-playfair text-5xl font-bold wine-text-gradient mb-4">Términos y Condiciones</h1>
            <p className="text-xl text-amber-100/80">Última actualización: 1 de agosto de 2025</p>
          </div>

          <div className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
            <LegalSection title="1. Aceptación de los Términos">
              <p>Al acceder y utilizar Vako Wine Club (en adelante, "el Sitio Web"), aceptas cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no estás de acuerdo con estos términos, no debes utilizar el Sitio Web.</p>
            </LegalSection>

            <LegalSection title="2. Uso del Sitio Web">
              <p>El contenido y los servicios ofrecidos en el Sitio Web son para tu uso personal y no comercial. No puedes modificar, copiar, distribuir, transmitir, mostrar, realizar, reproducir, publicar, licenciar, crear trabajos derivados, transferir o vender ninguna información, software, productos o servicios obtenidos del Sitio Web.</p>
              <p>Te comprometes a no utilizar el Sitio Web para ningún propósito ilegal o prohibido por estos términos.</p>
            </LegalSection>

            <LegalSection title="3. Cuentas de Usuario">
              <p>Para acceder a ciertas funciones del Sitio Web, es posible que debas registrarte para obtener una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y cuenta, y eres totalmente responsable de todas las actividades que ocurran bajo tu cuenta.</p>
              <p>Nos reservamos el derecho de suspender o cancelar tu cuenta en cualquier momento si violas alguno de estos términos.</p>
            </LegalSection>
            
            <LegalSection title="4. Propiedad Intelectual">
              <p>Todo el contenido del Sitio Web, incluyendo textos, gráficos, logos, iconos, imágenes y software, es propiedad de Vako Wine Club o de sus proveedores de contenido y está protegido por las leyes de derechos de autor internacionales.</p>
            </LegalSection>
            
            <LegalSection title="5. Limitación de Responsabilidad">
              <p>El Sitio Web se proporciona "tal cual" y "según disponibilidad". Vako Wine Club no ofrece garantías de ningún tipo, ya sean expresas o implícitas, sobre el funcionamiento del sitio o la información, contenido, materiales o productos incluidos en este sitio.</p>
              <p>En ningún caso Vako Wine Club será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que surja del uso o la imposibilidad de uso del Sitio Web.</p>
            </LegalSection>

            <LegalSection title="6. Modificaciones de los Términos">
              <p>Nos reservamos el derecho de cambiar estos términos en cualquier momento. Tu uso continuado del Sitio Web después de cualquier cambio constituirá tu aceptación de los nuevos términos.</p>
            </LegalSection>
            
            <LegalSection title="7. Contacto">
              <p>Si tienes alguna pregunta sobre estos Términos y Condiciones, por favor contáctanos a través de la información proporcionada en nuestra página de Contacto.</p>
            </LegalSection>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Terminos;