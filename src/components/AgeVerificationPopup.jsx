import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Wine } from 'lucide-react';

const AgeVerificationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const ageVerified = localStorage.getItem('ageVerified');
    if (ageVerified !== 'true') {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    if (isChecked) {
      localStorage.setItem('ageVerified', 'true');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="wine-glass-effect sm:max-w-[425px] border-amber-400/30 text-amber-100"
        hideCloseButton={true}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-2xl font-playfair wine-text-gradient">
            <Wine className="mr-3 h-7 w-7 text-amber-300" />
            Verificación de Edad
          </DialogTitle>
          <DialogDescription className="text-center text-amber-100/80 pt-2">
            Debes tener la edad legal para consumir alcohol en tu país para poder ingresar a Vako Club.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-3 justify-center">
            <Checkbox 
              id="age-confirm" 
              checked={isChecked}
              onCheckedChange={setIsChecked}
            />
            <Label htmlFor="age-confirm" className="text-base text-amber-100/90 cursor-pointer">
              Sí, tengo la edad necesaria
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleAccept} 
            disabled={!isChecked}
            className="w-full"
            size="lg"
          >
            Aceptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgeVerificationPopup;