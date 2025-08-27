import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

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

const PoliticaPrivacidad = () => {
  return (
    <>
      <Helmet>
        <link
          rel="icon"
          href="/images/VakoLogo.png"
          type="image/png"
          sizes="32x32"
        />
        <title>Política de Privacidad - Vako Club</title>
        <meta name="description" content="Conoce cómo Vako Club recopila, utiliza y protege tu información personal." />
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
                <ShieldCheck className="h-12 w-12 text-amber-200" />
              </div>
            <h1 className="font-playfair text-5xl font-bold wine-text-gradient mb-4">Política de Privacidad</h1>
            <p className="text-xl text-amber-100/80">Última actualización: 1 de agosto de 2025</p>
          </div>

          <div className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
            <LegalSection title="1. Introducción">
              <p>En Vako Wine Club, respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política de privacidad te informará sobre cómo cuidamos tus datos personales cuando visitas nuestro sitio web y te informará sobre tus derechos de privacidad y cómo la ley te protege.</p>
            </LegalSection>

            <LegalSection title="2. Información que Recopilamos">
              <p>Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre ti, que hemos agrupado de la siguiente manera:</p>
              <ul>
                <li><strong>Datos de Identidad:</strong> Incluye nombre, apellido y nombre de usuario.</li>
                <li><strong>Datos de Contacto:</strong> Incluye dirección de correo electrónico.</li>
                <li><strong>Datos Técnicos:</strong> Incluye dirección IP, datos de inicio de sesión, tipo y versión del navegador, etc.</li>
                <li><strong>Datos del Perfil:</strong> Incluye tu nombre de usuario y contraseña, tus intereses, preferencias, y comentarios.</li>
                <li><strong>Datos de Uso:</strong> Incluye información sobre cómo utilizas nuestro sitio web y servicios.</li>
              </ul>
            </LegalSection>

            <LegalSection title="3. Cómo Utilizamos tu Información">
              <p>Utilizamos tus datos personales para:</p>
              <ul>
                <li>Registrarte como nuevo cliente.</li>
                <li>Gestionar nuestra relación contigo.</li>
                <li>Permitirte participar en foros, sorteos o encuestas.</li>
                <li>Administrar y proteger nuestro negocio y este sitio web.</li>
                <li>Entregarte contenido relevante del sitio web y anuncios, y medir o comprender la efectividad de la publicidad que te servimos.</li>
              </ul>
            </LegalSection>
            
            <LegalSection title="4. Cookies">
              <p>Puedes configurar tu navegador para que rechace todas o algunas cookies del navegador, o para que te avise cuando los sitios web establezcan o accedan a las cookies. Si deshabilitas o rechazas las cookies, ten en cuenta que algunas partes de este sitio web pueden volverse inaccesibles o no funcionar correctamente.</p>
            </LegalSection>
            
            <LegalSection title="5. Seguridad de los Datos">
              <p>Hemos implementado medidas de seguridad apropiadas para evitar que tus datos personales se pierdan accidentalmente, se usen o se accedan de forma no autorizada, se alteren o se divulguen. Utilizamos la plataforma Supabase para garantizar la seguridad y gestión de los datos de autenticación.</p>
            </LegalSection>

            <LegalSection title="6. Tus Derechos Legales">
              <p>Bajo ciertas circunstancias, tienes derechos bajo las leyes de protección de datos en relación con tus datos personales, como el derecho a solicitar acceso, corrección, eliminación o restricción de tus datos personales.</p>
            </LegalSection>
            
            <LegalSection title="7. Contacto">
              <p>Si tienes alguna pregunta sobre esta política de privacidad, por favor contáctanos a través de la información proporcionada en nuestra página de Contacto.</p>
            </LegalSection>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PoliticaPrivacidad;