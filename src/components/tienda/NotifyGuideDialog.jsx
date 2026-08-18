import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

// Misma integración de EmailJS ya usada en el formulario de contacto (src/components/contacto/ContactForm.jsx).
// Todavía no hay checkout ni ESP de email marketing conectado, así que cada guía captura el email
// en una lista de espera en vez de enlazar a un pago que no existe.
const EMAILJS_SERVICE_ID = 'service_2z4rljb';
const EMAILJS_TEMPLATE_ID = 'template_d3yel4f';
const EMAILJS_PUBLIC_KEY = 'G7BJcfLPx0PBVWBOT';

const NotifyGuideDialog = ({ open, onOpenChange, guideName }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: 'Email inválido',
        description: 'Escribe un email válido para avisarte.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          nombre: `Lista de espera — ${guideName}`,
          email,
          asunto: 'tienda',
          mensaje: `Quiere recibir aviso cuando "${guideName}" esté disponible para compra. Email de contacto: ${email}`,
        },
        EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        toast({
          title: '¡Listo!',
          description: `Te avisaremos en cuanto "${guideName}" esté disponible.`,
        });
        setEmail('');
        onOpenChange(false);
      })
      .catch(() => {
        toast({
          title: 'Error al enviar',
          description: 'Hubo un problema al guardar tu email. Inténtalo de nuevo.',
          variant: 'destructive',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-copa-cream border-copa-gold rounded-none text-copa-ink">
        <DialogHeader>
          <DialogTitle className="font-cormorant font-light text-copa-ink" style={{ fontSize: 26 }}>
            Todavía no está a la venta
          </DialogTitle>
          <DialogDescription className="text-copa-ink/70" style={{ fontFamily: "'EB Garamond', serif", fontSize: 16 }}>
            Estamos preparando el lanzamiento de "{guideName}". Deja tu email y serás de las
            primeras personas en enterarte en cuanto esté disponible para comprar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-copa-gold" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full pl-10 pr-4 py-3 bg-copa-creamDeep border border-copa-gold text-copa-ink placeholder-copa-ink/40 focus:outline-none focus:border-copa-burgundy transition-colors duration-300"
            />
          </div>
          <button type="submit" disabled={loading} className="copa-btn-primary w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? 'Enviando…' : 'Avísame cuando esté disponible'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NotifyGuideDialog;
