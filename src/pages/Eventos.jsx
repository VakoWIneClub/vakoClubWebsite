
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, MapPin, Ticket, Clock, Loader2, PlusCircle, Trash2, Pencil, Globe, Map, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch";

const EventCard = ({ event, index, isAdmin, onEventDeleted }) => {
  const { toast } = useToast();
  const isPast = new Date(event.event_date) < new Date();

  const handleAdminActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('events').delete().eq('id', event.id);
      if (error) throw error;
      toast({ title: "Evento eliminado", description: "El evento ha sido eliminado con éxito." });
      onEventDeleted(event.id);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar el evento." });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={`relative wine-card rounded-2xl overflow-hidden wine-hover flex flex-col group ${isPast ? 'opacity-60' : ''}`}
    >
      <Link to={`/eventos/${event.slug}`} className="block h-full flex flex-col">
        <div className="relative">
          <img alt={event.title} className="w-full h-56 object-cover" src={event.image_url || 'https://images.unsplash.com/photo-1691257790470-b5e4e80ca59f'} />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="font-playfair text-2xl font-bold">{event.title}</h3>
            {isPast && <span className="text-xs font-bold uppercase tracking-wider bg-red-800/80 text-white px-2 py-1 rounded">Finalizado</span>}
          </div>
        </div>
        <div className="p-6 space-y-4 flex-grow flex flex-col">
          <p className="text-amber-100/70 text-sm flex-grow line-clamp-3" dangerouslySetInnerHTML={{ __html: event.description.replace(/<[^>]+>/g, '') }}></p>
          <div className="space-y-3 text-amber-100/80 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-amber-400" />
              <span>{format(new Date(event.event_date), "eeee, d 'de' MMMM, yyyy", { locale: es })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>{format(new Date(event.event_date), "HH:mm 'hrs'", { locale: es })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span>{`${event.location}, ${event.city}, ${event.country}`}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            <Ticket className="mr-2 h-4 w-4" />
            Más Información
          </Button>
        </div>
      </Link>
      {isAdmin && (
        <div className="absolute top-4 right-4 flex items-center gap-2" onClick={handleAdminActionClick}>
          <Button asChild variant="ghost" size="icon" className="h-9 w-9 bg-black/30 hover:bg-black/60">
            <Link to={`/eventos/editar/${event.slug}`}>
              <Pencil className="h-4 w-4 text-amber-200" />
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 bg-black/30 hover:bg-black/60">
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente el evento "{event.title}".</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </motion.div>
  );
};

const Eventos = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Todos');
  const [selectedCity, setSelectedCity] = useState('Todos');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const isAdmin = user && user.role === 'admin';

  const fetchFilters = useCallback(async () => {
    let query = supabase.from('events').select('country, city').not('country', 'is', null);

    if (!showPastEvents) {
      const today = new Date().toISOString();
      query = query.gte('event_date', today);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching filters", error);
    } else {
      const uniqueCountries = [...new Set(data.map(c => c.country))].sort();
      setCountries(uniqueCountries);

      if (selectedCountry !== 'Todos') {
        const uniqueCities = [...new Set(data.filter(c => c.country === selectedCountry).map(c => c.city))].sort();
        setCities(uniqueCities);
      } else {
        setCities([]);
      }
    }
  }, [showPastEvents, selectedCountry]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: showPastEvents });

    if (selectedCountry !== 'Todos') {
      query = query.eq('country', selectedCountry);
    }
    if (selectedCity !== 'Todos') {
      query = query.eq('city', selectedCity);
    }
    
    if (!showPastEvents) {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('event_date', today);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data);
    }
    setLoading(false);
  }, [selectedCountry, selectedCity, showPastEvents]);

  useEffect(() => {
    fetchFilters();
    fetchEvents();
  }, [fetchFilters, fetchEvents]);

  useEffect(() => {
    setSelectedCity('Todos');
  }, [selectedCountry]);

  const handleEventDeleted = (deletedEventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== deletedEventId));
    fetchFilters();
  };
  
  const displayedEvents = showPastEvents ? events : events.filter(e => new Date(e.event_date) >= new Date(new Date().setHours(0,0,0,0)));

  return (
    <>
      <Helmet>
        <title>Eventos - Vako Club | Catas, Degustaciones y Más</title>
        <meta name="description" content="Participa en nuestros exclusivos eventos de vino. Desde catas y degustaciones hasta cenas de maridaje y festivales. ¡Reserva tu lugar!" />
      </Helmet>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 wine-pattern opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center space-y-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="flex justify-center">
              <div className="p-6 wine-gradient rounded-full wine-shadow">
                <Calendar className="h-16 w-16 text-white" />
              </div>
            </motion.div>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold wine-text-gradient">Calendario de Eventos</h1>
            <p className="text-xl md:text-2xl text-amber-100/90 max-w-3xl mx-auto">Descubre y participa en catas, cenas de maridaje y festivales de vino.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex justify-between items-center mb-12">
            <h2 className="font-playfair text-4xl font-bold wine-text-gradient text-center md:text-left mb-6 md:mb-0">
              {showPastEvents ? 'Historial de Eventos' : 'Próximos Eventos'}
            </h2>
            {isAdmin && (
              <Button asChild size="lg">
                <Link to="/eventos/crear">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Crear Nuevo Evento
                </Link>
              </Button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 wine-card rounded-lg">
              <div className="flex-1 space-y-2">
                <Label className="flex items-center text-amber-200"><Globe className="mr-2 h-4 w-4"/>País</Label>
                 <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos los países</SelectItem>
                      {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label className="flex items-center text-amber-200"><Map className="mr-2 h-4 w-4"/>Ciudad</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity} disabled={selectedCountry === 'Todos'}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todas las ciudades</SelectItem>
                       {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-2 pt-6">
                  <Switch id="show-past" checked={showPastEvents} onCheckedChange={setShowPastEvents} />
                  <Label htmlFor="show-past" className="flex items-center text-amber-200"><History className="mr-2 h-4 w-4"/>Mostrar pasados</Label>
                </div>
              )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 text-amber-300 animate-spin" /></div>
          ) : displayedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedEvents.map((event, index) => <EventCard key={event.id} event={event} index={index} isAdmin={isAdmin} onEventDeleted={handleEventDeleted} />)}
            </div>
          ) : (
            <p className="text-center text-amber-100/70 py-16">No hay eventos que coincidan con tu búsqueda. ¡Vuelve pronto!</p>
          )}
        </div>
      </section>
    </>
  );
};
export default Eventos;