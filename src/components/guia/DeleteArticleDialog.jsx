
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
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Loader2 } from 'lucide-react';

const DeleteArticleDialog = ({ articleId, articleTitle, onDeleted }) => {
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
        <Button variant="destructive" size="icon" className="h-9 w-9 bg-red-800/70 hover:bg-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="wine-glass-effect">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-playfair text-2xl text-amber-200">
            ¿Estás seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-amber-100/70">
            Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo <strong className="text-amber-200">"{articleTitle}"</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isLoading}>Cancelar</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Sí, eliminar'
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteArticleDialog;
