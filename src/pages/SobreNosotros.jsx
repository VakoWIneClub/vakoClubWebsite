import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Wine, Book, Grape, Store, Users } from 'lucide-react';

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>Sobre Nosotros - Vako Club</title>
        <meta name="description" content="Conoce la historia y la misión de Vako Club, un proyecto nacido de la pasión por el vino y el deseo de crear una comunidad global de aficionados." />
        <meta property="og:title" content="Sobre Nosotros - Vako Club" />
        <meta property="og:description" content="Conoce la historia y la misión de Vako Club, un proyecto nacido de la pasión por el vino y el deseo de crear una comunidad global de aficionados." />
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
            <h1 className="font-playfair text-5xl md:text-6xl font-bold wine-text-gradient">Nuestra Historia</h1>
            <p className="text-xl md:text-2xl text-amber-100/90 max-w-3xl mx-auto">
              Nacimos de una simple pasión: el amor por el vino y el deseo de compartirlo.
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
              Vako Club es más que un simple club de vinos; es una comunidad global para aficionados, expertos y curiosos. Nuestro viaje comenzó con la idea de crear un espacio accesible y enriquecedor donde cualquier persona pudiera explorar el vasto y fascinante mundo del vino, sin importar su nivel de conocimiento. Creemos que cada botella tiene una historia que contar, y nuestra misión es ayudarte a descubrirla.
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
                  Nuestra Guía
                </h2>
                <p className="text-md md:text-lg leading-relaxed">
                  Ofrecemos una guía completa y en constante crecimiento, con artículos detallados sobre regiones vinícolas, variedades de uva, técnicas de cata y maridajes. Queremos que aprendas a tu propio ritmo, de una manera amena y visual.
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
                  Nuestras Experiencias
                </h2>
                <p className="text-md md:text-lg leading-relaxed">
                  Organizamos eventos y catas, tanto virtuales como presenciales, para que puedas conectar con otros miembros y aprender directamente de los expertos. Creemos en el poder de las experiencias compartidas para enriquecer la pasión por el vino.
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
                Nuestra Tienda
              </h2>
              <p className="text-md md:text-lg leading-relaxed">
                Nuestra tienda no solo ofrece una selección curada de vinos, sino también merchandising exclusivo y accesorios para que puedas vivir la cultura del vino en todos los aspectos de tu vida. Cada producto es elegido con el mismo cuidado y pasión que dedicamos a nuestro contenido.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="text-lg md:text-xl leading-relaxed font-semibold text-center mt-10 wine-text-gradient"
            >
              Te invitamos a unirte a nuestra mesa, a levantar tu copa y a brindar con nosotros por las infinitas historias que el vino tiene para ofrecer. ¡Salud!
            </motion.p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;