import React from 'react';
import Reveal from '@/components/copa/Reveal';

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
    <Reveal className="text-center" id="faq">
      <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(30px,4vw,44px)' }}>
        Preguntas Frecuentes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-10">
        {faqs.map((faq, index) => (
          <Reveal key={faq.question} delay={Math.min(index * 0.06, 0.24)} className="border border-copa-gold p-6">
            <h3 className="font-cormorant" style={{ fontSize: 20 }}>
              {faq.question}
            </h3>
            <p className="text-copa-ink/75 mt-2" style={{ lineHeight: 1.6 }}>
              {faq.answer}
            </p>
          </Reveal>
        ))}
      </div>
    </Reveal>
  );
};

export default FaqSection;
