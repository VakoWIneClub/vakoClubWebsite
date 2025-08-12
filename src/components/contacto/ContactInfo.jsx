import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Youtube } from 'lucide-react';
import { TikTokIcon } from '@/components/ui/TikTokIcon';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    info: 'info@vakoclub.com',
    description: 'Respuesta en 24 horas',
    color: 'from-blue-500 to-indigo-600',
    href: 'mailto:info@vakoclub.com'
  },
  {
    icon: Instagram,
    title: 'Instagram',
    info: '@vakoclub',
    description: 'Contenido exclusivo y catas',
    color: 'from-pink-500 to-rose-500',
    href: 'https://www.instagram.com/vakoclub'
  },
  {
    icon: TikTokIcon,
    title: 'TikTok',
    info: '@vako.club',
    description: 'Videos cortos y divertidos',
    color: 'from-gray-700 to-black',
    href: 'https://www.tiktok.com/@vako.club'
  },
  {
    icon: Youtube,
    title: 'YouTube',
    info: 'VakoWineClub',
    description: 'Tutoriales y entrevistas',
    color: 'from-red-500 to-red-600',
    href: 'https://www.youtube.com/@VakoWineClub'
  }
];

const ContactInfo = () => {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.a
                key={index}
                href={info.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="wine-card rounded-2xl p-6 text-center wine-hover block"
              >
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${info.color} mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="font-playfair text-lg font-semibold text-amber-200 mb-2">
                  {info.title}
                </h3>
                
                <p className="text-amber-100 font-medium mb-1">
                  {info.info}
                </p>
                
                <p className="text-amber-100/70 text-sm">
                  {info.description}
                </p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;