import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck, Loader2, Tag, Award, Users, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const getInitials = (name) => {
  if (!name) return 'V';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`;
  }
  return name.substring(0, 2);
};

const levelInfo = {
  'Novato': { color: 'text-copa-ink/70', border: 'border-copa-ink/30' },
  'Aficionado': { color: 'text-copa-gold', border: 'border-copa-gold' },
  'Experto': { color: 'text-copa-burgundy', border: 'border-copa-burgundy' }
};

const MemberCard = ({ member, currentUser, onFollowToggle }) => {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(member.is_followed_by_current_user);
  const [followersCount, setFollowersCount] = useState(member.followers_count);
  const [isLoading, setIsLoading] = useState(false);
  // Ref, not state: closes the race window before React commits the `disabled` prop, so a very
  // fast double-click can't fire two concurrent insert/delete mutations for the same follow pair.
  const isMutatingRef = useRef(false);

  const handleFollow = async () => {
    if (!currentUser) {
      toast({
        title: "Inicia sesión para seguir",
        description: "Debes iniciar sesión para interactuar con otros miembros.",
        variant: "destructive"
      });
      return;
    }

    if (currentUser.id === member.id) {
      toast({
        title: "Acción no permitida",
        description: "No puedes seguirte a ti mismo.",
      });
      return;
    }

    if (isMutatingRef.current) return;
    isMutatingRef.current = true;
    setIsLoading(true);

    if (isFollowing) {
      const { error } = await supabase
        .from('followers')
        .delete()
        .match({ follower_id: currentUser.id, following_id: member.id });

      if (error) {
        toast({ title: "Error", description: "No se pudo dejar de seguir al miembro.", variant: "destructive" });
      } else {
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        onFollowToggle(member.id, false, followersCount - 1);
      }
    } else {
      const { error } = await supabase
        .from('followers')
        .insert({ follower_id: currentUser.id, following_id: member.id });

      if (error) {
        toast({ title: "Error", description: "No se pudo seguir al miembro.", variant: "destructive" });
      } else {
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        onFollowToggle(member.id, true, followersCount + 1);
      }
    }
    isMutatingRef.current = false;
    setIsLoading(false);
  };

  const levelData = levelInfo[member.level] || levelInfo['Novato'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="copa-card p-6 text-center flex flex-col items-center"
    >
      <Avatar className="h-20 w-20 mb-4 border-2 border-copa-gold">
        <AvatarImage src={member.avatar_url} alt={member.name} />
        <AvatarFallback className="text-2xl bg-copa-burgundy text-copa-cream">{getInitials(member.name)}</AvatarFallback>
      </Avatar>
      <h4 className="font-cormorant" style={{ fontSize: 22 }}>{member.name || 'Miembro de Vako'}</h4>
      <p className="text-copa-ink/60 capitalize text-sm mt-0.5">{member.profile || 'Entusiasta del Vino'}</p>

      <div className={`mt-3 flex items-center gap-1.5 border ${levelData.border} ${levelData.color} px-3 py-1 font-jost text-[10px] tracking-[0.1em] uppercase`}>
        <Award className="h-3.5 w-3.5" />
        <span>{member.level}</span>
      </div>

      {member.interest_topic && (
        <div className="mt-2 flex items-center gap-1 font-jost text-[10px] tracking-[0.1em] uppercase text-copa-ink/60">
          <Tag className="h-3 w-3" />
          <span>{member.interest_topic}</span>
        </div>
      )}

      <p className="text-copa-ink/70 text-sm mt-3 flex-grow min-h-[40px]">{member.bio || 'Descubriendo el mundo del vino.'}</p>

      <div className="flex items-center justify-center gap-2 font-jost text-[10px] tracking-[0.1em] uppercase text-copa-ink/50 mt-3">
        <Users className="h-3.5 w-3.5" />
        <span>{followersCount} seguidores</span>
      </div>

      {currentUser?.id !== member.id && (
        <button
          type="button"
          onClick={handleFollow}
          disabled={isLoading}
          className={`mt-4 w-full inline-flex items-center justify-center ${isFollowing ? 'copa-btn-secondary' : 'copa-btn-nav'}`}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />)}
          {isFollowing ? 'Siguiendo' : 'Seguir'}
        </button>
      )}
    </motion.div>
  );
};

const MiembrosTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // The 300ms debounce below prevents most redundant calls, but not an older request resolving
  // after a newer one (e.g. clearing the search box mid-flight) — this id lets a response that's
  // no longer the latest be discarded instead of overwriting fresher results.
  const latestRequestIdRef = useRef(0);

  const fetchMembers = useCallback(async (search) => {
    const requestId = ++latestRequestIdRef.current;
    setLoading(true);

    const params = { search_term: search };
    if (user) {
      params.current_user_id = user.id;
    }

    const { data, error } = await supabase.rpc('get_profiles_with_follow_status', params);

    if (requestId !== latestRequestIdRef.current) return;

    if (error) {
      toast({
        title: "Error al cargar miembros",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMembers(data);
    }
    setLoading(false);
  }, [toast, user]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMembers(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchMembers, searchTerm]);

  const handleFollowToggle = (memberId, isFollowing, newFollowersCount) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === memberId
          ? { ...member, is_followed_by_current_user: isFollowing, followers_count: newFollowersCount }
          : member
      )
    );
  };

  return (
    <div>
      <div className="mb-8 max-w-lg mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-copa-ink/40" />
        <Input
          type="text"
          placeholder="Buscar miembros por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 rounded-none border-copa-gold bg-copa-cream text-copa-ink placeholder:text-copa-ink/40 focus-visible:ring-1 focus-visible:ring-copa-burgundy"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-16">
          <Loader2 className="h-10 w-10 animate-spin text-copa-burgundy" />
        </div>
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map(member => (
            <MemberCard key={member.id} member={member} currentUser={user} onFollowToggle={handleFollowToggle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-copa-gold/60" />
          <h3 className="font-cormorant mt-3" style={{ fontSize: 22 }}>No se encontraron miembros</h3>
          <p className="text-copa-ink/60 mt-1">Prueba con otro nombre de búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default MiembrosTab;
