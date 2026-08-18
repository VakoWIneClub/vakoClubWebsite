import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, Calendar, MapPin, Pencil, ArrowLeft, Globe, Map } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import DeleteEventDialog from '@/components/eventos/DeleteEventDialog';
import { useNavigate } from 'react-router-dom';

const EventoPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [slug]);

  const handleDeleted = () => {
    navigate('/eventos');
  };

  // FORBID_ATTR strips any legacy inline color spans (like the ones found baked into Noticias
  // articles from the old dark theme) that would otherwise override the copa prose-* classes.
  const sanitizedDescription = useMemo(() => {
    if (event?.description) {
      const cleanHtml = DOMPurify.sanitize(event.description, {
        USE_PROFILES: { html: true },
        FORBID_ATTR: ['style'],
      });
      return { __html: cleanHtml };
    }
    return { __html: '' };
  }, [event?.description]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] bg-copa-cream">
        <Loader2 className="h-14 w-14 text-copa-burgundy animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20 px-4 bg-copa-cream min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
        <h1 className="font-cormorant font-light" style={{ fontSize: 36 }}>Evento no encontrado</h1>
        <p className="text-copa-ink/70 mt-4">El evento que buscas no existe o ha sido eliminado.</p>
        <Link to="/eventos" className="copa-btn-primary mt-8 inline-flex">
          Volver a Eventos
        </Link>
      </div>
    );
  }

  const isAdmin = user && user.role === 'admin';

  return (
    <div className="bg-copa-cream text-copa-ink" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>{`${event.title} - Vako Club`}</title>
        <meta name="description" content={(event.description || '').replace(/<[^>]+>/g, '').substring(0, 160)} />
      </Helmet>

      <div className="pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <Link to="/eventos" className="copa-link-nav font-jost text-[11px] tracking-[0.14em] uppercase inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Eventos
              </Link>
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <Link to={`/eventos/editar/${event.slug}`} className="copa-btn-nav inline-flex items-center">
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar Evento
                  </Link>
                  <DeleteEventDialog
                    event={event}
                    onDeleted={handleDeleted}
                    trigger={<button type="button" className="copa-btn-secondary">Eliminar</button>}
                  />
                </div>
              )}
            </div>

            <article className="border border-copa-gold p-8 md:p-12">
              <h1 className="font-cormorant font-light leading-[1.05] text-center" style={{ fontSize: 'clamp(32px,5vw,48px)' }}>
                {event.title}
              </h1>

              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-copa-ink/60 mt-8 border-b border-t border-copa-gold/40 py-4 font-jost text-[11px] tracking-[0.12em] uppercase">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-copa-gold" />
                  <span className="capitalize">{format(new Date(event.event_date), "eeee, d 'de' MMMM, yyyy - HH:mm 'hrs'", { locale: es })}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-copa-gold" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Map className="h-4 w-4 mr-2 text-copa-gold" />
                  <span>{event.city}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-copa-gold" />
                  <span>{event.country}</span>
                </div>
              </div>

              {event.image_url && (
                <div className="my-8">
                  <img src={event.image_url} alt={event.title} className="w-full h-auto object-cover" />
                </div>
              )}

              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-cormorant prose-headings:font-normal prose-headings:text-copa-ink prose-headings:mb-4 prose-headings:mt-10
                  prose-p:text-copa-ink/80 prose-p:leading-relaxed
                  prose-a:text-copa-burgundy prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-copa-ink prose-strong:font-semibold
                  prose-blockquote:border-l-copa-gold prose-blockquote:text-copa-ink/60 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-ul:list-disc prose-ul:pl-6 prose-li:text-copa-ink/80 prose-li:my-2
                  prose-ol:list-decimal prose-ol:pl-6 prose-li:text-copa-ink/80 prose-li:my-2
                  prose-img:rounded-none prose-img:shadow-md prose-img:shadow-copa-ink/20 prose-img:mx-auto prose-img:my-8
                "
                style={{ fontFamily: "'EB Garamond', serif" }}
                dangerouslySetInnerHTML={sanitizedDescription}
              />
            </article>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventoPage;
