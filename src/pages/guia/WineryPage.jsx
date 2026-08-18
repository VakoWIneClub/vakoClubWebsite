
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Loader2, MapPin, Pencil, Trash2, ChevronLeft, ChevronRight, ExternalLink, Heart, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import DeleteWineryDialog from '@/components/guia/DeleteWineryDialog';
import WineryMap from '@/components/guia/WineryMap';
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
      <div className="flex justify-center items-center min-h-screen bg-copa-cream">
        <Loader2 className="h-14 w-14 text-copa-burgundy animate-spin" />
      </div>
    );
  }

  if (!winery) {
    return (
      <div className="text-center py-20 bg-copa-cream min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
        <h2 className="font-cormorant" style={{ fontSize: 28 }}>Bodega no encontrada</h2>
        <Link to="/guia" className="copa-btn-secondary mt-6 inline-flex">
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
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>{`${winery.title} - Guía de Bodegas Vako Club`}</title>
        <meta name="description" content={winery.description.substring(0, 160)} />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <Link to="/guia" className="copa-btn-secondary inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la Guía
            </Link>
          </div>
          <div className="border border-copa-gold overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-t from-copa-ink/80 to-transparent" />
              {images.length > 1 && (
                <>
                  <button type="button" className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-copa-ink/40 hover:bg-copa-ink/70 text-copa-cream opacity-0 group-hover:opacity-100 transition-opacity" onClick={prevImage} aria-label="Imagen anterior">
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-copa-ink/40 hover:bg-copa-ink/70 text-copa-cream opacity-0 group-hover:opacity-100 transition-opacity" onClick={nextImage} aria-label="Imagen siguiente">
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              <div className="absolute bottom-6 left-6 right-6 text-copa-cream">
                <h1 className="font-cormorant font-light" style={{ fontSize: 'clamp(30px,4.5vw,44px)' }}>
                  {winery.title}
                </h1>
                <div className="flex items-center text-copa-cream/85 text-lg mt-3">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{winery.city}, {winery.country}</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-8 flex-wrap">
                <button type="button" onClick={() => toggleFavorite(winery.id)} className="copa-btn-secondary inline-flex items-center">
                  <Heart className={`mr-2 h-4 w-4 transition-all duration-300 ${isFavorite(winery.id) ? 'fill-current text-copa-burgundy' : ''}`} />
                  {isFavorite(winery.id) ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
                </button>
                {isAdmin && (
                  <>
                    <Link to={`/guia/editar/${winery.slug}`} className="copa-btn-nav inline-flex items-center">
                      <Pencil className="mr-2 h-4 w-4" /> Editar
                    </Link>
                    <DeleteWineryDialog
                      wineryId={winery.id}
                      wineryTitle={winery.title}
                      onDeleted={() => window.location.href = '/guia'}
                      trigger={
                        <button type="button" className="copa-btn-nav inline-flex items-center">
                          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </button>
                      }
                    />
                  </>
                )}
                {websiteUrl && (
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="copa-btn-secondary inline-flex items-center">
                    <ExternalLink className="mr-2 h-4 w-4" /> Visitar Web
                  </a>
                )}
              </div>

              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-cormorant prose-headings:font-normal prose-headings:text-copa-ink prose-headings:mb-4 prose-headings:mt-10
                  prose-p:text-copa-ink/80 prose-p:leading-relaxed
                  prose-a:text-copa-burgundy prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-copa-ink prose-strong:font-semibold
                  prose-blockquote:border-l-copa-gold prose-blockquote:text-copa-ink/60 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-ul:list-disc prose-ul:pl-6 prose-li:text-copa-ink/80 prose-li:my-2
                  prose-ol:list-decimal prose-ol:pl-6
                  prose-img:rounded-none prose-img:shadow-md prose-img:shadow-copa-ink/20 prose-img:mx-auto prose-img:my-8"
                style={{ fontFamily: "'EB Garamond', serif" }}
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />

              {winery.latitude && winery.longitude && (
                <div className="mt-10">
                  <h2 className="font-cormorant font-light" style={{ fontSize: 28 }}>Ubicación</h2>
                  <div className="mt-4">
                    <WineryMap lat={winery.latitude} lon={winery.longitude} title={winery.title} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WineryPage;
