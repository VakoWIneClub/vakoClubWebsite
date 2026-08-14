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
// import DiscountPopup from "@/components/tienda/DiscountPopup";
import GuiasSection from "@/components/tienda/GuiasSection";
import CompraResultBanner from "@/components/tienda/CompraResultBanner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/components/ui/use-toast";

// const vinosSeleccionados = [
//   {
//     id: 1,
//     name: "Rioja Reserva",
//     bodega: "Bodega Rioja Alta (vía Amazon)",
//     categoria: "tintos",
//     precio: 41.80,
//     precioOriginal: 41.80,
//     rating: 4.3,
//     reviews: 124,
//     descripcion:
//       "Un Rioja excepcional. Garnacha, Tempranillo (Producto de terceros)",
//     alcohol: "14%",
//     region: "La Rioja, España",
//     maridaje: "Carnes rojas, quesos curados",
//     stock: 155,
//     destacado: true,
//     descuento: 0,
//     externalLink:
//       "https://amzn.to/3JecTWD",
//     image: "images/vina-ardanza-rioja-reserva.jpg"
//   },
//   {
//     id: 2,
//     name: "Pack Ramón Bilbao 3 Botellas",
//     bodega: "Ramón Bilbao (vía Amazon)",
//     categoria: "tintos",
//     precio: 44.99,
//     precioOriginal: 44.99,
//     rating: 4.1,
//     reviews: 45,
//     descripcion: "Ramón Bilbao Crianza, Ramón Bilbao Edición, Ramón Bilbao Reserva.",
//     alcohol: "14%",
//     region: "Rioja",
//     maridaje: "Carnes",
//     stock: null,
//     destacado: true,
//     descuento: null,
//     externalLink:
//       "https://amzn.to/3V5vQND",
//     image: "images/81W4aW0HRXS._AC_SX679_.jpg"
//   },
//   {
//     id: 3,
//     name: "Martín Códax Lías albariño ",
//     bodega: "Martín Códax (vía Amazon)",
//     categoria: "blancos",
//     precio: 22,
//     precioOriginal: 26,
//     rating: 4.3,
//     reviews: 16,
//     descripcion: "Elegancia y tradición en cada burbuja, método tradicional.",
//     alcohol: "13%",
//     region: "D.O. Rías Baixas",
//     maridaje: "Mariscos, Pescado",
//     stock: 31,
//     destacado: true,
//     descuento: null,
//     externalLink:
//       "https://amzn.to/46VJgmO",
//     image: "images/images(3).jpg"
//   },
// ];
const arteYDeco = [
  {
    id: 7,
    name: 'Poster enmarcado Syrah',
    bodega: "Arte exclusivo Vako Club",
    categoria: "deco",
    precio: 72,
    precioOriginal: 90.09,
    rating: 4.9,
    reviews: 0,
    descripcion:
      "Syrah Vineyard Wall Art Frame, Vintage Grape Print, Home Decor",
    stock: 12,
    destacado: true,
    descuento: 20,
    externalLink:
      "https://www.etsy.com/us-es/listing/4350184583/syrah-vineyard-wall-art-frame-vintage",
    image: "images/il_fullxfull.7147611925_98b9.webp"
  },
  {
    id: 8,
    name: "Poster enmarcado Rhythm and Nature ",
    bodega: "Arte exclusivo Vako Club",
    categoria: "deco",
    precio: 62.55,
    precioOriginal: 77.98,
    rating: 4.7,
    reviews: 0,
    descripcion:
      "Poster Print, Wine Culture Art, Vibrant Home Decor Sign, Relaxing Wall Picture,",
    stock: 5,
    destacado: true,
    descuento: 20,
    externalLink:
      "https://www.etsy.com/us-es/listing/4350168876/poster-print-wine-culture-art-vibrant",
    image: "images/il_fullxfull.7147581583_do84.webp"
  },
  {
    id: 15,
    name: "Poster enmarcado Tempranillo",
    bodega: "Arte exclusivo Vako Club",
    categoria: "deco",
    precio: 72,
    precioOriginal: 90.09,
    rating: 4.7,
    reviews: 0,
    descripcion:
      "Vintage Tempranillo Wine Poster with Wooden Frame",
    stock: 17,
    destacado: true,
    descuento: 20,
    externalLink:
      "https://www.etsy.com/us-es/listing/4350155067/vintage-tempranillo-wine-poster-with",
    image: "images/il_fullxfull.7147487421_reas.webp"
  },
];
const merchandising = [
  {
    id: 9,
    name: 'Camiseta "Wine Lover" Vako Club',
    bodega: "Vako Style",
    categoria: "merchandising",
    precio: 48,
    precioOriginal: 60.04,
    rating: 4.8,
    reviews: 88,
    descripcion:
      "Camiseta de algodón orgánico con un diseño minimalista y elegante.",
    stock: 40,
    destacado: true,
    descuento: 20,
    externalLink:
      "https://www.etsy.com/us-es/listing/4345359035/burgundy-vako-wine-club-unisex-tee-wine",
    image: "images/il_fullxfull.7122614057_ck74.webp"
  },
  {
    id: 10,
    name: "Gorra Vako Club",
    bodega: "Vako Club",
    categoria: "merchandising",
    precio: 69.55,
    precioOriginal: 86.94,
    rating: 4.7,
    reviews: 0,
    descripcion:
      "Gorra exclusiva Vako Wine Club",
    stock: 50,
    destacado: true,
    descuento: 20,
    externalLink:
      "https://www.etsy.com/us-es/listing/4345350607/embroidered-organic-baseball-cap-for",
    image: "images/il_fullxfull.7122567645_bf9x.webp"
  },
  {
    id: 14,
    name: "Sudadera Vako Wine",
    bodega: "Vako Club",
    categoria: "merchandising",
    precio: 51.22,
    precioOriginal: 64.75,
    rating: 4.7,
    reviews: 110,
    descripcion:
      "Sudadera exclusiva Vako Club printed",
    stock: 50,
    destacado: true,
    descuento: 20,
    externalLink:
      "https://www.etsy.com/us-es/listing/4345362145/organic-cotton-wine-club-crewneck",
    image: "images/il_fullxfull.7074695496_8890.webp"
  },
];
const accesorios = [
  {
    id: 11,
    name: "Carcasa de movil",
    bodega: "Vako Tools",
    categoria: "accesorios",
    precio: 35.22,
    precioOriginal: 43.89,
    rating: 4.9,
    reviews: 0,
    descripcion:
      "Vako Wine Club iPhone Case",
    stock: 25,
    destacado: true,
    descuento: 20,
    externalLink:
      "https://www.etsy.com/us-es/listing/4345360462/bio-polymer-wine-club-iphone-case",
    image: "images/il_fullxfull.7074704926_t4wx.webp"
  },
  {
    id: 12,
    name: "Decantador de Cristal",
    bodega: "Vako Glassware",
    categoria: "accesorios",
    precio: 42.99,
    precioOriginal: 42.99,
    rating: 4.4,
    reviews: 542,
    descripcion:
      "Decantador de cristal soplado a mano para oxigenar tus mejores vinos.",
    stock: 5,
    destacado: false,
    descuento: 0,
    externalLink:
      "https://amzn.to/4oBcfm3",
    image: "images/81lix1dscvL._AC_SX569_.jpg"
  },
  {
    id: 13,
    name: "Sacacorchos Premium Semecca®",
    bodega: "Semecca® (vía Amazon)",
    categoria: "accesorios",
    precio: 91.93,
    precioOriginal: 91.93,
    rating: 4.2,
    reviews: 49,
    descripcion:
      "Artesanía prémium: fabricado con acero inoxidable sólido y un mango de madera natural, este sacacorchos está diseñado para una durabilidad duradera",
    alcohol: "N/A",
    region: "Producto de terceros",
    maridaje: "Ideal para cualquier botella de vino",
    stock: 0,
    destacado: true,
    descuento: 0,
    externalLink:
      "https://amzn.to/45NnZuq",
    image: "images/71fIFF6k+FL._AC_SL1500_.jpg",
  },
];

const ViewEtsyButton = () => {
  return (
    <div className="mt-8 text-center">
      <a
        href="https://www.etsy.com/shop/VakoWineClub"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outline" size="lg">
          <ExternalLink className="mr-2 h-5 w-5" />
          Ver Tienda Completa en Etsy
        </Button>
      </a>
    </div>
  );
};

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
    navigator.clipboard.writeText("BONARDA20");
    toast({
      title: "¡Cupón copiado!",
      description: "Usa BONARDA20 en la tienda de Etsy.",
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
          Descuento Exclusivo para Miembros
        </h2>
        <p className="mt-2 text-lg text-amber-100/80">
          Como miembro de Vako Club, disfruta de un 20% de descuento en todo nuestro merchandising y arte.
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
        <title>Tienda Exclusiva - Vako Club | Guías, Vinos, Arte y Accesorios</title>
        <meta
          name="description"
          content="Explora la tienda de Vako Club. Guías de vino en PDF, merchandising exclusivo, arte y accesorios para amantes del vino."
        />
      </Helmet>

      {/* <DiscountPopup isOpen={isPopupOpen} onOpenChange={setPopupOpen} /> */}

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
              Tienda
            </h1>

            <p className="text-xl md:text-2xl text-amber-100/90 max-w-3xl mx-auto">
              Una selección de productos que celebran la cultura del vino.
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
        {/* Showing only the Guías PDF section as requested */}
        <GuiasSection />
      </div>
    </>
  );
};
export default Tienda;