import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Calendar, Clock, MapPin, ArrowLeft, Pencil, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const EventoPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        console.error('Error fetching event:', error);
        navigate('/404');
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 text-amber-300 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return null; // or a not found component
  }
  
  const formattedDate = format(new Date(event.event_date), "eeee, d 'de' MMMM, yyyy", { locale: es });
  const formattedTime = format(new Date(event.event_date), "HH:mm 'hrs'", { locale: es });

  return (
    <>
      <Helmet>
        <title>{`${event.title} - Eventos Vako Club`}</title>
        <meta name="description" content={event.description.substring(0, 160)} />
      </Helmet>

      <div className="wine-pattern pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-8">
              <Link to="/eventos" className="inline-flex items-center text-amber-300 hover:text-amber-100 transition-colors group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Volver a Eventos
              </Link>
              {isAdmin && (
                <Button asChild>
                  <Link to={`/eventos/editar/${event.slug}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar Evento
                  </Link>
                </Button>
              )}
            </div>

            <article className="wine-card rounded-2xl p-8 md:p-12">
              <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg shadow-black/20 aspect-video">
                  <img src={event.image_url || 'https://images.unsplash.com/photo-1691257790470-b5e4e80ca59f'} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                     <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white shadow-text">
                        {event.title}
                     </h1>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-amber-100/80 mb-8 border-b border-t border-amber-200/10 py-4">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 mr-3 text-amber-300/80" />
                  <div>
                    <p className="font-semibold">Fecha</p>
                    <p>{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 mr-3 text-amber-300/80" />
                   <div>
                    <p className="font-semibold">Hora</p>
                    <p>{formattedTime}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 mr-3 text-amber-300/80" />
                   <div>
                    <p className="font-semibold">Ubicación</p>
                    <p>{`${event.location}, ${event.city}, ${event.country}`}</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg prose-invert max-w-none prose-p:text-amber-100/80">
                <p>{event.description}</p>
              </div>

              <div className="mt-12 pt-8 border-t border-amber-200/10 text-center">
                <Button size="lg" onClick={() => toast({ title: "🚧 Funcionalidad no implementada", description: "¡Próximamente podrás obtener tus entradas!" })}>
                  <Ticket className="mr-2 h-5 w-5" />
                  Más Información
                </Button>
              </div>
            </article>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default EventoPage;
