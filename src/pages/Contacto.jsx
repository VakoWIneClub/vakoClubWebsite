import React from 'react';
import { Helmet } from 'react-helmet';
import { MessageCircle } from 'lucide-react';
import ContactInfo from '@/components/contacto/ContactInfo';
import FaqSection from '@/components/contacto/FaqSection';
import Reveal from '@/components/copa/Reveal';

const Contacto = () => {
  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>Contacto - Vako Club</title>
        <meta name="description" content="¿Tienes preguntas o sugerencias? Ponte en contacto con el equipo de Vako Club. Estamos aquí para ayudarte." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20">
        <Reveal className="text-center mb-16">
          <MessageCircle className="h-10 w-10 text-copa-burgundy mx-auto mb-6" />
          <div className="copa-eyebrow">Vako Club</div>
          <h1 className="font-cormorant font-light leading-[1.05] mt-4" style={{ fontSize: 'clamp(36px,5.5vw,56px)' }}>
            Hablemos de Vino
          </h1>
          <p className="mt-5 text-copa-ink/75 max-w-2xl mx-auto" style={{ fontSize: 18, lineHeight: 1.6 }}>
            Estamos aquí para resolver tus dudas, escuchar tus sugerencias y compartir nuestra pasión.
          </p>
        </Reveal>

        <ContactInfo />
        <FaqSection />
      </div>
    </div>
  );
};

export default Contacto;
