import React from "react";
import { Helmet } from "react-helmet";
import GuiasSection from "@/components/tienda/GuiasSection";
import CompraResultBanner from "@/components/tienda/CompraResultBanner";

const Tienda = () => {
  return (
    <div className="bg-copa-cream text-copa-ink" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <link
          rel="icon"
          href="/images/VakoLogo.png"
          type="image/png"
          sizes="32x32"
        />
        <title>Tienda - Vako Club | Guías de Vino en PDF</title>
        <meta
          name="description"
          content="Guías de vino en PDF de Vako Club: aprende a catar, servir y maridar sin esnobismo. Descarga inmediata."
        />
      </Helmet>

      <CompraResultBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GuiasSection />
      </div>
    </div>
  );
};
export default Tienda;
