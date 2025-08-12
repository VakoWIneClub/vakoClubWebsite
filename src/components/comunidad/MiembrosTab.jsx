import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Loader2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from '@/lib/customSupabaseClient';

const getInitials = (name) => {
  if (!name) return 'V';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`;
  }
  return name.substring(0, 2);
};

const MemberCard = ({ member }) => {
  const { toast } = useToast();
  const handleFollow = () => {
    toast({
      title: "🚧 Funcionalidad en desarrollo",
      description: "Pronto podrás seguir a otros miembros.",
    });
  };

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
      
      {member.interest_topic && (
        <div className="mt-2 flex items-center gap-1 bg-amber-500/10 text-amber-300 px-2 py-1 rounded-full text-xs">
          <Tag className="h-3 w-3" />
          <span>{member.interest_topic}</span>
        </div>
      )}
      
      <p className="text-amber-100/60 text-sm mt-3 flex-grow min-h-[40px]">{member.bio || 'Descubriendo el mundo del vino.'}</p>
      
      <Button onClick={handleFollow} className="mt-4 w-full" variant="outline">
        <UserPlus className="mr-2 h-4 w-4" />
        Seguir
      </Button>
    </motion.div>
  );
};

const MiembrosTab = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false });

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
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16">
        <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {members.map(member => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
};

export default MiembrosTab;