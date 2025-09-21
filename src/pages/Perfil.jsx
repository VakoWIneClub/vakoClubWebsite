import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Briefcase, Camera, Save, Lock, FileText, Tag, Loader2, Award, Star, BarChart, Heart, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';
import WineryScoreDisplay from '@/components/guia/WineryScoreDisplay';

const levelInfo = {
  'Novato': {
    color: 'text-green-400',
    nextLevel: 'Aficionado',
    nextLevelPoints: 150,
    progressColor: 'bg-green-500'
  },
  'Aficionado': {
    color: 'text-blue-400',
    nextLevel: 'Experto',
    nextLevelPoints: 300,
    progressColor: 'bg-blue-500'
  },
  'Experto': {
    color: 'text-violet-400',
    nextLevel: null,
    nextLevelPoints: Infinity,
    progressColor: 'bg-violet-500'
  }
};

const FavoriteWineries = ({ userId }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('favorite_wineries')
        .select('wineries(*)')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching favorite wineries:', error);
      } else {
        setFavorites(data.map(fav => fav.wineries).filter(Boolean));
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-amber-300" /></div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-10 px-6 border-2 border-dashed border-amber-800/50 rounded-lg">
        <Compass className="mx-auto h-12 w-12 text-amber-100/40" />
        <h3 className="mt-4 text-lg font-medium text-amber-100">Aún no tienes bodegas favoritas</h3>
        <p className="mt-1 text-sm text-amber-100/60">Explora la guía y añade tus bodegas preferidas a tu colección.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/guia">Ir a la Guía</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map(winery => (
        <Link to={`/guia/${winery.slug}`} key={winery.id} className="block">
          <div className="bg-stone-800/50 p-4 rounded-lg flex items-center gap-4 hover:bg-stone-800/80 transition-colors">
            <img src={winery.image_urls?.[0] || 'https://images.unsplash.com/photo-1598521628464-3435b348a21e?q=80&w=2070&auto=format&fit=crop'} alt={winery.title} className="w-16 h-16 rounded-md object-cover" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-200">{winery.title}</h4>
              <p className="text-sm text-amber-100/70">{winery.city}, {winery.country}</p>
            </div>
            {winery.score && <WineryScoreDisplay score={winery.score} />}
          </div>
        </Link>
      ))}
    </div>
  );
};

const Perfil = () => {
  const { user, signOut, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profile: '',
    avatar_url: null,
    bio: '',
    interest_topic: '',
    points: 0,
    level: 'Novato'
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        profile: user.user_metadata?.profile || '',
        avatar_url: user.user_metadata?.avatar_url || null,
        bio: user.user_metadata?.bio || '',
        interest_topic: user.user_metadata?.interest_topic || '',
        points: user.points || 0,
        level: user.level || 'Novato'
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'bio' && value.length > 150) return;
    if (id === 'interest_topic' && value.length > 20) return;
    setFormData({ ...formData, [id]: value });
  };
  
  const handleProfileChange = (value) => {
    setFormData({ ...formData, profile: value });
  };
  
  const handlePictureChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        toast({ title: "Error al subir la foto", description: uploadError.message, variant: 'destructive' });
        setUploading(false);
        return;
      }
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      setFormData({ ...formData, avatar_url: publicUrl });

      const { error: updateUserError } = await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
      });

      if (updateUserError) {
          toast({ title: "Error al guardar la foto", description: updateUserError.message, variant: 'destructive' });
      } else {
          refreshUser();
          toast({ title: "Foto de perfil actualizada", description: "Tu nueva foto se ha guardado correctamente." });
      }
      setUploading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const profileData = {
        id: user.id,
        name: formData.name,
        profile: formData.profile,
        bio: formData.bio,
        interest_topic: formData.interest_topic,
        avatar_url: formData.avatar_url,
        updated_at: new Date(),
    };

    const { error: profileError } = await supabase.from('profiles').upsert(profileData);

    const userData = {
        name: formData.name,
        profile: formData.profile,
        bio: formData.bio,
        interest_topic: formData.interest_topic,
        avatar_url: formData.avatar_url,
    };

    const { error: userError } = await supabase.auth.updateUser({ data: userData });
    
    setLoading(false);

    if (profileError || userError) {
        toast({
            title: "Error al guardar",
            description: profileError?.message || userError?.message || "Ocurrió un error inesperado.",
            variant: 'destructive',
        });
    } else {
        refreshUser();
        toast({
            title: "Perfil Guardado",
            description: "Tus datos se han actualizado correctamente.",
        });
    }
  };
  
  const getInitials = (name) => {
    if (!name) return 'V';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };
  
  if (!user) {
    return null;
  }

  const currentLevelInfo = levelInfo[formData.level] || levelInfo['Novato'];
  const basePoints = formData.level === 'Novato' ? 0 : (formData.level === 'Aficionado' ? levelInfo['Novato'].nextLevelPoints : levelInfo['Aficionado'].nextLevelPoints);
  const progressPercentage = currentLevelInfo.nextLevelPoints === Infinity ? 100 : Math.min(((formData.points - basePoints) / (currentLevelInfo.nextLevelPoints - basePoints)) * 100, 100);

  return (
    <>
      <Helmet>
        <title>Mi Perfil - Vako Club</title>
        <meta name="description" content="Gestiona tu perfil y tus datos en Vako Club." />
      </Helmet>
      <div className="min-h-screen wine-pattern py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="font-playfair text-5xl font-bold wine-text-gradient mb-4">Mi Perfil</h1>
            <p className="text-xl text-amber-100/80">Gestiona tu información y preferencias.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-amber-300/50">
                        <AvatarImage src={formData.avatar_url} alt={formData.name} />
                        <AvatarFallback className="text-4xl bg-amber-800 text-amber-200">{getInitials(formData.name)}</AvatarFallback>
                      </Avatar>
                      <Label htmlFor="profilePicture" className="absolute bottom-0 right-0 bg-amber-200 text-stone-900 rounded-full p-2 cursor-pointer hover:bg-amber-300 transition-colors">
                        {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                        <Input id="profilePicture" type="file" className="hidden" onChange={handlePictureChange} accept="image/png, image/jpeg, image/jpg" disabled={uploading} />
                      </Label>
                    </div>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-amber-100">{formData.name}</h2>
                      <p className="text-amber-100/70">{formData.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-amber-200 font-medium">Nombre Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50" />
                        <Input id="name" type="text" placeholder="Tu nombre" className="pl-10" value={formData.name} onChange={handleInputChange} disabled={loading} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-amber-200 font-medium">Correo Electrónico</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50" />
                        <Input id="email" type="email" placeholder="tu@email.com" className="pl-10" value={formData.email} disabled />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-amber-200 font-medium">Biografía</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-5 w-5 text-amber-100/50" />
                      <textarea
                        id="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        maxLength="150"
                        rows="3"
                        className="w-full rounded-md border border-amber-500/20 bg-white/5 pl-10 pr-3 py-2 text-sm text-amber-100 ring-offset-background placeholder:text-amber-100/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                        placeholder="Cuéntanos un poco sobre ti y tu pasión por el vino..."
                        disabled={loading}
                      ></textarea>
                      <p className="text-right text-xs text-amber-100/50">{formData.bio.length}/150</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="interest_topic" className="text-amber-200 font-medium">Tema de Interés</Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50" />
                        <Input id="interest_topic" type="text" placeholder="Ej: Vinos de Burdeos" className="pl-10" value={formData.interest_topic} onChange={handleInputChange} maxLength="20" disabled={loading} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile" className="text-amber-200 font-medium">Perfil Profesional</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50 z-10" />
                          <Select onValueChange={handleProfileChange} value={formData.profile} disabled={loading}>
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Selecciona tu perfil" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sommelier">Sommelier</SelectItem>
                              <SelectItem value="enologo">Enólogo</SelectItem>
                              <SelectItem value="principiante">Principiante</SelectItem>
                              <SelectItem value="comercial">Comercial</SelectItem>
                              <SelectItem value="interesado">Interesado</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button type="button" variant="outline" className="w-full" onClick={() => toast({ title: "Próximamente", description: "Esta función estará disponible pronto."})}>
                      <Lock className="mr-2 h-4 w-4" />
                      Cambiar Contraseña
                    </Button>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                     <Button type="button" variant="ghost" className="text-red-400 hover:bg-red-400/10 hover:text-red-300" onClick={signOut} disabled={loading}>
                       Cerrar Sesión
                    </Button>
                    <Button type="submit" className="text-lg py-3 px-6" variant="default" disabled={loading || uploading}>
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            <div className="space-y-8">
              <div className="wine-glass-effect rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-amber-200 flex items-center">
                    <Award className="mr-2 h-6 w-6" />
                    Mi Progreso
                  </h3>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${currentLevelInfo.color}`}>{formData.level}</p>
                    <p className="text-sm text-amber-100/70">{formData.points} Puntos</p>
                  </div>
                </div>
                <div className="w-full bg-stone-700 rounded-full h-2.5">
                  <div className={`${currentLevelInfo.progressColor} h-2.5 rounded-full`} style={{ width: `${progressPercentage}%` }}></div>
                </div>
                {currentLevelInfo.nextLevel && (
                  <p className="text-xs text-center text-amber-100/60 mt-2">
                    {currentLevelInfo.nextLevelPoints - formData.points} puntos para el nivel {currentLevelInfo.nextLevel}
                  </p>
                )}
              </div>
              <div className="wine-glass-effect rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-semibold text-amber-200 flex items-center mb-4">
                  <Heart className="mr-2 h-6 w-6 text-red-800/80" />
                  Mis Bodegas Favoritas
                </h3>
                <FavoriteWineries userId={user.id} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Perfil;