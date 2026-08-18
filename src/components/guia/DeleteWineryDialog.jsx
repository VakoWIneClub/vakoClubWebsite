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

const DeleteWineryDialog = ({ wineryId, wineryTitle, onDeleted, trigger }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from('wineries')
      .delete()
      .eq('id', wineryId);

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
      <AlertDialogContent className="bg-copa-cream border-copa-gold rounded-none text-copa-ink">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-cormorant font-light text-copa-ink" style={{ fontSize: 26 }}>
            ¿Estás seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-copa-ink/70" style={{ fontFamily: "'EB Garamond', serif", fontSize: 16 }}>
            Esta acción no se puede deshacer. Esto eliminará permanentemente la bodega <strong className="text-copa-burgundy">"{wineryTitle}"</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <button type="button" disabled={isLoading} className="copa-btn-secondary">Cancelar</button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button type="button" onClick={handleDelete} disabled={isLoading} className="copa-btn-primary">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Eliminando…
                </>
              ) : (
                'Sí, eliminar'
              )}
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWineryDialog;