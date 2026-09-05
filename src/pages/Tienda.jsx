import React from "react";
import GuiasSection from "@/components/tienda/GuiasSection";
import CompraResultBanner from "@/components/tienda/CompraResultBanner";
import CartWidget from "@/components/tienda/CartWidget";
import Seo from "@/components/Seo";

const Tienda = () => {
  return (
    <div className="bg-copa-cream text-copa-ink" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Seo
        title="Tienda - Vako Club | Guías de Vino en PDF"
        description="Guías de vino en PDF de Vako Club: aprende a catar, servir y maridar sin esnobismo. Descarga inmediata."
        path="/tienda"
      />

      <CompraResultBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GuiasSection />
      </div>

      <CartWidget />
    </div>
  );
};
export default Tienda;
