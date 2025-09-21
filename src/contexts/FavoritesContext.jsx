import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favoriteWineryIds, setFavoriteWineryIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

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

    const isFavorite = favoriteWineryIds.has(wineryId);
    
    if (isFavorite) {
      const { error } = await supabase
        .from('favorite_wineries')
        .delete()
        .match({ user_id: user.id, winery_id: wineryId });

      if (!error) {
        setFavoriteWineryIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(wineryId);
          return newSet;
        });
      }
    } else {
      const { error } = await supabase
        .from('favorite_wineries')
        .insert({ user_id: user.id, winery_id: wineryId });

      if (!error) {
        setFavoriteWineryIds(prev => {
          const newSet = new Set(prev);
          newSet.add(wineryId);
          return newSet;
        });
      }
    }
  };

  const isFavorite = (wineryId) => favoriteWineryIds.has(wineryId);

  return (
    <FavoritesContext.Provider value={{ favoriteWineryIds, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};