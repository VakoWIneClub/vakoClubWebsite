import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BookOpen, Play, Clock, Star, Award, Users, ChevronRight, Wine, Grape, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Educacion = () => {
  const categories = [{
    id: 'todos',
    name: 'Todos los Cursos'
  }, {
    id: 'cata',
    name: 'Cata de Vinos'
  }, {
    id: 'maridaje',
    name: 'Maridajes'
  }, {
    id: 'historia',
    name: 'Historia del Vino'
  }, {
    id: 'produccion',
    name: 'Producción'
  }];
  const courses = [{
    id: 1,
    title: 'Fundamentos de la Cata de Vinos',
    description: 'Aprende las técnicas básicas para catar vinos como un profesional.',
    category: 'cata',
    level: 'Principiante',
    duration: '4 semanas',
    rating: 4.9,
    students: 1250,
    image: 'Professional wine tasting setup with multiple glasses',
    lessons: 12,
    price: 'Gratis'
  }, {
    id: 2,
    title: 'Maridajes Perfectos: Vino y Gastronomía',
    description: 'Descubre cómo combinar vinos con diferentes tipos de comida.',
    category: 'maridaje',
    level: 'Intermedio',
    duration: '6 semanas',
    rating: 4.8,
    students: 890,
    image: 'Elegant wine and food pairing presentation',
    lessons: 18,
    price: '€49'
  }, {
    id: 3,
    title: 'Historia y Tradición Vinícola',
    description: 'Un viaje a través de la historia del vino y sus tradiciones.',
    category: 'historia',
    level: 'Todos los niveles',
    duration: '3 semanas',
    rating: 4.7,
    students: 650,
    image: 'Ancient wine cellar with historical barrels',
    lessons: 9,
    price: '€29'
  }, {
    id: 4,
    title: 'Proceso de Elaboración del Vino',
    description: 'Conoce todo el proceso desde la uva hasta la botella.',
    category: 'produccion',
    level: 'Avanzado',
    duration: '8 semanas',
    rating: 4.9,
    students: 420,
    image: 'Modern winery production facility',
    lessons: 24,
    price: '€89'
  }, {
    id: 5,
    title: 'Cata Avanzada: Análisis Sensorial',
    description: 'Desarrolla tu paladar con técnicas avanzadas de análisis sensorial.',
    category: 'cata',
    level: 'Avanzado',
    duration: '5 semanas',
    rating: 4.8,
    students: 320,
    image: 'Professional sommelier conducting advanced tasting',
    lessons: 15,
    price: '€69'
  }, {
    id: 6,
    title: 'Maridajes con Quesos Artesanales',
    description: 'Especialízate en la combinación perfecta de vinos y quesos.',
    category: 'maridaje',
    level: 'Intermedio',
    duration: '4 semanas',
    rating: 4.6,
    students: 580,
    image: 'Artisanal cheese and wine pairing board',
    lessons: 12,
    price: '€39'
  }];

  return (
    <div className="relative">
      <Helmet>
        <title>Educación - Vinos Elegantes | Aprende sobre Vinos</title>
        <meta name="description" content="Descubre nuestros cursos de vinos: cata, maridajes, historia y producción. Aprende de expertos sommeliers y conviértete en un conocedor del vino." />
      </Helmet>
      
      {/* Overlay and "Coming Soon" message */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center justify-start pt-32 h-full bg-black/50 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center p-8 rounded-lg"
        >
          <Clock className="h-20 w-20 mx-auto wine-text-gradient mb-6" />
          <h2 className="font-playfair text-5xl md:text-6xl font-bold wine-text-gradient mb-4">
            Próximamente
          </h2>
          <p className="text-xl text-amber-100/80 max-w-lg mx-auto">
            Estamos preparando contenidos educativos excepcionales para ti. ¡Vuelve pronto!
          </p>
        </motion.div>
      </div>

      {/* Page content (will be blurred) */}
      <div className="pointer-events-none">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 wine-pattern opacity-20"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center space-y-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="flex justify-center">
                <div className="p-6 wine-gradient rounded-full wine-shadow">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
              </motion.div>

              <h1 className="font-playfair text-5xl md:text-6xl font-bold wine-text-gradient">
                Academia del Vino
              </h1>

              <p className="text-xl md:text-2xl text-amber-100/90 max-w-3xl mx-auto">
                Aprende de los mejores sommeliers y expertos en vino. Desde principiante hasta maestro catador.
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-amber-100/80">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  <span>Certificación</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-amber-400" />
                  <span>+5000 Estudiantes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-amber-400" />
                  <span>4.8/5 Valoración</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 wine-glass-effect">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(category => 
                <motion.button key={category.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`px-6 py-3 rounded-full font-medium transition-all duration-300 wine-card text-amber-200`}>
                  {category.name}
                </motion.button>
              )}
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => 
                <motion.div key={course.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} whileHover={{ y: -10 }} className="wine-card rounded-2xl overflow-hidden wine-hover">
                  <div className="relative">
                    <img  alt={course.title} className="w-full h-48 object-cover" src="https://images.unsplash.com/photo-1635251595512-dc52146d5ae8" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-amber-500 text-amber-900 rounded-full text-sm font-medium">
                        {course.level}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 wine-gradient text-white rounded-full text-sm font-bold">
                        {course.price}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="font-playfair text-xl font-semibold text-amber-200 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-amber-100/70 text-sm line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-amber-100/60">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Play className="h-4 w-4" />
                        <span>{course.lessons} lecciones</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-amber-400 fill-current" />
                          <span className="text-amber-200 font-medium">{course.rating}</span>
                        </div>
                        <span className="text-amber-100/60 text-sm">
                          ({course.students} estudiantes)
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-amber-400" />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Learning Path Section */}
        <section className="py-20 wine-glass-effect">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold wine-text-gradient mb-6">
                Tu Camino de Aprendizaje
              </h2>
              <p className="text-xl text-amber-100/80 max-w-3xl mx-auto">
                Sigue nuestro programa estructurado para convertirte en un experto en vinos.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{
                step: '01',
                title: 'Fundamentos',
                description: 'Aprende los conceptos básicos de la cata y tipos de vino.',
                icon: Grape,
                color: 'from-green-500 to-emerald-600'
              }, {
                step: '02',
                title: 'Técnicas Avanzadas',
                description: 'Desarrolla tu paladar y técnicas de análisis sensorial.',
                icon: Eye,
                color: 'from-blue-500 to-indigo-600'
              }, {
                step: '03',
                title: 'Maestría',
                description: 'Conviértete en sommelier y obtén tu certificación.',
                icon: Award,
                color: 'from-purple-500 to-pink-600'
              }].map((step, index) => {
                const Icon = step.icon;
                return <motion.div key={index} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }} className="relative">
                      <div className="wine-card rounded-2xl p-8 text-center h-full">
                        <div className="relative mb-6">
                          <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${step.color} mb-4`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 wine-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {step.step}
                          </div>
                        </div>
                        
                        <h3 className="font-playfair text-2xl font-semibold text-amber-200 mb-4">
                          {step.title}
                        </h3>
                        
                        <p className="text-amber-100/80 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      
                      {index < 2 && <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                          <ChevronRight className="h-8 w-8 text-amber-400" />
                        </div>}
                    </motion.div>;
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
              <Wine className="h-16 w-16 text-amber-400 mx-auto" />
              
              <h2 className="font-playfair text-4xl md:text-5xl font-bold wine-text-gradient">
                Comienza Tu Viaje Hoy
              </h2>
              
              <p className="text-xl text-amber-100/80 max-w-2xl mx-auto">
                Únete a miles de estudiantes que ya han transformado su pasión por el vino en conocimiento experto.
              </p>
              
              <Button className="px-8 py-4 text-lg wine-gradient hover:opacity-90 transition-all duration-300 wine-shadow">
                <Play className="mr-2 h-5 w-5" />
                Comenzar Ahora
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Educacion;