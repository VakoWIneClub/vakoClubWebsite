
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
        <meta name="description" content="Consulta los términos y condiciones de uso de la plataforma Vako Club." />
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
            <p className="text-xl text-amber-100/80">Última actualización: 05 de Septiembre, 2025</p>
          </div>

          <div className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
            <LegalSection title="1. Aceptación de los Términos">
              <p>Al acceder y utilizar el sitio web de Vako Club (en adelante, "el Sitio"), usted acepta estar sujeto a estos Términos y Condiciones ("Términos"). Si no está de acuerdo con alguna parte de los términos, no podrá utilizar nuestros servicios.</p>
            </LegalSection>

            <LegalSection title="2. Uso del Sitio">
              <p>El Sitio y su contenido son para su uso personal y no comercial. No debe modificar, copiar, distribuir, transmitir, mostrar, realizar, reproducir, publicar, licenciar, crear trabajos derivados, transferir o vender ninguna información, software, productos o servicios obtenidos del Sitio.</p>
              <p>Usted se compromete a no utilizar el Sitio para ningún propósito que sea ilegal o esté prohibido por estos Términos.</p>
            </LegalSection>

            <LegalSection title="3. Cuentas de Usuario">
              <p>Para acceder a ciertas funciones del Sitio, es posible que deba crear una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, y de restringir el acceso a su computadora. Acepta la responsabilidad de todas las actividades que ocurran bajo su cuenta o contraseña.</p>
              <p>Vako Club se reserva el derecho de rechazar el servicio, cancelar cuentas, eliminar o editar contenido a su entera discreción.</p>
            </LegalSection>
            
            <LegalSection title="4. Contenido del Usuario">
              <p>Los usuarios pueden publicar contenido, como comentarios, fotos y otros materiales ("Contenido del Usuario"). Usted es el único responsable del Contenido del Usuario que publica en el Sitio. Al publicar Contenido del Usuario, nos otorga una licencia no exclusiva, libre de regalías, perpetua, irrevocable y totalmente sublicenciable para usar, reproducir, modificar, adaptar, publicar, traducir, crear trabajos derivados, distribuir y mostrar dicho contenido en todo el mundo y en cualquier medio.</p>
            </LegalSection>
            
            <LegalSection title="5. Enlaces a Terceros">
              <p>El Sitio puede contener enlaces a sitios web de terceros que no son propiedad ni están controlados por Vako Club. No tenemos control ni asumimos ninguna responsabilidad por el contenido, las políticas de privacidad o las prácticas de los sitios web de terceros.</p>
              <p>Usted reconoce y acepta que Vako Club no será responsable, directa o indirectamente, de ningún daño o pérdida causada o presuntamente causada por o en conexión con el uso o la confianza en dicho contenido, bienes o servicios disponibles en o a través de dichos sitios web.</p>
            </LegalSection>

            <LegalSection title="6. Limitación de Responsabilidad">
              <p>En la máxima medida permitida por la ley aplicable, en ningún caso Vako Club, sus afiliados, directores, empleados o agentes serán responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo, incluyendo, entre otros, la pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, como resultado de (i) su acceso o uso o incapacidad para acceder o usar el servicio; (ii) cualquier conducta o contenido de cualquier tercero en el servicio.</p>
            </LegalSection>
            
            <LegalSection title="7. Cambios en los Términos">
              <p>Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso de al menos 30 días antes de que los nuevos términos entren en vigencia. Lo que constituye un cambio material se determinará a nuestra entera discreción.</p>
            </LegalSection>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Terminos;
