import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  ShoppingBag,
  Award,
  Truck,
  Shield,
  Wine,
  Paintbrush,
  Shirt,
  GlassWater,
  ExternalLink,
  BadgePercent,
  Copy,
} from "lucide-react";
import ProductGrid from "@/components/tienda/ProductGrid";
import TiendaFeatures from "@/components/tienda/TiendaFeatures";
import DiscountPopup from "@/components/tienda/DiscountPopup";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/components/ui/use-toast";
const vinosSeleccionados = [
  {
    id: 1,
    name: "Rioja Reserva 2018",
    bodega: "Bodegas Marqués",
    categoria: "tintos",
    precio: 45,
    precioOriginal: 55,
    rating: 4.8,
    reviews: 124,
    image: "Premium Rioja red wine bottle with elegant label",
    descripcion:
      "Un Rioja excepcional con 24 meses en barrica de roble francés.",
    alcohol: "14.5%",
    region: "La Rioja, España",
    maridaje: "Carnes rojas, quesos curados",
    stock: 15,
    destacado: true,
    descuento: 18,
  },
  {
    id: 2,
    name: "Albariño Premium 2022",
    bodega: "Viñedos del Atlántico",
    categoria: "blancos",
    precio: 28,
    precioOriginal: 32,
    rating: 4.6,
    reviews: 89,
    image: "Fresh Albariño white wine bottle from Galicia",
    descripcion: "Frescura atlántica en cada sorbo, perfecto para mariscos.",
    alcohol: "12.5%",
    region: "Rías Baixas, Galicia",
    maridaje: "Mariscos, pescados blancos",
    stock: 23,
    destacado: false,
    descuento: 12,
  },
  {
    id: 3,
    name: "Cava Brut Nature",
    bodega: "Cavas Tradicionales",
    categoria: "espumosos",
    precio: 22,
    precioOriginal: 26,
    rating: 4.7,
    reviews: 156,
    image: "Traditional Cava sparkling wine bottle with golden foil",
    descripcion: "Elegancia y tradición en cada burbuja, método tradicional.",
    alcohol: "11.5%",
    region: "Penedès, Cataluña",
    maridaje: "Aperitivos, celebraciones",
    stock: 31,
    destacado: true,
    descuento: 15,
  },
];
const arteYDeco = [
  {
    id: 7,
    name: 'Lámina "Viñedos Dorados"',
    bodega: "Arte Vako",
    categoria: "arte",
    precio: 75,
    precioOriginal: 90,
    rating: 4.9,
    reviews: 45,
    image: "Golden vineyards art print",
    descripcion:
      "Una hermosa lámina que captura la esencia de los viñedos al atardecer.",
    stock: 20,
    destacado: true,
    descuento: 17,
  },
  {
    id: 8,
    name: "Posavasos de Corcho",
    bodega: "Deco Club",
    categoria: "deco",
    precio: 15,
    precioOriginal: 20,
    rating: 4.7,
    reviews: 110,
    image: "Artisanal cork coasters with wine motifs",
    descripcion:
      "Set de 4 posavasos de corcho natural con diseños vitivinícolas.",
    stock: 50,
    destacado: false,
    descuento: 25,
  },
];
const merchandising = [
  {
    id: 9,
    name: 'Camiseta "Wine Lover"',
    bodega: "Vako Style",
    categoria: "merchandising",
    precio: 30,
    precioOriginal: 35,
    rating: 4.8,
    reviews: 88,
    image: 'Stylish "Wine Lover" t-shirt',
    descripcion:
      "Camiseta de algodón orgánico con un diseño minimalista y elegante.",
    stock: 40,
    destacado: true,
    descuento: 14,
  },
  {
    id: 10,
    name: "Gorra Sommelier",
    bodega: "Vako Style",
    categoria: "merchandising",
    precio: 25,
    precioOriginal: 30,
    rating: 4.6,
    reviews: 65,
    image: "Sommelier-style cap with embroidered logo",
    descripcion: "Gorra de alta calidad con el logo de Vako Club bordado.",
    stock: 35,
    destacado: false,
    descuento: 17,
  },
];
const accesorios = [
  {
    id: 11,
    name: "Sacacorchos Profesional",
    bodega: "Vako Tools",
    categoria: "accesorios",
    precio: 40,
    precioOriginal: 50,
    rating: 4.9,
    reviews: 150,
    image: "Professional corkscrew with wooden handle",
    descripcion:
      "Sacacorchos de dos tiempos con mango de madera y acero inoxidable.",
    stock: 25,
    destacado: true,
    descuento: 20,
  },
  {
    id: 12,
    name: "Decantador de Cristal",
    bodega: "Vako Glassware",
    categoria: "accesorios",
    precio: 60,
    precioOriginal: 75,
    rating: 4.8,
    reviews: 95,
    image: "Elegant crystal wine decanter",
    descripcion:
      "Decantador de cristal soplado a mano para oxigenar tus mejores vinos.",
    stock: 15,
    destacado: false,
    descuento: 20,
  },
  {
    id: 13,
    name: "Sacacorchos Premium Semecca®",
    bodega: "Semecca® (vía Amazon)",
    categoria: "accesorios",
    precio: 19.99,
    precioOriginal: 24.99,
    rating: 5.0,
    reviews: 25,
    image: "Elegant Semecca professional corkscrew with a natural wood handle",
    descripcion:
      "Sacacorchos profesional de doble palanca con mango de madera de roble natural y espiral de acero inoxidable. El regalo perfecto.",
    alcohol: "N/A",
    region: "Producto de terceros",
    maridaje: "Ideal para cualquier botella de vino",
    stock: 0,
    destacado: true,
    descuento: 20,
    externalLink:
      "https://www.amazon.es/Semecca%C2%AE-Sacacorchos-natural-abridor-perfecto/dp/B0D5BSP34N/",
  },
];
const ViewEtsyButton = () => (
  <div className="mt-8 text-center">
    <a
      href="https://www.etsy.com/shop/VakoWineClub"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button variant="outline" size="lg">
        <ExternalLink className="mr-2 h-5 w-5" />
        Ver Tienda Completa
      </Button>
    </a>
  </div>
);
const Section = ({ title, icon: Icon, products, showEtsyButton = false }) => (
  <div className="py-16">
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="text-center mb-12"
    >
      <div className="inline-flex items-center gap-4">
        <Icon className="h-10 w-10 text-amber-400" />
        <h2 className="font-playfair text-4xl font-bold text-amber-200">
          {title}
        </h2>
      </div>
    </motion.div>
    <ProductGrid products={products} />
    {showEtsyButton && <ViewEtsyButton />}
  </div>
);
const MemberCouponSection = () => {
  const { toast } = useToast();
  const copyCoupon = () => {
    navigator.clipboard.writeText("BONARDA20%");
    toast({
      title: "¡Copiado!",
      description: "Cupón copiado al portapapeles.",
    });
  };
  return (
    <div className="py-12 bg-stone-900/50 rounded-2xl my-16">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="max-w-4xl mx-auto px-4 text-center"
      >
        <BadgePercent className="h-12 w-12 mx-auto wine-text-gradient mb-4" />
        <h2 className="font-playfair text-3xl font-bold text-amber-200">
          Tu Beneficio Exclusivo
        </h2>
        <p className="mt-2 text-lg text-amber-100/80">
          Como miembro de Vako Club, tienes un cupón de descuento del 20% en
          todos los productos de nuestra tienda exclusiva.
        </p>
        <div className="mt-6 bg-stone-800/50 border border-amber-500/30 rounded-lg p-4 inline-flex items-center justify-center gap-4">
          <span className="font-mono text-2xl text-amber-300 tracking-widest">
            BONARDA20
          </span>
          <Button variant="ghost" size="icon" onClick={copyCoupon}>
            <Copy className="h-5 w-5 text-amber-300" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
const Tienda = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        const popupShown = sessionStorage.getItem("discountPopupShown");
        if (!popupShown) {
          setPopupOpen(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);
  return (
    <>
      <Helmet>
        <link
          rel="icon"
          href="/images/VakoLogo.png"
          type="image/png"
          sizes="32x32"
        />
        <title>Tienda Exclusiva - Vako Club | Vinos, Arte y Accesorios</title>
        <meta
          name="description"
          content="Explora la Tienda Exclusiva de Vako Club. Encuentra vinos de selección, arte, merchandising y accesorios únicos para amantes del vino."
        />
      </Helmet>

      <DiscountPopup isOpen={isPopupOpen} onOpenChange={setPopupOpen} />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 wine-pattern opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
              }}
              className="flex justify-center"
            >
              <div className="p-6 wine-gradient rounded-full wine-shadow">
                <ShoppingBag className="h-16 w-16 text-white" />
              </div>
            </motion.div>

            <h1 className="font-playfair text-5xl md:text-6xl font-bold wine-text-gradient">
              Tienda Exclusiva
            </h1>

            <p className="text-xl md:text-2xl text-amber-100/90 max-w-3xl mx-auto">
              Descubre artículos únicos de nuestra comunidad: desde vinos de
              selección hasta arte, merchandising y accesorios.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-amber-100/80">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-amber-400" />
                <span>Selección Premium</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-amber-400" />
                <span>Envío Seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-amber-400" />
                <span>Garantía de Calidad</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {user && <MemberCouponSection />}
        <Section
          title="Vinos Seleccionados"
          icon={Wine}
          products={vinosSeleccionados}
        />
        <div className="border-t border-amber-500/10"></div>
        <Section
          title="Arte y Deco"
          icon={Paintbrush}
          products={arteYDeco}
          showEtsyButton
        />
        <div className="border-t border-amber-500/10"></div>
        <Section
          title="Merchandising"
          icon={Shirt}
          products={merchandising}
          showEtsyButton
        />
        <div className="border-t border-amber-500/10"></div>
        <Section
          title="Accesorios"
          icon={GlassWater}
          products={accesorios}
          showEtsyButton
        />
      </div>

      {/* Features Section */}
      <TiendaFeatures />
    </>
  );
};
export default Tienda;
