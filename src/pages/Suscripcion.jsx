import React, { useState, useEffect } from 'react';
import { Gem, Star, CheckCircle, UserPlus, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import Reveal from '@/components/copa/Reveal';
import Seo from '@/components/Seo';

const copaInput = 'rounded-none border-copa-gold bg-copa-cream text-copa-ink placeholder:text-copa-ink/40 focus-visible:ring-1 focus-visible:ring-copa-burgundy';
const copaLabel = 'font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/70';

const perks = [
  {
    icon: Gem,
    title: 'Acceso al Explorador Exclusivo',
    description: 'Explora nuestra selección curada de bodegas y vinos.',
  },
  {
    icon: Star,
    title: 'Guarda tus Favoritos',
    description: 'Crea listas personalizadas de tus vinos y bodegas preferidas.',
  },
  {
    icon: CheckCircle,
    title: 'Participa en la Comunidad',
    description: 'Conecta con otros amantes del vino en nuestros foros.',
  },
];

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <p className="text-red-600 text-sm mt-1">{message}</p>;
};

const Suscripcion = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, user } = useAuth();

  const from = location.state?.from?.pathname || '/perfil';

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validate = async () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'El nombre es obligatorio.';
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido.';
    } else {
      const { data, error } = await supabase.rpc('email_exists', { email_to_check: formData.email });
      if (error) console.error('Error checking email:', error);
      if (data) newErrors.email = 'Este correo electrónico ya está en uso.';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isValid = await validate();
    if (!isValid) {
      toast({
        title: "Campos inválidos",
        description: "Por favor, completa todos los campos correctamente.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await signUp(formData.email, formData.password, {
      data: {
        name: formData.name,
        avatar_url: `https://api.dicebear.com/6.x/initials/svg?seed=${formData.name}`,
      }
    });

    if (!error) {
      toast({
        title: "¡Registro exitoso!",
        description: "Te hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada.",
      });

      // Queda etiquetado en Hostinger Reach para la secuencia de bienvenida de socios gratuitos
      // (se arma a mano en el panel de Reach) — best-effort, nunca debe afectar el alta real.
      fetch('/api/subscribe-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: formData.name, source: 'socio-gratuito' }),
      }).catch(() => {});

      navigate('/email-verification');
    }
    setLoading(false);
  };

  if (user) return null;

  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Seo
        title="Suscripción - Vako Club"
        description="Únete a Vako Club y accede a un mundo de beneficios exclusivos para amantes del vino."
        path="/suscripcion"
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20">
        <Reveal className="text-center mb-12">
          <div className="copa-eyebrow">Vako Club</div>
          <h1 className="font-cormorant font-light leading-[1.05] mt-4" style={{ fontSize: 'clamp(36px,5.5vw,56px)' }}>
            Únete a la Comunidad Vako
          </h1>
          <p className="mt-5 text-copa-ink/75" style={{ fontSize: 18 }}>Regístrate gratis y descorcha un mundo de beneficios.</p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Reveal>
            <div className="border border-copa-gold p-8 md:p-12">
              <div className="text-center mb-8">
                <UserPlus className="h-9 w-9 text-copa-burgundy mx-auto mb-4" />
                <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(26px,3.6vw,32px)' }}>Crea tu Cuenta Gratis</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label htmlFor="name" className={copaLabel}>Nombre</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-copa-ink/40" />
                    <Input id="name" placeholder="Tu nombre" className={`pl-10 ${copaInput}`} value={formData.name} onChange={handleChange} disabled={loading} />
                  </div>
                  <ErrorMessage message={errors.name} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className={copaLabel}>Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-copa-ink/40" />
                    <Input id="email" type="email" placeholder="tu@email.com" className={`pl-10 ${copaInput}`} value={formData.email} onChange={handleChange} disabled={loading} />
                  </div>
                  <ErrorMessage message={errors.email} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="password" className={copaLabel}>Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-copa-ink/40" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className={`pl-10 pr-10 ${copaInput}`} value={formData.password} onChange={handleChange} disabled={loading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-copa-ink/40 hover:text-copa-burgundy transition-colors cursor-pointer">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <ErrorMessage message={errors.password} />
                </div>
                <button type="submit" disabled={loading} className="copa-btn-primary w-full">
                  {loading ? 'Creando cuenta...' : 'Registrarse Gratis'}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-copa-ink/60">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-medium text-copa-burgundy hover:text-copa-ink transition-colors">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="space-y-8">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div key={perk.title} className="flex items-start gap-4">
                  <div className="border border-copa-gold p-3 shrink-0">
                    <Icon className="h-5 w-5 text-copa-burgundy" />
                  </div>
                  <div>
                    <h3 className="font-cormorant" style={{ fontSize: 20 }}>{perk.title}</h3>
                    <p className="text-copa-ink/70 mt-1">{perk.description}</p>
                  </div>
                </div>
              );
            })}

            {/* Secundario a propósito: no compite con "Registrarse Gratis" (copa-btn-primary),
                pero le da una salida a quien llegó buscando directamente la guía paga, no la
                membresía — hoy esta página no la mencionaba en absoluto. */}
            <div className="pt-8 border-t border-copa-gold/40">
              <p className="font-jost text-[10px] tracking-[0.14em] uppercase text-copa-ink/50 mb-2">
                ¿Buscás algo más inmediato?
              </p>
              <p className="text-copa-ink/70" style={{ fontSize: 15, lineHeight: 1.6 }}>
                La membresía gratuita es el punto de partida, pero si ya sabés que querés aprender ya:
                nuestra guía completa en PDF, <strong className="text-copa-ink font-medium">El Mundo de la Copa</strong>,
                está disponible ahora mismo, sin esperar el registro.
              </p>
              <Link to="/tienda/el-mundo-de-la-copa" className="copa-btn-secondary inline-flex items-center mt-4">
                Conseguir la guía
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default Suscripcion;
