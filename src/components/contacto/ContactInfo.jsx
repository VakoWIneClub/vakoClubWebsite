import React from 'react';
import { Mail, Instagram, Youtube } from 'lucide-react';
import { TikTokIcon } from '@/components/ui/TikTokIcon';
import Reveal from '@/components/copa/Reveal';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    info: 'info@vakoclub.com',
    description: 'Respuesta en 24 horas',
    href: 'mailto:info@vakoclub.com'
  },
  {
    icon: Instagram,
    title: 'Instagram',
    info: '@vakoclub',
    description: 'Contenido exclusivo y catas',
    href: 'https://www.instagram.com/vakoclub'
  },
  {
    icon: TikTokIcon,
    title: 'TikTok',
    info: '@vako.club',
    description: 'Videos cortos y divertidos',
    href: 'https://www.tiktok.com/@vako.club'
  },
  {
    icon: Youtube,
    title: 'YouTube',
    info: 'VakoWineClub',
    description: 'Tutoriales y entrevistas',
    href: 'https://www.youtube.com/@VakoWineClub'
  }
];

const ContactInfo = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
      {contactInfo.map((info, index) => {
        const Icon = info.icon;
        return (
          <Reveal key={info.title} delay={Math.min(index * 0.06, 0.24)}>
            <a
              href={info.href}
              target="_blank"
              rel="noopener noreferrer"
              className="copa-card p-6 text-center block h-full"
            >
              <Icon className="h-6 w-6 text-copa-burgundy mx-auto mb-4" />
              <h3 className="font-cormorant" style={{ fontSize: 20 }}>
                {info.title}
              </h3>
              <p className="text-copa-ink font-medium mt-1">
                {info.info}
              </p>
              <p className="text-copa-ink/60 text-sm mt-1">
                {info.description}
              </p>
            </a>
          </Reveal>
        );
      })}
    </div>
  );
};

export default ContactInfo;
