import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn("Supabase signOut error, forcing client-side sign out:", error.message);
      }
    } catch (e) {
      console.error("An unexpected error occurred during signOut:", e);
    } finally {
      setUser(null);
      setSession(null);
      navigate('/');
    }
  }, [navigate]);

  const fetchUserProfile = useCallback(async (user) => {
    if (!user) return null;
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, points, level')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error.message);
      // Without role/points/level, every isAdmin check fails closed (safe), but that also means
      // an actual admin's controls silently vanish with zero explanation — tell them why.
      toast({
        title: 'No se pudo cargar tu perfil completo',
        description: 'Algunos datos (rol, puntos, nivel) no se cargaron. Recargá la página si algo no aparece como debería.',
        variant: 'destructive',
      });
      return { ...user };
    }
    
    return { 
      ...user, 
      role: profile?.role || 'user',
      points: profile?.points || 0,
      level: profile?.level || 'Novato',
    };
  }, []);
  
  const handleSession = useCallback(async (session) => {
    setSession(session);
    if (session?.user) {
      const userWithProfile = await fetchUserProfile(session.user);
      setUser(userWithProfile);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [fetchUserProfile]);

  const refreshUser = useCallback(async () => {
    if (session?.user) {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Failed to refresh session, signing out:", error.message);
        await signOut();
      } else if (data.session) {
        const userWithProfile = await fetchUserProfile(data.session.user);
        setUser(userWithProfile);
        setSession(data.session);
      } else {
        await signOut();
      }
    }
  }, [session, fetchUserProfile, signOut]);


  useEffect(() => {
    setLoading(true);
    
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting initial session:", error);
        setLoading(false);
        return;
      }
      if (!session) {
        setLoading(false);
        return;
      }
      await handleSession(session);
    }).catch((error) => {
      console.error("Unhandled error in getSession:", error);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          await handleSession(session);
        } else if (event === 'SIGNED_OUT') {
          handleSession(null);
        } else if (event === 'TOKEN_REFRESHED') {
          await handleSession(session);
        } else if (event === 'USER_UPDATED') {
          if (session?.user) {
            const userWithProfile = await fetchUserProfile(session.user);
            setUser(userWithProfile);
          }
        } else if (event === 'INITIAL_SESSION') {
          // This event is handled by getSession() above, but we keep it for clarity
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession, fetchUserProfile]);

  const signUp = useCallback(async (email, password, options) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    }
    return { data, error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }
    return { data, error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUser,
  }), [user, session, loading, signUp, signIn, signOut, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
