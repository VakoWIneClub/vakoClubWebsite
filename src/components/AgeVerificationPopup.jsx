import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
        className="rounded-none border-copa-gold bg-copa-cream text-copa-ink sm:max-w-[420px] p-9"
        hideCloseButton
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <img src="/images/VakoLogo.png" alt="Vako Club" className="h-11 w-11 object-contain mx-auto" />
        <DialogHeader>
          <DialogTitle className="text-center font-cormorant font-light text-copa-ink" style={{ fontSize: 32, lineHeight: 1.15 }}>
            ¿Tenés 18 años o más?
          </DialogTitle>
          <DialogDescription className="text-center text-copa-ink/70" style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, lineHeight: 1.6 }}>
            Hablamos de vino, así que necesitamos preguntarlo una sola vez.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 justify-center pt-2">
          <Checkbox
            id="age-confirm"
            checked={isChecked}
            onCheckedChange={setIsChecked}
            className="border-copa-burgundy data-[state=checked]:bg-copa-burgundy data-[state=checked]:text-copa-cream"
          />
          <Label htmlFor="age-confirm" className="text-copa-ink/80 cursor-pointer font-normal" style={{ fontFamily: "'EB Garamond', serif", fontSize: 16 }}>
            Confirmo que soy mayor de 18 años.
          </Label>
        </div>
        <DialogFooter>
          <button
            type="button"
            onClick={handleAccept}
            disabled={!isChecked}
            className="copa-btn-primary w-full mt-2"
          >
            Continuar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgeVerificationPopup;
