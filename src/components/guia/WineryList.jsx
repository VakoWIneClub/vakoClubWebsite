
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Compass, MapPin, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DeleteWineryDialog from '@/components/guia/DeleteWineryDialog';
import WineryScoreDisplay from '@/components/guia/WineryScoreDisplay';
import { useFavorites } from '@/contexts/FavoritesContext';
import DOMPurify from 'dompurify';

const WineryCard = ({ winery, index, isAdmin, onWineryDeleted }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleAdminActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(winery.id);
  };

  const hasImages = winery.image_urls && winery.image_urls.length > 0;
  const images = hasImages ? winery.image_urls : ['https://images.unsplash.com/photo-1598521628464-3435b348a21e?q=80&w=2070&auto=format&fit=crop'];

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const sanitizedDescription = DOMPurify.sanitize(winery.description);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group"
    >
      <Link to={`/guia/${winery.slug}`} className="block h-full">
        <div className="wine-card rounded-2xl wine-hover cursor-pointer h-full flex flex-col overflow-hidden transition-transform duration-300 group-hover:-translate-y-2">
          <div className="h-56 overflow-hidden relative">
            <AnimatePresence initial={false}>
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`${winery.title} - imagen ${currentImageIndex + 1}`}
                className="w-full h-full object-cover absolute inset-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            {images.length > 1 && (
              <>
                <Button size="icon" variant="ghost" className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity" onClick={prevImage}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity" onClick={nextImage}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
            {winery.score && (
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                <WineryScoreDisplay score={winery.score} />
              </div>
            )}
          </div>
          <div className="p-6 flex-grow flex flex-col">
            <h3 className="font-playfair text-2xl font-semibold text-amber-200 mb-2">
              {winery.title}
            </h3>
             <div className="flex items-center text-amber-100/70 text-sm mb-3">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{winery.city}, {winery.country}</span>
            </div>
            <div 
              className="prose prose-sm prose-invert text-amber-100/80 leading-relaxed mb-4 line-clamp-3 flex-grow prose-p:m-0"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          </div>
        </div>
      </Link>
      <div className="absolute top-4 left-4" onClick={handleFavoriteClick}>
        <Heart className={`h-6 w-6 text-amber-200 cursor-pointer transition-all duration-300 ${isFavorite(winery.id) ? 'fill-current text-red-800' : 'hover:text-red-800'}`} />
      </div>
      {isAdmin && (
        <div className="absolute top-4 right-16 flex items-center gap-2" onClick={handleAdminActionClick}>
           <Button asChild variant="ghost" size="icon" className="h-9 w-9 bg-black/30 hover:bg-black/60">
              <Link to={`/guia/editar/${winery.slug}`}>
                <Pencil className="h-4 w-4 text-amber-200" />
              </Link>
           </Button>
           <DeleteWineryDialog 
              wineryId={winery.id} 
              wineryTitle={winery.title}
              onDeleted={() => onWineryDeleted(winery.id)}
            />
        </div>
      )}
    </motion.div>
  );
};


const WineryList = ({ wineries, isAdmin, onWineryDeleted }) => {
  if (wineries.length === 0) {
    return (
      <div className="text-center py-16">
        <Compass className="h-16 w-16 mx-auto text-amber-400/50 mb-4" />
        <h3 className="font-playfair text-2xl text-amber-200">No se encontraron bodegas</h3>
        <p className="text-amber-100/70 mt-2">Prueba a cambiar los filtros o añade una nueva bodega si eres administrador.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {wineries.map((winery, index) => (
        <WineryCard 
          key={winery.id} 
          winery={winery} 
          index={index} 
          isAdmin={isAdmin}
          onWineryDeleted={onWineryDeleted}
        />
      ))}
    </div>
  );
};

export default WineryList;
