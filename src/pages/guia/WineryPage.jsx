
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Calendar, User, ArrowLeft, Pencil, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import GrapeRating from '@/components/guia/GrapeRating';

const WineryMap = lazy(() => import('@/components/guia/WineryMap'));

const WineryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [winery, setWinery] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    const fetchWinery = async () => {
      setLoading(true);
      const { data: wineryData, error: wineryError } = await supabase
        .from('wineries')
        .select('*')
        .eq('slug', slug)
        .single();

      if (wineryError || !wineryData) {
        console.error('Error fetching winery:', wineryError);
        navigate('/guia');
        return;
      }
      
      setWinery(wineryData);

      if (wineryData.author_id) {
        const { data: authorData, error: authorError } = await supabase
          .from('profiles')
          .select('name, avatar_url')
          .eq('id', wineryData.author_id)
          .single();
        
        if (authorError) console.error('Error fetching author:', authorError);
        else setAuthor(authorData);
      }
      
      setLoading(false);
    };

    fetchWinery();
  }, [slug, navigate]);

  const nextImage = () => {
    if (winery && winery.image_urls) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % winery.image_urls.length);
    }
  };

  const prevImage = () => {
    if (winery && winery.image_urls) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + winery.image_urls.length) % winery.image_urls.length);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 text-amber-300 animate-spin" />
      </div>
    );
  }

  if (!winery) {
    return (
      <div className="text-center py-20">
        <h1 className="font-playfair text-4xl text-amber-200">Bodega no encontrada</h1>
        <p className="text-amber-100/70 mt-4">La bodega que buscas no existe o ha sido eliminada.</p>
        <Link to="/guia" className="mt-8 inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
          Volver a la Guía
        </Link>
      </div>
    );
  }

  const formattedDate = format(new Date(winery.created_at), "d 'de' MMMM, yyyy", { locale: es });
  const hasImages = winery.image_urls && winery.image_urls.length > 0;

  return (
    <>
      <Helmet>
        <title>{`${winery.title} - Guía de Bodegas`}</title>
        <meta name="description" content={winery.description?.substring(0, 160) || `Descubre más sobre ${winery.title} en Vako Club.`} />
      </Helmet>

      <div className="wine-pattern pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-between items-center mb-8">
              <Link to="/guia" className="inline-flex items-center text-amber-300 hover:text-amber-100 transition-colors group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Volver a la Guía
              </Link>
              {isAdmin && (
                <Button asChild>
                  <Link to={`/guia/editar/${winery.slug}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar Bodega
                  </Link>
                </Button>
              )}
            </div>

            <article className="wine-card rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <h1 className="font-playfair text-4xl md:text-5xl font-bold wine-text-gradient mb-4 md:mb-0">
                  {winery.title}
                </h1>
                {winery.score && (
                  <div className="flex-shrink-0 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-3">
                    <GrapeRating rating={winery.score} size={28} />
                    <span className="text-amber-100 text-xl font-bold">{Number(winery.score).toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-amber-100/70 mb-6 text-md">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{winery.city}, {winery.country}</span>
              </div>

              <div className="flex items-center space-x-6 text-amber-100/70 mb-8 border-b border-t border-amber-200/10 py-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-amber-300/80" />
                  <span>Añadido el {formattedDate}</span>
                </div>
                {author && (
                  <div className="flex items-center">
                    {author.avatar_url ? (
                      <img src={author.avatar_url} alt={author.name} className="h-6 w-6 rounded-full mr-2" />
                    ) : (
                      <User className="h-5 w-5 mr-2 text-amber-300/80" />
                    )}
                    <span>Por {author.name || 'Autor desconocido'}</span>
                  </div>
                )}
              </div>

              {hasImages && (
                <div className="my-8 rounded-lg overflow-hidden shadow-lg shadow-black/20 relative aspect-video">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={currentImageIndex}
                      src={winery.image_urls[currentImageIndex]}
                      alt={`${winery.title} - imagen ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ opacity: { duration: 0.5 } }}
                    />
                  </AnimatePresence>
                  {winery.image_urls.length > 1 && (
                    <>
                      <Button size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60" onClick={prevImage}>
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60" onClick={nextImage}>
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                        {winery.image_urls.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2 w-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-amber-200 w-4' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {winery.description && (
                <div className="prose prose-lg prose-invert max-w-none 
                  prose-p:text-amber-100/80 prose-p:leading-relaxed
                  prose-a:text-amber-300 hover:prose-a:text-amber-100 prose-a:transition-colors
                  prose-strong:text-amber-100 mt-8"
                  dangerouslySetInnerHTML={{ __html: winery.description.replace(/\n/g, '<br />') }}
                />
              )}
              
              {winery.latitude && winery.longitude && (
                <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                  <WineryMap lat={winery.latitude} lon={winery.longitude} title={winery.title} />
                </Suspense>
              )}

            </article>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default WineryPage;
