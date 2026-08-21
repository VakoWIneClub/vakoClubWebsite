import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { User, Mail, Send, Briefcase, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ContactForm = () => {
  const form = useRef();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const EMAILJS_SERVICE_ID = 'service_u1dbejb';
  const EMAILJS_TEMPLATE_ID = 'template_d3yel4f';
  const EMAILJS_PUBLIC_KEY = 'G7BJcfLPx0PBVWBOT';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAsuntoChange = (value) => {
    setFormData(prev => ({
      ...prev,
      asunto: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        toast({
            title: "Configuración requerida",
            description: "El formulario de contacto aún no está configurado. Por favor, proporciona tus credenciales de EmailJS.",
            variant: "destructive"
        });
        return;
    }

    if (!formData.nombre || !formData.email || !formData.mensaje) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form.current, EMAILJS_PUBLIC_KEY)
      .then(() => {
          toast({
            title: "¡Mensaje Enviado!",
            description: "Gracias por contactarnos. Te responderemos pronto.",
          });
          setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
      }, () => {
          toast({
            title: "Error al enviar",
            description: "Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.",
            variant: "destructive"
          });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold wine-text-gradient mb-4">
          Envíanos un Mensaje
        </h2>
        <p className="text-amber-100/80 text-lg">
          Completa el formulario y nos pondremos en contacto contigo lo antes posible.
        </p>
      </div>

      <form ref={form} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-amber-200 font-medium mb-2">
              Nombre *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400" />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-amber-500/30 rounded-lg text-amber-100 placeholder-amber-100/50 focus:outline-none focus:border-amber-400 transition-colors duration-300"
                placeholder="Tu nombre completo"
              />
            </div>
          </div>

          <div>
            <label className="block text-amber-200 font-medium mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-amber-500/30 rounded-lg text-amber-100 placeholder-amber-100/50 focus:outline-none focus:border-amber-400 transition-colors duration-300"
                placeholder="tu@email.com"
              />
            </div>
          </div>
        </div>

        <div>
            <label className="block text-amber-200 font-medium mb-2">
              Asunto
            </label>
            <div className="relative">
              <input type="hidden" name="asunto" value={formData.asunto} />
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400 z-10" />
              <Select onValueChange={handleAsuntoChange} value={formData.asunto}>
                <SelectTrigger className="w-full pl-10 pr-4 py-3 bg-white/10 border border-amber-500/30 rounded-lg text-amber-100 placeholder-amber-100/50 focus:outline-none focus:border-amber-400 transition-colors duration-300">
                  <SelectValue placeholder="Selecciona un asunto" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900/90 backdrop-blur-md border-amber-500/30 text-amber-100">
                  <SelectItem value="cursos">Consulta sobre Cursos</SelectItem>
                  <SelectItem value="eventos">Información de Eventos</SelectItem>
                  <SelectItem value="tienda">Consulta de Tienda</SelectItem>
                  <SelectItem value="colaboracion">Colaboración</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
        </div>
        
        <div>
          <label className="block text-amber-200 font-medium mb-2">
            Mensaje *
          </label>
          <textarea
            name="mensaje"
            value={formData.mensaje}
            onChange={handleInputChange}
            required
            rows={6}
            className="w-full px-4 py-3 bg-white/10 border border-amber-500/30 rounded-lg text-amber-100 placeholder-amber-100/50 focus:outline-none focus:border-amber-400 transition-colors duration-300 resize-none"
            placeholder="Cuéntanos en qué podemos ayudarte..."
          />
        </div>

        <motion.div
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 text-lg wine-gradient hover:opacity-90 transition-all duration-300 wine-shadow disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Enviar Mensaje
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default ContactForm;