import React from "react";
import { Image } from "lucide-react";
import GuiasSection from "@/components/tienda/GuiasSection";
import DecoracionSection from "@/components/tienda/DecoracionSection";
import CompraResultBanner from "@/components/tienda/CompraResultBanner";
import Seo from "@/components/Seo";

// Sin esto, quien entra a /tienda ve las guías y se va sin enterarse de que más abajo hay una
// vidriera de decoración — la sección vive fuera del viewport inicial. Pestaña fija al borde de
// la pantalla en vez de un link entre secciones, para que se vea sin tener que scrollear primero.
const DecoracionSideTab = () => (
  <button
    type="button"
    onClick={() => document.getElementById('decoracion')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
    className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 rounded-l-md border border-r-0 border-copa-gold bg-copa-burgundy text-copa-cream px-2.5 py-4 shadow-lg hover:bg-copa-ink transition-colors"
    aria-label="Ir a la sección de decoración"
  >
    <Image className="h-4 w-4" />
    <span
      className="font-jost text-[10px] tracking-[0.14em] uppercase"
      style={{ writingMode: 'vertical-rl' }}
    >
      Decoración
    </span>
  </button>
);

const Tienda = () => {
  return (
    <div className="bg-copa-cream text-copa-ink" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Seo
        title="Tienda - Vako Club | Guías de Vino en PDF"
        description="Guías de vino en PDF de Vako Club: aprende a catar, servir y maridar sin esnobismo. Descarga inmediata."
        path="/tienda"
      />

      <CompraResultBanner />
      <DecoracionSideTab />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GuiasSection />
        <DecoracionSection />
      </div>
    </div>
  );
};
export default Tienda;
