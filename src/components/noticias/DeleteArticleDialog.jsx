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

const DeleteArticleDialog = ({ articleId, articleTitle, onDeleted, trigger }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error al eliminar',
        description: `No se pudo eliminar el artículo. ${error.message}`,
      });
    } else {
      toast({
        title: 'Artículo eliminado',
        description: `El artículo "${articleTitle}" ha sido eliminado.`,
      });
      onDeleted();
    }
    setIsLoading(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            aria-label="Eliminar artículo"
            className="h-9 w-9 flex items-center justify-center bg-copa-burgundy text-copa-cream hover:bg-copa-ink transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-cormorant font-light text-copa-ink" style={{ fontSize: 26 }}>
            ¿Estás seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-copa-ink/70" style={{ fontFamily: "'EB Garamond', serif", fontSize: 16 }}>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo <strong className="text-copa-burgundy">"{articleTitle}"</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Not asChild + a plain <button>: AlertDialogAction/Cancel always inject
              buttonVariants() via cn(buttonVariants(), className), and when asChild hands that
              to Radix's Slot, the merge is class-string concatenation (not twMerge) — Tailwind's
              utilities layer beats copa-btn-* component-layer classes regardless of order.
              Passing real utilities straight to className here runs through one real
              cn()/twMerge call, which dedupes correctly. */}
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

export default DeleteArticleDialog;
