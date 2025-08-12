import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Compass, Wine, Grape, Map } from 'lucide-react';

const Guia = () => {
  const guides = [
    {
      title: 'Guía de Cata para Principiantes',
      description: 'Aprende los pasos básicos para catar vino como un profesional. Desde la vista hasta el gusto, te guiamos en cada paso.',
      icon: Wine,
    },
    {
      title: 'El Arte del Maridaje',
      description: 'Descubre cómo combinar tus vinos favoritos con la comida perfecta. Consejos y trucos para crear armonías inolvidables.',
      icon: Grape,
    },
    {
      title: 'Explorando Regiones Vinícolas',
      description: 'Viaja con nosotros a través de las regiones vinícolas más famosas del mundo. Conoce sus uvas, climas y vinos icónicos.',
      icon: Map,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Guía de Vinos - Vako Club</title>
        <meta name="description" content="Explora nuestras guías de vino en Vako Club. Aprende sobre cata, maridaje, regiones vinícolas y mucho más para convertirte en un experto." />
      </Helmet>

      <div className="min-h-screen wine-pattern pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Compass className="h-16 w-16 mx-auto wine-text-gradient mb-4" />
            <h1 className="font-playfair text-5xl md:text-6xl font-bold wine-text-gradient">
              Guía de Vinos Vako Club
            </h1>
            <p className="mt-4 text-xl text-amber-100/80 max-w-3xl mx-auto">
              Tu brújula en el mundo del vino. Explora nuestras guías y conviértete en un conocedor.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="wine-card rounded-2xl p-8 wine-hover cursor-pointer h-full flex flex-col"
                >
                  <div className="flex-shrink-0">
                    <div className="inline-flex p-4 rounded-full bg-amber-200/10 mb-6">
                      <Icon className="h-8 w-8 text-amber-200" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-playfair text-2xl font-semibold text-amber-200 mb-4">
                      {guide.title}
                    </h3>
                    <p className="text-amber-100/80 leading-relaxed">
                      {guide.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Guia;