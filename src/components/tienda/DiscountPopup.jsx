import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Percent, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const DiscountPopup = ({ isOpen, onOpenChange }) => {
  const { user } = useAuth();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Determine if the popup should be shown
    const popupShown = sessionStorage.getItem('discountPopupShown');
    if (isOpen && !user && !popupShown) {
      setShouldShow(true);
      sessionStorage.setItem('discountPopupShown', 'true');
    } else {
      setShouldShow(false);
    }
  }, [isOpen, user]);

  const handleClose = () => {
    setShouldShow(false);
    if (onOpenChange) {
        onOpenChange(false);
    }
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <AlertDialog open={shouldShow} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'mirror',
              }}
            >
              <Percent className="h-16 w-16 wine-text-gradient" />
            </motion.div>
          </div>
          <AlertDialogTitle className="text-center font-playfair text-2xl">
            ¡Obtén un 20% de Descuento!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Suscríbete a Vako Club y recibe un cupón de 20% de descuento para usar en productos seleccionados de nuestra tienda.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-3 pt-4">
          <Link to="/suscripcion" className="w-full">
            <Button className="w-full" onClick={handleClose}>
              Suscribirme Ahora
            </Button>
          </Link>
          <a href="https://www.etsy.com/shop/VakoWineClub" target="_blank" rel="noopener noreferrer" className="w-full">
            <Button variant="secondary" className="w-full bg-stone-700 hover:bg-stone-600 text-white">
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver Tienda Completa en Etsy
            </Button>
          </a>
          <AlertDialogCancel className="w-full" onClick={handleClose}>
            Cerrar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DiscountPopup;