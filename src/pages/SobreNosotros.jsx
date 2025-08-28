
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Wine, Book, Grape, Store, Users } from 'lucide-react';

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>Sobre Nosotros - Vako Club | Cultura y Pasión por el Vino</title>
        <meta name="description" content="Descubre Vako Club: tu guía exclusiva para el fascinante universo del vino. Cultura, historia, experiencias únicas y vinos excepcionales." />
        <meta property="og:title" content="Sobre Nosotros - Vako Club | Cultura y Pasión por el Vino" />
        <meta property="og:description" content="Descubre Vako Club: tu guía exclusiva para el fascinante universo del vino. Cultura, historia, experiencias únicas y vinos excepcionales." />
      </Helmet>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 wine-pattern opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center space-y-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="flex justify-center">
              <div className="p-6 wine-gradient rounded-full wine-shadow">
                <Wine className="h-16 w-16 text-white" />
              </div>
            </motion.div>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold wine-text-gradient">Sobre Nosotros</h1>
            <p className="text-xl md:text-2xl text-amber-100/90 max-w-3xl mx-auto">
              Descubre la historia y la pasión que impulsan a Vako Club.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="wine-card rounded-2xl p-8 md:p-12 space-y-10 text-amber-100/80">
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg md:text-xl leading-relaxed"
            >
              En Vako Wine Club creemos que el vino es mucho más que una bebida: es cultura, historia, territorio y pasión compartida. Nacimos con la misión de acercar a nuestros lectores y miembros al fascinante universo del vino, combinando conocimiento, actualidad y experiencias únicas.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="space-y-4"
              >
                <h2 className="font-playfair text-3xl font-bold wine-text-gradient flex items-center">
                  <Book className="mr-3 h-8 w-8 text-amber-400" />
                  Nuestra Guía Exclusiva
                </h2>
                <p className="text-md md:text-lg leading-relaxed">
                  Somos una guía exclusiva que reúne artículos informativos sobre las últimas noticias del sector, entrevistas con bodegas, recorridos por regiones vitivinícolas, reseñas de vinos y recomendaciones de maridaje pensadas tanto para aficionados como para expertos.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="space-y-4"
              >
                <h2 className="font-playfair text-3xl font-bold wine-text-gradient flex items-center">
                  <Grape className="mr-3 h-8 w-8 text-amber-400" />
                  Experiencias en Primera Persona
                </h2>
                <p className="text-md md:text-lg leading-relaxed">
                  Además, mantenemos a nuestra comunidad al día con una agenda de eventos, catas y experiencias enogastronómicas que permiten vivir el vino en primera persona.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="space-y-4"
            >
              <h2 className="font-playfair text-3xl font-bold wine-text-gradient flex items-center">
                <Store className="mr-3 h-8 w-8 text-amber-400" />
                Nuestra Tienda Oficial
              </h2>
              <p className="text-md md:text-lg leading-relaxed">
                Y para quienes desean llevar la experiencia un paso más allá, contamos con nuestra tienda oficial, donde seleccionamos cuidadosamente etiquetas que reflejan la calidad, autenticidad y diversidad del mundo del vino.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="text-lg md:text-xl leading-relaxed font-semibold text-center mt-10 wine-text-gradient"
            >
              En Vako Wine Club no solo hablamos de vino: lo compartimos, lo celebramos y lo convertimos en un estilo de vida.
            </motion.p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
