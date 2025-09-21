import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Loader2, MapPin, Pencil, Trash2, ChevronLeft, ChevronRight, ExternalLink, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import DeleteWineryDialog from '@/components/guia/DeleteWineryDialog';
import WineryMap from '@/components/guia/WineryMap';
import WineryScoreDisplay from '@/components/guia/WineryScoreDisplay';
import DOMPurify from 'dompurify';

const WineryPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [winery, setWinery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchWinery = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wineries')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching winery:', error);
    } else {
      setWinery(data);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchWinery();
  }, [fetchWinery]);

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  const hasImages = winery?.image_urls && winery.image_urls.length > 0;
  const images = hasImages ? winery.image_urls : ['https://images.unsplash.com/photo-1598521628464-3435b348a21e?q=80&w=2070&auto=format&fit=crop'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen wine-pattern">
        <Loader2 className="h-16 w-16 text-amber-300 animate-spin" />
      </div>
    );
  }

  if (!winery) {
    return (
      <div className="text-center py-20 wine-pattern">
        <h2 className="text-2xl font-bold text-white">Bodega no encontrada</h2>
        <Link to="/guia" className="text-amber-400 hover:underline mt-4 inline-block">
          Volver a la guía
        </Link>
      </div>
    );
  }

  const sanitizedDescription = DOMPurify.sanitize(winery.description);

  // Ensure website_url has a protocol
  const websiteUrl = winery.website_url && !winery.website_url.startsWith('http://') && !winery.website_url.startsWith('https://')
    ? `https://${winery.website_url}`
    : winery.website_url;

  return (
    <>
      <Helmet>
        <title>{`${winery.title} - Guía de Bodegas Vako Club`}</title>
        <meta name="description" content={winery.description.substring(0, 160)} />
      </Helmet>

      <div className="min-h-screen wine-pattern pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <Button asChild variant="outline">
                <Link to="/guia">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la Guía
                </Link>
              </Button>
            </div>
            <div className="wine-card rounded-2xl overflow-hidden">
              <div className="relative h-96 group">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={`${winery.title} - imagen ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {images.length > 1 && (
                  <>
                    <Button size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity" onClick={prevImage}>
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity" onClick={nextImage}>
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h1 className="font-playfair text-4xl md:text-5xl font-bold text-amber-100">
                    {winery.title}
                  </h1>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-amber-100/80 text-lg">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{winery.city}, {winery.country}</span>
                    </div>
                    {winery.score && <WineryScoreDisplay score={winery.score} className="text-lg" />}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-6 flex-wrap">
                  <Button variant="outline" onClick={() => toggleFavorite(winery.id)}>
                    <Heart className={`mr-2 h-4 w-4 transition-all duration-300 ${isFavorite(winery.id) ? 'fill-current text-red-800' : ''}`} />
                    {isFavorite(winery.id) ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
                  </Button>
                  {isAdmin && (
                    <>
                      <Button asChild>
                        <Link to={`/guia/editar/${winery.slug}`}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </Link>
                      </Button>
                      <DeleteWineryDialog 
                        wineryId={winery.id} 
                        wineryTitle={winery.title}
                        onDeleted={() => window.location.href = '/guia'}
                        trigger={
                          <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </Button>
                        }
                      />
                    </>
                  )}
                  {websiteUrl && (
                    <Button asChild variant="outline">
                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> Visitar Web
                      </a>
                    </Button>
                  )}
                </div>
                
                <div 
                  className="prose prose-invert prose-lg max-w-none prose-p:text-amber-100/80 prose-headings:text-amber-200 prose-headings:font-playfair prose-a:text-amber-300 prose-strong:text-amber-100"
                  dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                />

                {winery.latitude && winery.longitude && (
                  <div className="mt-8">
                    <h2 className="font-playfair text-3xl font-bold text-amber-200 mb-4">Ubicación</h2>
                    <WineryMap lat={winery.latitude} lon={winery.longitude} title={winery.title} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default WineryPage;