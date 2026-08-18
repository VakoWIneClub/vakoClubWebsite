import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube } from 'lucide-react';
import { TikTokIcon } from '@/components/ui/TikTokIcon';

const Footer = () => {
  const footerSections = [
    {
      title: "Compañía",
      links: [
        { name: "Sobre Nosotros", path: '/sobre-nosotros' },
        { name: "Eventos", path: '/eventos' },
        { name: "Noticias", path: '/noticias' },
      ],
    },
    {
      title: "Comunidad",
      links: [
        { name: "Foro", path: '/comunidad' },
        { name: "Miembros", path: '/comunidad?tab=miembros' },
        { name: "Eventos", path: '/eventos' },
      ],
    },
    {
      title: "Soporte",
      links: [
        { name: "Contacto", path: '/contacto' },
        { name: "Términos de Uso", path: '/terminos' },
        { name: "Política de Privacidad", path: '/politica-privacidad' },
      ],
    },
  ];

  const socialLinks = [
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@vako.club', name: 'TikTok' },
    { icon: Instagram, href: 'https://www.instagram.com/vakoclub', name: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@VakoWineClub', name: 'YouTube' },
  ];

  return (
    <footer className="bg-copa-burgundy text-copa-cream/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/images/VakoLogo.png" alt="" className="h-8 w-8 rounded-full" />
              <span className="font-cormorant text-2xl text-copa-cream">Vako Club</span>
            </Link>
            <p className="mt-4 text-sm text-copa-cream/70" style={{ fontFamily: "'EB Garamond', serif" }}>
              Tu pasaporte al mundo del vino. Descubre, aprende y disfruta.
            </p>
          </div>
          {footerSections.map((section, index) => (
            <div key={index}>
              <p className="copa-eyebrow">{section.title}</p>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-sm text-copa-cream/80 hover:text-copa-gold transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-copa-gold/25 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-copa-cream/60 text-center md:text-left">
            &copy; {new Date().getFullYear()} Vako Club. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="text-copa-gold hover:text-copa-cream transition-colors duration-300"
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
