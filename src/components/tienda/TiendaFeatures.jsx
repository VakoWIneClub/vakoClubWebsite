import React from 'react';
import { motion } from 'framer-motion';
import { Award, Truck, Shield } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Selección Experta',
    description: 'Cada vino es cuidadosamente seleccionado por nuestros sommeliers certificados.',
    color: 'from-amber-500 to-yellow-600'
  },
  {
    icon: Truck,
    title: 'Envío Seguro',
    description: 'Embalaje especializado para proteger tu compra.',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Shield,
    title: 'Garantía Total',
    description: 'Garantía de satisfacción del 100% o te devolvemos tu dinero.',
    color: 'from-green-500 to-emerald-600'
  }
];

const TiendaFeatures = () => {
  return (
    <section className="py-20 wine-glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center space-y-4"
              >
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.color}`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-amber-200">
                  {feature.title}
                </h3>
                <p className="text-amber-100/80 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TiendaFeatures;