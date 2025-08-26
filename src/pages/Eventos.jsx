import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, MapPin, Ticket, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
const Eventos = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('events').select('*').order('event_date', {
        ascending: true
      });
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);
  const upcomingEvents = events.filter(event => new Date(event.event_date) >= new Date());
  const pastEvents = events.filter(event => new Date(event.event_date) < new Date());
  const EventCard = ({
    event,
    index
  }) => <motion.div initial={{
    opacity: 0,
    y: 50
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.6,
    delay: index * 0.1
  }} whileHover={{
    y: -10
  }} className="wine-card rounded-2xl overflow-hidden wine-hover flex flex-col">
      <div className="relative">
        <img alt={event.title} className="w-full h-56 object-cover" src="https://images.unsplash.com/photo-1691257790470-b5e4e80ca59f" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-playfair text-2xl font-bold">{event.title}</h3>
        </div>
      </div>
      <div className="p-6 space-y-4 flex-grow flex flex-col">
        <p className="text-amber-100/70 text-sm flex-grow">{event.description}</p>
        <div className="space-y-3 text-amber-100/80 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-amber-400" />
            <span>{format(new Date(event.event_date), "eeee, d 'de' MMMM, yyyy", {
              locale: es
            })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>{format(new Date(event.event_date), "HH:mm 'hrs'", {
              locale: es
            })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-amber-400" />
            <span>{event.location}</span>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-4">
          <Ticket className="mr-2 h-4 w-4" />
          Obtener Entradas
        </Button>
      </div>
    </motion.div>;
  return <div>
      <Helmet>
        <title>Eventos - Vako Club | Catas, Degustaciones y Más</title>
        <meta name="description" content="Participa en nuestros exclusivos eventos de vino. Desde catas y degustaciones hasta cenas de maridaje y festivales. ¡Reserva tu lugar!" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 wine-pattern opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center space-y-8">
            <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200
          }} className="flex justify-center">
              <div className="p-6 wine-gradient rounded-full wine-shadow">
                <Calendar className="h-16 w-16 text-white" />
              </div>
            </motion.div>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold wine-text-gradient">
              Calendario de Eventos
            </h1>
            <p className="text-xl md:text-2xl text-amber-100/90 max-w-3xl mx-auto">Descubre y participa en catas, cenas de maridaje y festivales de vino.</p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-4xl font-bold wine-text-gradient mb-12 text-center">Próximos Eventos</h2>
          {loading ? <div className="text-center text-amber-200">Cargando eventos...</div> : upcomingEvents.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}
            </div> : <p className="text-center text-amber-100/70">No hay eventos próximos en este momento. ¡Vuelve pronto!</p>}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && <section className="py-16 wine-glass-effect">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair text-4xl font-bold wine-text-gradient mb-12 text-center">Eventos Pasados</h2>
            <div className="space-y-4">
              {pastEvents.map(event => <motion.div key={event.id} initial={{
            opacity: 0,
            x: -50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5
          }} className="wine-card rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-amber-200">{event.title}</p>
                    <p className="text-sm text-amber-100/60">{format(new Date(event.event_date), "d 'de' MMMM, yyyy", {
                  locale: es
                })} - {event.location}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-amber-400" />
                </motion.div>)}
            </div>
          </div>
        </section>}
    </div>;
};
export default Eventos;