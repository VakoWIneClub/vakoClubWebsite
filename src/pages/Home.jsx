import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Wine, Star, Users, Calendar, ShoppingBag, Award, Heart, Grape, Paintbrush, Shirt, GlassWater, Compass, PartyPopper, Copy, BadgePercent, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';

const WelcomePopup = ({
  isOpen,
  onOpenChange
}) => {
  const {
    toast
  } = useToast();
  const copyCoupon = () => {
    navigator.clipboard.writeText('BONARDA20%');
    toast({
      title: "¡Cupón copiado!",
      description: "Usa BONARDA20% en la tienda."
    });
  };
  return <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <motion.div animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -15, 15, 0]
          }} transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut'
          }}>
              <PartyPopper className="h-16 w-16 text-amber-400" />
            </motion.div>
          </div>
          <AlertDialogTitle className="text-center font-playfair text-2xl">
            ¡Bienvenido a la familia Vako Club!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base space-y-3">
            <p>Para celebrar tu llegada, te regalamos un <strong>20% de descuento</strong> en merchandising y arte. ¡Explora nuestra tienda y encuentra tu pieza favorita!</p>
            <div className="bg-stone-800/50 border border-amber-500/30 rounded-lg p-3 flex items-center justify-center gap-4">
              <span className="font-mono text-lg text-amber-300 tracking-widest">BONARDA20%</span>
              <Button variant="ghost" size="icon" onClick={copyCoupon}>
                <Copy className="h-4 w-4 text-amber-300" />
              </Button>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            <BadgePercent className="mr-2 h-4 w-4" />
            ¡Genial, gracias!
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
};
const Home = () => {
  const location = useLocation();
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  useEffect(() => {
    const hash = location.hash;
    if (hash.includes('type=signup')) {
      const welcomeShown = sessionStorage.getItem('welcomePopupShown');
      if (!welcomeShown) {
        setShowWelcomePopup(true);
        sessionStorage.setItem('welcomePopupShown', 'true');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [location]);
  const logoUrl = 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1376a1dc-c051-4229-8281-e847b8e98dae/679ab33053f5b8d0d4f73e2d796f0a32.png';
  const features = [{
    icon: Users,
    title: "Comunidad Apasionada",
    description: "Conecta con otros amantes del vino, comparte tus descubrimientos y participa en debates.",
    color: 'from-red-500 to-rose-600',
    path: '/comunidad'
  }, {
    icon: ShoppingBag,
    title: "Tienda Exclusiva",
    description: "Accede a una selección curada de vinos, merchandising y accesorios únicos del club.",
    color: 'from-purple-500 to-indigo-600',
    path: '/tienda'
  }, {
    icon: Calendar,
    title: "Eventos y Catas",
    description: "Participa en catas virtuales y presenciales, talleres y encuentros exclusivos para miembros.",
    color: 'from-amber-500 to-yellow-600',
    path: '/eventos'
  }];
  const communityArticles = [{
    name: "Vinos selectos",
    description: "Descubre nuestra colección de vinos de alta calidad",
    icon: Wine,
    image: 'A curated selection of fine wine bottles'
  }, {
    name: "Arte y decoración",
    description: "Piezas únicas para decorar tus espacios con la cultura del vino",
    icon: Paintbrush,
    image: 'Artistic decorations with a wine theme'
  }, {
    name: "Merchandising",
    description: "Lleva tu pasión por el vino con nuestra línea de productos",
    icon: Shirt,
    image: 'Stylish Vako Club branded merchandise'
  }, {
    name: "Accesorios",
    description: "Las mejores herramientas para disfrutar al máximo de tus vinos",
    icon: GlassWater,
    image: 'Elegant wine accessories and tools'
  }];
  const stats = [{
    number: '500+',
    label: "Vinos Catados",
    icon: Wine
  }, {
    number: '10K+',
    label: "Miembros Activos",
    icon: Users
  }, {
    number: '50+',
    label: "Expertos Colaboradores",
    icon: Award
  }, {
    number: '4.9',
    label: "Rating Promedio",
    icon: Star
  }];
  return <>
      <Helmet>
        <title>Vako Club - Tu Comunidad de Vinos</title>
        <meta name="description" content="Bienvenido a Vako Club, un espacio para amantes del vino. Explora nuestra tienda, eventos y únete a una comunidad apasionada." />
      </Helmet>

      <WelcomePopup isOpen={showWelcomePopup} onOpenChange={setShowWelcomePopup} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 wine-pattern opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="space-y-8">
            <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200
          }} className="flex justify-center">
              <img src={logoUrl} alt="Vako Club Logo" className="h-48 w-auto" />
            </motion.div>

            <h1 className="font-playfair text-5xl md:text-7xl font-bold wine-text-gradient leading-tight" dangerouslySetInnerHTML={{
            __html: "Bienvenido a<br />Vako Club"
          }}></h1>

            <p className="text-xl md:text-2xl text-amber-100/80 max-w-3xl mx-auto leading-relaxed">
              Donde cada copa cuenta una historia. Descubre, aprende y comparte tu pasión por el vino.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/guia">
                <Button variant="outline" className="px-8 py-4 text-lg">
                  <Compass className="mr-2 h-5 w-5" />
                  Explorar Guía
                </Button>
              </Link>
              
              <Link to="/noticias">
                <Button variant="default" className="px-8 py-4 text-lg">
                  <Newspaper className="mr-2 h-5 w-5" />
                  Ver Noticias
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div animate={{
        y: [0, -20, 0],
        rotate: [0, 5, 0]
      }} transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }} className="absolute top-20 left-10 opacity-10">
          <Grape className="h-24 w-24 text-amber-300" />
        </motion.div>

        <motion.div animate={{
        y: [0, 20, 0],
        rotate: [0, -5, 0]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }} className="absolute bottom-20 right-10 opacity-10">
          <Wine className="h-32 w-32 text-red-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold wine-text-gradient mb-6">
              Una Experiencia Única
            </h2>
            <p className="text-xl text-amber-100/70 max-w-3xl mx-auto">
              Más que un club, somos un punto de encuentro para explorar el universo del vino.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return <Link to={feature.path} key={index}>
                  <motion.div initial={{
                opacity: 0,
                y: 50
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: index * 0.2
              }} whileHover={{
                y: -10
              }} className="wine-card rounded-2xl p-8 text-center wine-hover cursor-pointer h-full">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.color} mb-6`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-playfair text-2xl font-semibold text-amber-200 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-amber-100/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                </Link>;
          })}
          </div>
        </div>
      </section>

      {/* Community Articles Section */}
      <section className="py-20 wine-glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold wine-text-gradient mb-6">
              Artículos para la comunidad
            </h2>
            <p className="text-xl text-amber-100/70 max-w-3xl mx-auto">
              Descubre nuestra selección de productos pensados para la comunidad
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityArticles.map((article, index) => {
            const Icon = article.icon;
            return <Link to="/tienda" key={index}>
                <motion.div initial={{
                opacity: 0,
                scale: 0.9
              }} whileInView={{
                opacity: 1,
                scale: 1
              }} transition={{
                duration: 0.6,
                delay: index * 0.1
              }} whileHover={{
                scale: 1.05
              }} className="wine-card rounded-xl overflow-hidden wine-hover cursor-pointer h-full">
                    <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-amber-900/20 to-red-900/20 p-8 flex flex-col items-center justify-center text-center">
                      <Icon className="h-16 w-16 text-amber-200 mb-4" />
                      <h3 className="font-playfair text-xl font-semibold text-amber-200 mb-2">
                        {article.name}
                      </h3>
                      <p className="text-amber-100/70">
                        {article.description}
                      </p>
                    </div>
                  </motion.div>
              </Link>;
          })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
            const Icon = stat.icon;
            return <motion.div key={index} initial={{
              opacity: 0,
              scale: 0.5
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} className="text-center">
                  <div className="inline-flex p-4 bg-amber-200/10 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-amber-200" />
                  </div>
                  <div className="font-playfair text-3xl md:text-4xl font-bold wine-text-gradient mb-2">
                    {stat.number}
                  </div>
                  <div className="text-amber-100/70 font-medium">
                    {stat.label}
                  </div>
                </motion.div>;
          })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 wine-glass-effect">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="space-y-8">
            <Heart className="h-16 w-16 text-red-400 mx-auto" />
            
            <h2 className="font-playfair text-4xl md:text-5xl font-bold wine-text-gradient">
              ¿Listo para descorchar tu pasión?
            </h2>
            
            <p className="text-xl text-amber-100/70 max-w-2xl mx-auto">Únete a Vako Club hoy y comienza tu viaje enológico. ¡Es gratis!</p>
            <p className="text-xl text-amber-100/70 max-w-2xl mx-auto">Te regalamos un 20% de descuento en merchandising y arte con el código: BONARDA20</p>
            
            <Link to="/suscripcion">
              <Button variant="outline" className="px-8 py-4 text-lg">
                <Users className="mr-2 h-5 w-5" />
                Unirme a la Comunidad
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>;
};
export default Home;