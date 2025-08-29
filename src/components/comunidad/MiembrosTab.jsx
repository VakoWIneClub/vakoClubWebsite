import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck, Loader2, Tag, Award, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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
  'Novato': { color: 'text-green-400', bgColor: 'bg-green-500/10' },
  'Aficionado': { color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  'Experto': { color: 'text-violet-400', bgColor: 'bg-violet-500/10' }
};

const MemberCard = ({ member, currentUser, onFollowToggle }) => {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(member.is_followed_by_current_user);
  const [followersCount, setFollowersCount] = useState(member.followers_count);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(false);
  };

  const levelData = levelInfo[member.level] || levelInfo['Novato'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="wine-card rounded-2xl p-6 text-center flex flex-col items-center"
    >
      <Avatar className="h-24 w-24 mb-4 border-4 border-amber-400/50">
        <AvatarImage src={member.avatar_url} alt={member.name} />
        <AvatarFallback className="text-3xl bg-amber-800 text-amber-200">{getInitials(member.name)}</AvatarFallback>
      </Avatar>
      <h4 className="text-xl font-bold text-amber-200">{member.name || 'Miembro de Vako'}</h4>
      <p className="text-amber-100/70 capitalize text-sm">{member.profile || 'Entusiasta del Vino'}</p>
      
      <div className={`mt-2 flex items-center gap-2 ${levelData.bgColor} ${levelData.color} px-3 py-1 rounded-full text-xs font-semibold`}>
        <Award className="h-4 w-4" />
        <span>{member.level}</span>
      </div>

      {member.interest_topic && (
        <div className="mt-2 flex items-center gap-1 bg-amber-500/10 text-amber-300 px-2 py-1 rounded-full text-xs">
          <Tag className="h-3 w-3" />
          <span>{member.interest_topic}</span>
        </div>
      )}
      
      <p className="text-amber-100/60 text-sm mt-3 flex-grow min-h-[40px]">{member.bio || 'Descubriendo el mundo del vino.'}</p>
      
      <div className="flex items-center justify-center gap-2 text-amber-100/60 text-sm mt-3">
        <Users className="h-4 w-4" />
        <span>{followersCount} seguidores</span>
      </div>

      {currentUser?.id !== member.id && (
        <Button onClick={handleFollow} className="mt-4 w-full" variant={isFollowing ? "secondary" : "outline"} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />)}
          {isFollowing ? 'Siguiendo' : 'Seguir'}
        </Button>
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

  const fetchMembers = useCallback(async (search) => {
    setLoading(true);
    
    let query;
    const params = { search_term: search };
    if (user) {
      params.current_user_id = user.id;
    }
    
    query = supabase.rpc('get_profiles_with_follow_status', params);

    const { data, error } = await query;

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
      <div className="mb-8 max-w-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50" />
          <Input
            type="text"
            placeholder="Buscar miembros por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-16">
          <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map(member => (
            <MemberCard key={member.id} member={member} currentUser={user} onFollowToggle={handleFollowToggle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MiembrosTab;