import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { MessageCircle } from "lucide-react";
import ContactInfo from "@/components/contacto/ContactInfo";
import FaqSection from "@/components/contacto/FaqSection";

const Contacto = () => {
  return (
    <>
      <Helmet>
        <link
          rel="icon"
          href="/images/VakoLogo.png"
          type="image/png"
          sizes="32x32"
        />
        <title>Contacto - Vako Club | Ponte en Contacto con Nosotros</title>
        <meta
          name="description"
          content="Contacta con nuestro equipo de expertos en vinos. Estamos aquí para ayudarte con cualquier consulta sobre vinos, cursos o eventos."
        />
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
                <MessageCircle className="h-16 w-16 text-white" />
              </div>
            </motion.div>

            <h1 className="font-playfair text-5xl md:text-6xl font-bold wine-text-gradient">
              Contacta con Nosotros
            </h1>

            <p className="text-xl md:text-2xl text-amber-100/90 max-w-3xl mx-auto">
              Estamos aquí para ayudarte en tu viaje por el mundo del vino.
              ¡Hablemos!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <ContactInfo />

      {/* FAQ Section */}
      <FaqSection />
    </>
  );
};

export default Contacto;
