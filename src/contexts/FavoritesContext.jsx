import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favoriteWineryIds, setFavoriteWineryIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  // Ref, not state: guards against a rapid double-click firing two concurrent mutations for the
  // same winery before the first resolves (which could otherwise insert/delete duplicate rows,
  // or desync the UI from the DB) without needing a re-render to enforce it.
  const pendingIdsRef = useRef(new Set());

  const fetchFavorites = useCallback(async () => {
    if (!user?.id) {
      setFavoriteWineryIds(new Set());
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('favorite_wineries')
      .select('winery_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
    } else {
      setFavoriteWineryIds(new Set(data.map(fav => fav.winery_id)));
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (wineryId) => {
    if (!user) return;
    if (pendingIdsRef.current.has(wineryId)) return;
    pendingIdsRef.current.add(wineryId);

    const wasFavorite = favoriteWineryIds.has(wineryId);

    try {
      if (wasFavorite) {
        const { error } = await supabase
          .from('favorite_wineries')
          .delete()
          .match({ user_id: user.id, winery_id: wineryId });

        if (error) throw error;
        setFavoriteWineryIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(wineryId);
          return newSet;
        });
      } else {
        const { error } = await supabase
          .from('favorite_wineries')
          .insert({ user_id: user.id, winery_id: wineryId });

        if (error) throw error;
        setFavoriteWineryIds(prev => {
          const newSet = new Set(prev);
          newSet.add(wineryId);
          return newSet;
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: wasFavorite ? 'No se pudo quitar de favoritos' : 'No se pudo añadir a favoritos',
        description: error.message || 'Intenta de nuevo en unos minutos.',
      });
    } finally {
      pendingIdsRef.current.delete(wineryId);
    }
  };

  const isFavorite = (wineryId) => favoriteWineryIds.has(wineryId);

  return (
    <FavoritesContext.Provider value={{ favoriteWineryIds, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};
