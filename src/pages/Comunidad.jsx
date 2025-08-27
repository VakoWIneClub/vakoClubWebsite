import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Users, MessageCircle, Heart, Share2, Instagram, Youtube, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ForoTab from '@/components/comunidad/ForoTab';
import MiembrosTab from '@/components/comunidad/MiembrosTab';
import { TikTokIcon } from '@/components/ui/TikTokIcon';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const Comunidad = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('foro');

  const tabs = [
    { id: 'foro', name: 'Foro', icon: MessageCircle },
    { id: 'miembros', name: 'Miembros', icon: Users },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/vakoclub', label: 'Instagram', color: 'from-pink-500 to-rose-500' },
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@vako.club', label: 'TikTok', color: 'from-gray-700 to-black' },
    { icon: Youtube, href: 'https://www.youtube.com/@VakoWineClub', label: 'YouTube', color: 'from-red-500 to-red-600' }
  ];

  const handleInteraction = () => {
    toast({
      title: "🚧 Esta funcionalidad aún no está implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀",
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'foro':
        return <ForoTab />;
      case 'miembros':
        return <MiembrosTab />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <link
          rel="icon"
          href="/images/VakoLogo.png"
          type="image/png"
          sizes="32x32"
        />
        <title>Comunidad - Vako Club | Conecta con Amantes del Vino</title>
        <meta name="description" content="Únete a nuestra comunidad de amantes del vino. Participa en foros de discusión y conecta con expertos sommeliers y enólogos." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 wine-pattern opacity-20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="p-6 wine-gradient rounded-full wine-shadow">
                <Users className="h-16 w-16 text-white" />
              </div>
            </motion.div>

            <h1 className="font-playfair text-5xl md:text-6xl font-bold wine-text-gradient">
              Nuestra Comunidad
            </h1>

            <p className="text-xl md:text-2xl text-amber-100/90 max-w-3xl mx-auto">
              Conecta con apasionados del vino, comparte experiencias y descubre nuevos sabores juntos.
            </p>
            {!user && (
              <Link to="/suscripcion">
                <Button size="lg">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Únete a la Comunidad
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 wine-glass-effect">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold wine-text-gradient mb-4">
              Síguenos en Redes Sociales
            </h2>
            <p className="text-lg text-amber-100/70 max-w-2xl mx-auto">
              No te pierdas nuestro contenido exclusivo, eventos en vivo y mucho más.
            </p>
          </motion.div>
          <div className="flex justify-center gap-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium text-white transition-all duration-300 bg-gradient-to-r ${social.color} wine-shadow`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="hidden sm:inline">{social.label}</span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'wine-gradient text-white wine-shadow'
                      : 'wine-card text-amber-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 wine-glass-effect">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <Heart className="h-16 w-16 text-red-400 mx-auto" />
            
            <h2 className="font-playfair text-4xl md:text-5xl font-bold wine-text-gradient">
              Únete a la Familia
            </h2>
            
            <p className="text-xl text-amber-100/80 max-w-2xl mx-auto">
              Forma parte de una comunidad apasionada donde cada copa cuenta una historia y cada encuentro crea nuevas amistades.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <Link to="/suscripcion">
                  <Button 
                    className="px-8 py-4 text-lg wine-gradient hover:opacity-90 transition-all duration-300 wine-shadow"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Unirse Gratis
                  </Button>
                </Link>
              )}
              
              <Button 
                variant="outline"
                className="px-8 py-4 text-lg border-amber-400 text-amber-200 hover:bg-amber-400 hover:text-amber-900 transition-all duration-300"
                onClick={handleInteraction}
              >
                <Share2 className="mr-2 h-5 w-5" />
                Invitar Amigos
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Comunidad;