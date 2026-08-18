import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Loader2 } from 'lucide-react';

const storagePathFromUrl = (url) => {
  const marker = '/winery-images/';
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
};

const DeleteWineryDialog = ({ wineryId, wineryTitle, imageUrls, onDeleted, trigger }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from('wineries')
      .delete()
      .eq('id', wineryId);

    if (!error && imageUrls?.length > 0) {
      // Best-effort cleanup — the row is already gone either way, so a storage error here
      // shouldn't block the delete flow the admin is waiting on, just leak a file at worst.
      const paths = imageUrls.map(storagePathFromUrl).filter(Boolean);
      if (paths.length > 0) {
        const { error: removeError } = await supabase.storage.from('winery-images').remove(paths);
        if (removeError) console.error('Error removing winery images from storage:', removeError.message);
      }
    }

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error al eliminar',
        description: `No se pudo eliminar la bodega. ${error.message}`,
      });
    } else {
      toast({
        title: 'Bodega eliminada',
        description: `La bodega "${wineryTitle}" ha sido eliminada.`,
      });
      onDeleted();
    }
    setIsLoading(false);
  };

  return (
    <AlertDialog>
      {/* Callers like WineryPage pass their own full-size "Eliminar" button as trigger;
          WineryList's card overlay omits it and gets this compact icon-only default. */}
      <AlertDialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            aria-label="Eliminar bodega"
            className="h-9 w-9 flex items-center justify-center bg-copa-burgundy text-copa-cream hover:bg-copa-ink transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </AlertDialogTrigger>
      {/* AlertDialogContent's base classes bake in .wine-glass-effect (a plain, un-layered CSS
          rule that beats any className override on background/blur regardless of order) — style
          forces it off, same workaround used in Home.jsx's WelcomePopup. */}
      <AlertDialogContent
        className="bg-copa-cream border-copa-gold rounded-none text-copa-ink"
        style={{ backgroundColor: '#F7F1E6', backdropFilter: 'none' }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-cormorant font-light text-copa-ink" style={{ fontSize: 26 }}>
            ¿Estás seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-copa-ink/70" style={{ fontFamily: "'EB Garamond', serif", fontSize: 16 }}>
            Esta acción no se puede deshacer. Esto eliminará permanentemente la bodega <strong className="text-copa-burgundy">"{wineryTitle}"</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Not using asChild + a plain <button> here: AlertDialogAction/Cancel always inject
              buttonVariants()'s amber classes via cn(buttonVariants(), className), and when
              asChild hands that off to Radix's Slot, the merge is a plain class-string
              concatenation (not twMerge) — so Tailwind's utilities layer beats our
              copa-btn-* component-layer classes no matter what. Passing real utility classes
              straight to className here instead runs through one cn()/twMerge call inside the
              wrapper itself, which does dedupe correctly against buttonVariants(). */}
          <AlertDialogCancel
            disabled={isLoading}
            className="rounded-none h-auto bg-transparent hover:bg-transparent border-0 border-b border-copa-gold px-0 py-1.5 font-jost text-xs tracking-[0.14em] uppercase text-copa-ink hover:text-copa-burgundy hover:border-copa-burgundy"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="rounded-none h-auto bg-copa-burgundy hover:bg-copa-ink text-copa-cream px-8 py-[19px] font-jost text-xs font-medium tracking-[0.14em] uppercase"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                Eliminando…
              </>
            ) : (
              'Sí, eliminar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWineryDialog;