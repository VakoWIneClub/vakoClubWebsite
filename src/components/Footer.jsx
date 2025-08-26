
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube } from 'lucide-react';
import { TikTokIcon } from '@/components/ui/TikTokIcon';

const Footer = () => {
  const footerSections = [
    {
      title: 'Compañía',
      links: [
        { name: 'Sobre Nosotros', path: '#' },
        { name: 'Eventos', path: '/eventos' },
        { name: 'Guía de Vinos', path: '/guia' },
      ],
    },
    {
      title: 'Comunidad',
      links: [
        { name: 'Foro', path: '/comunidad' },
        { name: 'Miembros', path: '/comunidad?tab=miembros' },
        { name: 'Eventos', path: '/eventos' },
      ],
    },
    {
      title: 'Soporte',
      links: [
        { name: 'Contacto', path: '/contacto' },
        { name: 'FAQs', path: '/contacto#faq' },
        { name: 'Términos de Uso', path: '/terminos' },
        { name: 'Política de Privacidad', path: '/politica-privacidad' },
      ],
    },
  ];

  const socialLinks = [
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@vako.club', name: 'TikTok' },
    { icon: Instagram, href: 'https://www.instagram.com/vakoclub', name: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@VakoWineClub', name: 'YouTube' },
  ];

  return (
    <footer className="bg-stone-950 text-amber-100/70 border-t-2 border-amber-900/50 wine-glass-effect mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-playfair font-bold wine-text-gradient">
                Vako Club
              </h2>
            </Link>
            <p className="mt-4 text-sm">
              Tu pasaporte al mundo del vino. Descubre, aprende y disfruta.
            </p>
          </div>
          {footerSections.map((section, index) => (
            <div key={index}>
              <p className="font-semibold text-amber-200 uppercase tracking-wider">{section.title}</p>
              <ul className="mt-4 space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-amber-200 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-amber-900/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Vako Club. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="hover:text-amber-200 transition-colors duration-300"
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
