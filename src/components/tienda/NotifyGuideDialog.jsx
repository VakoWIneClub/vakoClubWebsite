import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <DialogContent className="bg-stone-900 wine-glass-effect text-amber-100">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl wine-text-gradient">
            Todavía no está a la venta
          </DialogTitle>
          <DialogDescription className="text-amber-100/70">
            Estamos preparando el lanzamiento de "{guideName}". Deja tu email y serás de las
            primeras personas en enterarte en cuanto esté disponible para comprar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-amber-500/30 rounded-lg text-amber-100 placeholder-amber-100/50 focus:outline-none focus:border-amber-400 transition-colors duration-300"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-lg wine-gradient text-stone-900 font-semibold hover:opacity-90 transition-all duration-300 wine-shadow disabled:opacity-70"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            {loading ? 'Enviando...' : 'Avísame cuando esté disponible'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NotifyGuideDialog;
