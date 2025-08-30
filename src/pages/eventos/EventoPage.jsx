
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, MapPin, Edit, ArrowLeft, Trash2, Globe, Map } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

const EventoPage = () => {
  const { slug } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (event.image_url) {
        const imagePath = event.image_url.split('/').slice(-2).join('/');
        await supabase.storage.from('article-images').remove([imagePath]);
      }
      
      const { error } = await supabase.from('events').delete().eq('id', event.id);

      if (error) throw error;
      
      toast({ title: "Evento eliminado", description: "El evento ha sido eliminado con éxito." });
      navigate('/eventos');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el evento. " + error.message,
      });
      setIsDeleting(false);
    }
  };

  const sanitizedDescription = useMemo(() => {
    if (event?.description) {
      const cleanHtml = DOMPurify.sanitize(event.description, {
        USE_PROFILES: { html: true },
      });
      return { __html: cleanHtml };
    }
    return { __html: '' };
  }, [event?.description]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 text-amber-300 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20 text-amber-100">
        <h1 className="text-3xl font-bold">Evento no encontrado</h1>
        <p className="mt-4">El evento que buscas no existe o ha sido eliminado.</p>
        <Button asChild className="mt-6">
          <Link to="/eventos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Eventos
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${event.title} - Vako Club`}</title>
        <meta name="description" content={event.description.substring(0, 160)} />
      </Helmet>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="mb-8 flex justify-between items-center">
            <Button asChild variant="ghost" className="text-amber-200">
              <Link to="/eventos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Eventos
              </Link>
            </Button>
            {profile?.role === 'admin' && (
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link to={`/eventos/editar/${event.slug}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el evento y su imagen asociada.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
        </div>
        
        <div className="wine-card rounded-2xl overflow-hidden">
          <img 
            class="w-full h-64 md:h-96 object-cover"
            alt={`Imagen del evento ${event.title}`}
           src="https://images.unsplash.com/photo-1681312913398-44b9771837e5" />

          <div className="p-8 md:p-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold wine-text-gradient mb-6 text-center">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-amber-200/90 mb-8 text-lg border-y border-amber-300/20 py-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-300"/>
                <span className='capitalize'>{format(new Date(event.event_date), 'EEEE, d \'de\' MMMM, yyyy - hh:mm a', { locale: es })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-amber-300"/>
                <span>{event.location}</span>
              </div>
               <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-amber-300"/>
                <span>{event.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-amber-300"/>
                <span>{event.country}</span>
              </div>
            </div>

            <article
              className="prose prose-invert prose-lg max-w-none text-amber-100/90"
              dangerouslySetInnerHTML={sanitizedDescription}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default EventoPage;
