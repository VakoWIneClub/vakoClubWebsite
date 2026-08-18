import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Reveal from '@/components/copa/Reveal';

const copaInput = 'rounded-none border-copa-gold bg-copa-cream text-copa-ink placeholder:text-copa-ink/40 focus-visible:ring-1 focus-visible:ring-copa-burgundy';
const copaLabel = 'font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/70';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <p className="text-red-600 text-sm mt-1">{message}</p>;
};

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user } = useAuth();

  const from = location.state?.from?.pathname || '/perfil';

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
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

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido.';
    }
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Campos inválidos",
        description: "Por favor, completa todos los campos correctamente.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await signIn(formData.email, formData.password);

    if (!error) {
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  if (user) return null;

  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen flex items-center justify-center py-16 px-4" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>Iniciar Sesión - Vako Club</title>
        <meta name="description" content="Inicia sesión en tu cuenta de Vako Club para acceder a tus beneficios." />
      </Helmet>
      <Reveal className="w-full max-w-md">
        <div className="border border-copa-gold p-8 md:p-12">
          <div className="text-center mb-8">
            <LogIn className="h-9 w-9 text-copa-burgundy mx-auto mb-4" />
            <div className="copa-eyebrow">Vako Club</div>
            <h1 className="font-cormorant font-light mt-3" style={{ fontSize: 'clamp(30px,4vw,40px)' }}>
              Iniciar Sesión
            </h1>
            <p className="mt-2 text-copa-ink/70">Bienvenido de nuevo a la comunidad.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-copa-ink/60">
            ¿No tienes cuenta?{' '}
            <Link to="/suscripcion" className="font-medium text-copa-burgundy hover:text-copa-ink transition-colors">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
};

export default Login;
