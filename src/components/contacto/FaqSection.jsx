import React from 'react';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: '¿Tienen envío a toda España?',
    answer: 'Sí, realizamos envíos a toda Europa y el mundo.'
  },
  {
    question: '¿Los cursos incluyen certificación?',
    answer: 'Nuestros cursos avanzados incluyen certificación oficial reconocida internacionalmente.'
  }
];

const FaqSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold wine-text-gradient">
            Preguntas Frecuentes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="wine-card rounded-xl p-6"
              >
                <h3 className="font-playfair text-lg font-semibold text-amber-200 mb-3">
                  {faq.question}
                </h3>
                <p className="text-amber-100/80">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;