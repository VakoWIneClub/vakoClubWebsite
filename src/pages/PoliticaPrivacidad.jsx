import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Seo from '@/components/Seo';

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
      <Seo
        title="Política de Privacidad - Vako Club"
        description="Conoce cómo Vako Club recopila, usa y protege tu información personal."
        path="/politica-privacidad"
      />
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
            <p className="text-xl text-amber-100/80">Última actualización: 05 de Septiembre, 2025</p>
          </div>

          <div className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
            <LegalSection title="1. Introducción">
              <p>Bienvenido a Vako Club. Nos comprometemos a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos su información cuando visita nuestro sitio web.</p>
            </LegalSection>

            <LegalSection title="2. Recopilación de su Información">
              <p>Podemos recopilar información sobre usted de varias maneras. La información que podemos recopilar en el Sitio incluye:</p>
              <ul>
                <li><strong>Datos Personales:</strong> Información de identificación personal, como su nombre, dirección de correo electrónico y datos demográficos, que nos proporciona voluntariamente cuando se registra en el Sitio.</li>
                <li><strong>Datos Derivados:</strong> Información que nuestros servidores recopilan automáticamente cuando accede al Sitio, como su dirección IP, tipo de navegador, sistema operativo, etc.</li>
                <li><strong>Datos de Redes Sociales:</strong> Información del usuario de sitios de redes sociales, como Facebook, Google, si conecta su cuenta a dichas redes sociales.</li>
                <li><strong>Datos de la Comunidad:</strong> La información que publica en los foros de la comunidad, como sus comentarios, me gusta y respuestas.</li>
                <li><strong>Información de la Tienda:</strong> Los productos de nuestra tienda son vendidos por terceros (Amazon, Etsy). Vako Club no recopila datos de pago o envío.</li>
              </ul>
            </LegalSection>

            <LegalSection title="3. Uso de su Información">
              <p>Tener información precisa sobre usted nos permite brindarle una experiencia fluida, eficiente y personalizada. Específicamente, podemos usar la información recopilada sobre usted a través del Sitio para:</p>
              <ul>
                <li>Crear y administrar su cuenta.</li>
                <li>Enviarle un correo electrónico con respecto a su cuenta o pedido.</li>
                <li>Permitir la comunicación entre usuarios.</li>
                <li>Administrar sorteos, promociones y concursos.</li>
                <li>Prevenir actividades fraudulentas y monitorear contra robos.</li>
              </ul>
            </LegalSection>
            
            <LegalSection title="4. Divulgación de su Información">
              <p>No compartiremos su información con terceros, excepto como se describe en esta Política de Privacidad. Podemos compartir información sobre usted en ciertas situaciones, como en respuesta a procesos legales o para proteger los derechos y la seguridad de otros.</p>
            </LegalSection>
            
            <LegalSection title="5. Seguridad de su Información">
              <p>Utilizamos medidas de seguridad administrativas, técnicas y físicas para ayudar a proteger su información personal. Si bien hemos tomado medidas razonables para proteger la información personal que nos proporciona, tenga en cuenta que, a pesar de nuestros esfuerzos, ninguna medida de seguridad es perfecta o impenetrable.</p>
            </LegalSection>

            <LegalSection title="6. Política para Niños">
              <p>No solicitamos a sabiendas información ni comercializamos a niños menores de 18 años. Si se da cuenta de cualquier dato que hayamos recopilado de niños menores de 18 años, contáctenos utilizando la información de contacto proporcionada a continuación.</p>
            </LegalSection>
            
            <LegalSection title="7. Contacto">
              <p>Si tiene preguntas o comentarios sobre esta Política de Privacidad, contáctenos en: info@vakoclub.com</p>
            </LegalSection>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PoliticaPrivacidad;