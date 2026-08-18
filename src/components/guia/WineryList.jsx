import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Compass, MapPin, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import DeleteWineryDialog from '@/components/guia/DeleteWineryDialog';
import { useFavorites } from '@/contexts/FavoritesContext';
import Reveal from '@/components/copa/Reveal';
import DOMPurify from 'dompurify';

const WineryCard = ({
  winery,
  index,
  isAdmin,
  onWineryDeleted
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {
    isFavorite,
    toggleFavorite
  } = useFavorites();
  const handleAdminActionClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleFavoriteClick = e => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(winery.id);
  };
  const hasImages = winery.image_urls && winery.image_urls.length > 0;
  const images = hasImages ? winery.image_urls : ['https://images.unsplash.com/photo-1598521628464-3435b348a21e?q=80&w=2070&auto=format&fit=crop'];
  const nextImage = e => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };
  const prevImage = e => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };
  const sanitizedDescription = DOMPurify.sanitize(winery.description);
  return (
    <Reveal delay={Math.min(index * 0.06, 0.24)} className="relative group">
      <Link to={`/guia/${winery.slug}`} className="block h-full">
        <div className="copa-card h-full flex flex-col overflow-hidden transition-transform duration-300 group-hover:-translate-y-1.5">
          <div className="h-56 overflow-hidden relative">
            <AnimatePresence initial={false}>
              <motion.img key={currentImageIndex} src={images[currentImageIndex]} alt={`${winery.title} - imagen ${currentImageIndex + 1}`} className="w-full h-full object-cover absolute inset-0" initial={{
              opacity: 0,
              x: 50
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -50
            }} transition={{
              duration: 0.3
            }} />
            </AnimatePresence>
            {images.length > 1 && <>
                <button type="button" className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-copa-ink/40 hover:bg-copa-ink/70 text-copa-cream opacity-0 group-hover:opacity-100 transition-opacity" onClick={prevImage} aria-label="Imagen anterior">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-copa-ink/40 hover:bg-copa-ink/70 text-copa-cream opacity-0 group-hover:opacity-100 transition-opacity" onClick={nextImage} aria-label="Imagen siguiente">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>}
          </div>
          <div className="p-6 flex-grow flex flex-col">
            <h3 className="font-cormorant" style={{ fontSize: 24 }}>
              {winery.title}
            </h3>
             <div className="flex items-center text-copa-ink/60 text-sm mt-2 mb-3">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{winery.city}, {winery.country}</span>
            </div>
            <div
              className="text-sm text-copa-ink/70 leading-relaxed mb-4 line-clamp-3 flex-grow"
              style={{ fontFamily: "'EB Garamond', serif" }}
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          </div>
        </div>
      </Link>
      <div className="absolute top-4 left-4" onClick={handleFavoriteClick}>
        <Heart className={`h-6 w-6 cursor-pointer transition-all duration-300 drop-shadow ${isFavorite(winery.id) ? 'fill-current text-copa-burgundy' : 'text-copa-cream hover:text-copa-burgundy'}`} />
      </div>
      {isAdmin && <div className="absolute top-4 right-4 flex items-center gap-2" onClick={handleAdminActionClick}>
           <Link to={`/guia/editar/${winery.slug}`} className="h-9 w-9 flex items-center justify-center bg-copa-ink/40 hover:bg-copa-ink/70 text-copa-cream transition-colors" aria-label="Editar bodega">
              <Pencil className="h-4 w-4" />
           </Link>
           <DeleteWineryDialog wineryId={winery.id} wineryTitle={winery.title} onDeleted={() => onWineryDeleted(winery.id)} />
        </div>}
    </Reveal>
  );
};
const WineryList = ({
  wineries,
  isAdmin,
  onWineryDeleted
}) => {
  if (wineries.length === 0) {
    return <div className="text-center py-16">
        <Compass className="h-14 w-14 mx-auto text-copa-gold/60 mb-4" />
        <h3 className="font-cormorant" style={{ fontSize: 26 }}>No se encontraron bodegas</h3>
        <p className="text-copa-ink/60 mt-2">Prueba a cambiar los filtros.</p>
      </div>;
  }
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {wineries.map((winery, index) => <WineryCard key={winery.id} winery={winery} index={index} isAdmin={isAdmin} onWineryDeleted={onWineryDeleted} />)}
    </div>;
};
export default WineryList;
