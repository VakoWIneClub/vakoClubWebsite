import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Calendar, MapPin, Clock, Loader2, PlusCircle, Pencil, Globe, Map, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import DeleteEventDialog from '@/components/eventos/DeleteEventDialog';
import Reveal from '@/components/copa/Reveal';
import DOMPurify from 'dompurify';

// Plain-text snippet for the card preview — mirrors ArticleList.jsx's createSnippet. Replaces a
// hand-rolled `.replace(/<[^>]+>/g, '')` regex tag-stripper (the one spot in the codebase not
// using the real sanitizer despite dangerouslySetInnerHTML) that also crashed the whole Eventos
// grid if any single event's description was null/undefined.
const createSnippet = (htmlContent) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent || '', { ALLOWED_TAGS: ['p', 'br'] });
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = cleanHtml;
  return tempDiv.textContent || tempDiv.innerText || '';
};

const copaInput = 'h-10 w-full rounded-none border border-copa-gold bg-copa-cream px-3 py-2 text-sm text-copa-ink placeholder:text-copa-ink/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-copa-burgundy';
const copaLabel = 'block font-jost text-[10px] tracking-[0.14em] uppercase text-copa-ink/70 mb-1.5';

const EventCard = ({ event, index, isAdmin, onEventDeleted }) => {
  const isPast = new Date(event.event_date) < new Date();

  const handleAdminActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Reveal delay={Math.min(index * 0.06, 0.24)} className="relative group">
      <Link to={`/eventos/${event.slug}`} className="block h-full">
        <div className={`copa-card h-full flex flex-col overflow-hidden transition-transform duration-300 group-hover:-translate-y-1.5 ${isPast ? 'opacity-60' : ''}`}>
          <div className="relative h-56 overflow-hidden">
            <img
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={event.image_url || 'https://images.unsplash.com/photo-1691257790470-b5e4e80ca59f'}
            />
            {isPast && (
              <span className="absolute top-4 left-4 font-jost text-[10px] tracking-[0.1em] uppercase bg-copa-ink/80 text-copa-cream px-2.5 py-1">
                Finalizado
              </span>
            )}
          </div>
          <div className="p-6 flex-grow flex flex-col">
            <h3 className="font-cormorant" style={{ fontSize: 24 }}>{event.title}</h3>
            <p
              className="text-copa-ink/70 leading-relaxed mt-3 mb-4 line-clamp-3"
              style={{ fontSize: 15 }}
            >
              {createSnippet(event.description)}
            </p>
            <div className="mt-auto space-y-2 border-t border-copa-gold/30 pt-4 font-jost text-[10px] tracking-[0.1em] uppercase text-copa-ink/50">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-2 text-copa-gold" />
                <span>{format(new Date(event.event_date), "eeee, d 'de' MMMM, yyyy", { locale: es })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-2 text-copa-gold" />
                <span>{format(new Date(event.event_date), "HH:mm 'hrs'", { locale: es })}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-2 text-copa-gold" />
                <span>{`${event.location}, ${event.city}, ${event.country}`}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {isAdmin && (
        <div className="absolute top-4 right-4 flex items-center gap-2" onClick={handleAdminActionClick}>
          <Link to={`/eventos/editar/${event.slug}`} className="h-9 w-9 flex items-center justify-center bg-copa-ink/40 hover:bg-copa-ink/70 text-copa-cream transition-colors" aria-label="Editar evento">
            <Pencil className="h-4 w-4" />
          </Link>
          <DeleteEventDialog event={event} onDeleted={onEventDeleted} />
        </div>
      )}
    </Reveal>
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

  const displayedEvents = showPastEvents ? events : events.filter(e => new Date(e.event_date) >= new Date(new Date().setHours(0, 0, 0, 0)));

  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>Eventos de Vino - Vako Club</title>
        <meta name="description" content="Descubre y participa en eventos de vino. Catas, talleres y encuentros para amantes del vino en Vako Club." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20">
        <Reveal className="text-center mb-12">
          <div className="copa-eyebrow">Vako Club</div>
          <h1 className="font-cormorant font-light leading-[1.05] mt-4" style={{ fontSize: 'clamp(36px,5.5vw,56px)' }}>
            {showPastEvents ? 'Eventos Pasados' : 'Eventos Exclusivos'}
          </h1>
          <p className="mt-5 text-copa-ink/75 max-w-3xl mx-auto" style={{ fontSize: 18, lineHeight: 1.6 }}>
            Infórmate sobre catas, talleres y encuentros. Vive la cultura del vino de una forma única.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="border border-copa-gold bg-copa-creamDeep p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="country-filter" className={copaLabel}><Globe className="inline mr-1.5 h-3 w-3" />País</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger id="country-filter" className={copaInput}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-copa-gold bg-copa-cream text-copa-ink rounded-none">
                    <SelectItem value="Todos" className="focus:bg-copa-gold/20 focus:text-copa-ink">Todos los países</SelectItem>
                    {countries.map(c => <SelectItem key={c} value={c} className="focus:bg-copa-gold/20 focus:text-copa-ink">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="city-filter" className={copaLabel}><Map className="inline mr-1.5 h-3 w-3" />Ciudad</label>
                <Select value={selectedCity} onValueChange={setSelectedCity} disabled={selectedCountry === 'Todos'}>
                  <SelectTrigger id="city-filter" className={copaInput}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-copa-gold bg-copa-cream text-copa-ink rounded-none">
                    <SelectItem value="Todos" className="focus:bg-copa-gold/20 focus:text-copa-ink">Todas las ciudades</SelectItem>
                    {cities.map(c => <SelectItem key={c} value={c} className="focus:bg-copa-gold/20 focus:text-copa-ink">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-past"
                  checked={showPastEvents}
                  onCheckedChange={setShowPastEvents}
                  className="data-[state=checked]:bg-copa-burgundy data-[state=unchecked]:bg-copa-ink/20"
                />
                <label htmlFor="show-past" className="font-jost text-[10px] tracking-[0.14em] uppercase text-copa-ink/70 flex items-center cursor-pointer">
                  <History className="mr-1.5 h-3.5 w-3.5" />Mostrar pasados
                </label>
              </div>
            )}
            {isAdmin && (
              <div className="text-center md:text-right">
                <Link to="/eventos/crear" className="copa-btn-nav inline-flex items-center justify-center w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear Nuevo Evento
                </Link>
              </div>
            )}
          </div>
        </Reveal>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 text-copa-burgundy animate-spin" />
          </div>
        ) : displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} isAdmin={isAdmin} onEventDeleted={handleEventDeleted} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="h-14 w-14 mx-auto text-copa-gold/60 mb-4" />
            <h3 className="font-cormorant" style={{ fontSize: 26 }}>No hay eventos que coincidan con los filtros</h3>
            <p className="text-copa-ink/60 mt-2">Prueba a seleccionar otro país o ciudad.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Eventos;
