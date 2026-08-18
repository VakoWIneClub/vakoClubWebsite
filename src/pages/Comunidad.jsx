import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Users, MessageCircle, Heart, Share2, Instagram, Youtube, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ForoTab from '@/components/comunidad/ForoTab';
import MiembrosTab from '@/components/comunidad/MiembrosTab';
import { TikTokIcon } from '@/components/ui/TikTokIcon';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Reveal from '@/components/copa/Reveal';

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/vakoclub', label: 'Instagram' },
  { icon: TikTokIcon, href: 'https://www.tiktok.com/@vako.club', label: 'TikTok' },
  { icon: Youtube, href: 'https://www.youtube.com/@VakoWineClub', label: 'YouTube' },
];

const Comunidad = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'miembros' ? 'miembros' : 'foro');

  const handleInteraction = () => {
    toast({
      title: "¡Próximamente!",
      description: "Esta función estará disponible muy pronto para que puedas invitar a tus amigos."
    });
  };

  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>Comunidad - Vako Club</title>
        <meta name="description" content="Únete a la comunidad de Vako Club. Participa en nuestro foro de vinos, conoce a otros miembros y comparte tu pasión." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20">
        <Reveal className="text-center mb-16">
          <div className="copa-eyebrow">Vako Club</div>
          <h1 className="font-cormorant font-light leading-[1.05] mt-4" style={{ fontSize: 'clamp(36px,5.5vw,56px)' }}>
            Nuestra Comunidad
          </h1>
          <p className="mt-5 text-copa-ink/75 max-w-2xl mx-auto" style={{ fontSize: 18, lineHeight: 1.6 }}>
            Un lugar para conectar, debatir y compartir tu amor por el vino.
          </p>
          {!user && (
            <Link to="/suscripcion" className="copa-btn-primary inline-flex items-center mt-8">
              <UserPlus className="mr-2 h-5 w-5" />
              Únete al Club
            </Link>
          )}
        </Reveal>

        <Reveal delay={0.05} className="border border-copa-gold bg-copa-creamDeep p-8 mb-16 text-center">
          <h2 className="font-cormorant font-light" style={{ fontSize: 30 }}>Síguenos en Redes</h2>
          <p className="text-copa-ink/70 max-w-2xl mx-auto mt-3" style={{ fontSize: 16 }}>
            No te pierdas nuestras últimas noticias, catas en vivo y contenido exclusivo.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink border border-copa-gold px-5 py-3 transition-colors hover:border-copa-burgundy hover:text-copa-burgundy"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{social.label}</span>
                </a>
              );
            })}
          </div>
        </Reveal>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-96 mx-auto mb-12 h-11 rounded-none border border-copa-gold bg-copa-cream p-1">
            <TabsTrigger
              value="foro"
              className="rounded-none font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 data-[state=active]:bg-copa-burgundy data-[state=active]:text-copa-cream data-[state=active]:shadow-none"
            >
              <MessageCircle className="mr-2 h-4 w-4" />Foro de Debate
            </TabsTrigger>
            <TabsTrigger
              value="miembros"
              className="rounded-none font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 data-[state=active]:bg-copa-burgundy data-[state=active]:text-copa-cream data-[state=active]:shadow-none"
            >
              <Users className="mr-2 h-4 w-4" />Miembros del Club
            </TabsTrigger>
          </TabsList>
          <TabsContent value="foro">
            <ForoTab />
          </TabsContent>
          <TabsContent value="miembros">
            <MiembrosTab />
          </TabsContent>
        </Tabs>

        <Reveal className="border border-copa-gold p-12 mt-20 text-center">
          <Heart className="h-10 w-10 text-copa-burgundy mx-auto" />
          <h2 className="font-cormorant font-light mt-6" style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>
            ¿Te unes a la conversación?
          </h2>
          <p className="text-copa-ink/75 max-w-2xl mx-auto mt-4" style={{ fontSize: 17, lineHeight: 1.6 }}>
            Regístrate gratis para empezar a participar en el foro, seguir a otros miembros y crear tu propio perfil de cata.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {!user && (
              <Link to="/suscripcion" className="copa-btn-primary inline-flex items-center justify-center">
                <Users className="mr-2 h-5 w-5" />
                Unirme Gratis
              </Link>
            )}
            <button type="button" onClick={handleInteraction} className="copa-btn-secondary inline-flex items-center justify-center">
              <Share2 className="mr-2 h-5 w-5" />
              Invitar a un amigo
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
export default Comunidad;
