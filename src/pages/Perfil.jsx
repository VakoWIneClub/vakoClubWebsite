import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Briefcase, Camera, Save, Lock, FileText, Tag, Loader2, Award, Heart, Compass } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';
import WineryScoreDisplay from '@/components/guia/WineryScoreDisplay';
import Reveal from '@/components/copa/Reveal';

const copaInput = 'rounded-none border-copa-gold bg-copa-cream text-copa-ink placeholder:text-copa-ink/40 focus-visible:ring-1 focus-visible:ring-copa-burgundy';
const copaLabel = 'font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/70';

const levelInfo = {
  'Novato': { color: 'text-copa-ink/70', border: 'border-copa-ink/30', nextLevel: 'Aficionado', nextLevelPoints: 150 },
  'Aficionado': { color: 'text-copa-gold', border: 'border-copa-gold', nextLevel: 'Experto', nextLevelPoints: 300 },
  'Experto': { color: 'text-copa-burgundy', border: 'border-copa-burgundy', nextLevel: null, nextLevelPoints: Infinity }
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
    return <div className="flex justify-center p-8"><Loader2 className="h-7 w-7 animate-spin text-copa-burgundy" /></div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-10 px-6 border border-dashed border-copa-gold/60">
        <Compass className="mx-auto h-10 w-10 text-copa-gold/60" />
        <h3 className="mt-4 font-cormorant" style={{ fontSize: 18 }}>Aún no tienes bodegas favoritas</h3>
        <p className="mt-1 text-sm text-copa-ink/60">Explora la guía y añade tus bodegas preferidas a tu colección.</p>
        <Link to="/guia" className="copa-link-nav font-jost text-[11px] tracking-[0.14em] uppercase inline-block mt-4">
          Ir a la Guía
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {favorites.map(winery => (
        <Link to={`/guia/${winery.slug}`} key={winery.id} className="block">
          <div className="border border-copa-gold/40 p-3 flex items-center gap-4 hover:border-copa-burgundy transition-colors">
            <img src={winery.image_urls?.[0] || 'https://images.unsplash.com/photo-1598521628464-3435b348a21e?q=80&w=2070&auto=format&fit=crop'} alt={winery.title} className="w-14 h-14 object-cover" />
            <div className="flex-1">
              <h4 className="font-cormorant" style={{ fontSize: 17 }}>{winery.title}</h4>
              <p className="text-sm text-copa-ink/60">{winery.city}, {winery.country}</p>
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
  // Hydrate the form from `user` once per visit (mount), not on every change to the user
  // object. `user` changes whenever refreshUser() runs — including the one this same page fires
  // after an avatar upload — so re-syncing on every change discarded whatever the admin had
  // typed into other fields in the meantime.
  const hydratedUserIdRef = useRef(null);

  useEffect(() => {
    if (user && hydratedUserIdRef.current !== user.id) {
      hydratedUserIdRef.current = user.id;
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

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));

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

  // basePoints must derive from the same normalized level as currentLevelInfo (both falling
  // back to 'Novato' together) — they used to be computed independently, so an unrecognized
  // `formData.level` value (stray DB edit, future level tier) fell through basePoints' own
  // ternary to the Experto-tier base (300) while currentLevelInfo fell back to Novato's
  // nextLevelPoints (150), producing a negative range and a progress bar that moved backwards.
  const normalizedLevel = levelInfo[formData.level] ? formData.level : 'Novato';
  const currentLevelInfo = levelInfo[normalizedLevel];
  const basePoints = normalizedLevel === 'Novato' ? 0 : (normalizedLevel === 'Aficionado' ? levelInfo['Novato'].nextLevelPoints : levelInfo['Aficionado'].nextLevelPoints);
  const progressPercentage = currentLevelInfo.nextLevelPoints === Infinity ? 100 : Math.min(((formData.points - basePoints) / (currentLevelInfo.nextLevelPoints - basePoints)) * 100, 100);

  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>Mi Perfil - Vako Club</title>
        <meta name="description" content="Gestiona tu perfil y tus datos en Vako Club." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20">
        <Reveal className="text-center mb-12">
          <div className="copa-eyebrow">Vako Club</div>
          <h1 className="font-cormorant font-light leading-[1.05] mt-4" style={{ fontSize: 'clamp(36px,5.5vw,56px)' }}>
            Mi Perfil
          </h1>
          <p className="mt-5 text-copa-ink/75" style={{ fontSize: 18 }}>Gestiona tu información y preferencias.</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Reveal className="lg:col-span-2">
            <div className="border border-copa-gold p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-28 w-28 border-2 border-copa-gold">
                      <AvatarImage src={formData.avatar_url} alt={formData.name} />
                      <AvatarFallback className="text-3xl bg-copa-burgundy text-copa-cream">{getInitials(formData.name)}</AvatarFallback>
                    </Avatar>
                    <label htmlFor="profilePicture" className="absolute bottom-0 right-0 bg-copa-burgundy text-copa-cream p-2 cursor-pointer hover:bg-copa-ink transition-colors">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                      <Input id="profilePicture" type="file" className="hidden" onChange={handlePictureChange} accept="image/png, image/jpeg, image/jpg" disabled={uploading} />
                    </label>
                  </div>
                  <div className="text-center">
                    <h2 className="font-cormorant" style={{ fontSize: 24 }}>{formData.name}</h2>
                    <p className="text-copa-ink/60 text-sm">{formData.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className={copaLabel}>Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-copa-ink/40" />
                      <Input id="name" type="text" placeholder="Tu nombre" className={`pl-10 ${copaInput}`} value={formData.name} onChange={handleInputChange} disabled={loading} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className={copaLabel}>Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-copa-ink/40" />
                      <Input id="email" type="email" placeholder="tu@email.com" className={`pl-10 ${copaInput}`} value={formData.email} disabled />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="bio" className={copaLabel}>Biografía</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-copa-ink/40" />
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      maxLength="150"
                      rows="3"
                      className={`w-full pl-10 pr-3 py-2 text-sm ${copaInput}`}
                      placeholder="Cuéntanos un poco sobre ti y tu pasión por el vino..."
                      disabled={loading}
                    ></textarea>
                    <p className="text-right text-xs text-copa-ink/50">{formData.bio.length}/150</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label htmlFor="interest_topic" className={copaLabel}>Tema de Interés</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-copa-ink/40" />
                      <Input id="interest_topic" type="text" placeholder="Ej: Vinos de Burdeos" className={`pl-10 ${copaInput}`} value={formData.interest_topic} onChange={handleInputChange} maxLength="20" disabled={loading} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="profile" className={copaLabel}>Perfil Profesional</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-copa-ink/40 z-10" />
                      <Select onValueChange={handleProfileChange} value={formData.profile} disabled={loading}>
                        <SelectTrigger id="profile" className={`pl-10 ${copaInput}`}>
                          <SelectValue placeholder="Selecciona tu perfil" />
                        </SelectTrigger>
                        <SelectContent className="border-copa-gold bg-copa-cream text-copa-ink rounded-none">
                          <SelectItem value="sommelier" className="focus:bg-copa-gold/20 focus:text-copa-ink">Sommelier</SelectItem>
                          <SelectItem value="enologo" className="focus:bg-copa-gold/20 focus:text-copa-ink">Enólogo</SelectItem>
                          <SelectItem value="principiante" className="focus:bg-copa-gold/20 focus:text-copa-ink">Principiante</SelectItem>
                          <SelectItem value="comercial" className="focus:bg-copa-gold/20 focus:text-copa-ink">Comercial</SelectItem>
                          <SelectItem value="interesado" className="focus:bg-copa-gold/20 focus:text-copa-ink">Interesado</SelectItem>
                          <SelectItem value="otro" className="focus:bg-copa-gold/20 focus:text-copa-ink">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toast({ title: "Próximamente", description: "Esta función estará disponible pronto." })}
                  className="copa-btn-secondary w-full inline-flex items-center justify-center"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Cambiar Contraseña
                </button>

                <div className="flex justify-between items-center pt-4 flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={signOut}
                    disabled={loading}
                    className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-burgundy hover:text-copa-ink transition-colors disabled:opacity-60"
                  >
                    Cerrar Sesión
                  </button>
                  <button type="submit" disabled={loading || uploading} className="copa-btn-primary inline-flex items-center">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="space-y-8">
            <div className="border border-copa-gold p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-cormorant flex items-center" style={{ fontSize: 20 }}>
                  <Award className="mr-2 h-5 w-5 text-copa-gold" />
                  Mi Progreso
                </h3>
                <div className="text-right">
                  <p className={`font-jost text-[10px] tracking-[0.14em] uppercase font-semibold ${currentLevelInfo.color}`}>{formData.level}</p>
                  <p className="text-sm text-copa-ink/60">{formData.points} Puntos</p>
                </div>
              </div>
              <div className="w-full bg-copa-gold/20 h-1.5">
                <div className="bg-copa-burgundy h-1.5" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              {currentLevelInfo.nextLevel && (
                <p className="text-xs text-center text-copa-ink/60 mt-2">
                  {currentLevelInfo.nextLevelPoints - formData.points} puntos para el nivel {currentLevelInfo.nextLevel}
                </p>
              )}
            </div>
            <div className="border border-copa-gold p-6">
              <h3 className="font-cormorant flex items-center mb-4" style={{ fontSize: 20 }}>
                <Heart className="mr-2 h-5 w-5 text-copa-burgundy" />
                Mis Bodegas Favoritas
              </h3>
              <FavoriteWineries userId={user.id} />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
