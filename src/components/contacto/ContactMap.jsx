import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Wine } from 'lucide-react';

const ContactMap = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold wine-text-gradient mb-4">
          Visítanos
        </h2>
        <p className="text-amber-100/80 text-lg">
          Te esperamos en nuestro espacio dedicado al mundo del vino en el corazón de Madrid.
        </p>
      </div>

      <div className="wine-card rounded-2xl p-8 h-64 flex items-center justify-center">
        <div className="text-center space-y-4">
          <MapPin className="h-16 w-16 text-amber-400 mx-auto" />
          <div>
            <h3 className="font-playfair text-xl font-semibold text-amber-200">
              Nuestra Ubicación
            </h3>
            <p className="text-amber-100/70">
              Calle del Vino, 123<br />
              Madrid, España 28001
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="wine-card rounded-xl p-6">
          <h3 className="font-playfair text-xl font-semibold text-amber-200 mb-4">
            ¿Por qué elegirnos?
          </h3>
          <div className="space-y-3">
            {[
              'Más de 10 años de experiencia en el sector',
              'Equipo de sommeliers certificados',
              'Selección exclusiva de bodegas premium',
              'Eventos y catas personalizadas'
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Wine className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-amber-100/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="wine-card rounded-xl p-6">
          <h3 className="font-playfair text-xl font-semibold text-amber-200 mb-4">
            Horarios de Atención
          </h3>
          <div className="space-y-2 text-amber-100/80">
            <div className="flex justify-between">
              <span>Lunes - Viernes:</span>
              <span>9:00 - 18:00</span>
            </div>
            <div className="flex justify-between">
              <span>Sábados:</span>
              <span>10:00 - 14:00</span>
            </div>
            <div className="flex justify-between">
              <span>Domingos:</span>
              <span>Cerrado</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactMap;