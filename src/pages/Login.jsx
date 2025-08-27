import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <p className="text-red-400 text-sm mt-1">{message}</p>;
};

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/perfil');
    }
  }, [user, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido.';
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
        title: "Campo inválido",
        description: "Por favor, completa los campos correctamente.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await signIn(formData.email, formData.password);
    
    if (!error) {
      navigate('/perfil');
    }
    setLoading(false);
  };
  
  if (user) return null;

  return (
    <>
      <Helmet>
        <link
          rel="icon"
          href="/images/VakoLogo.png"
          type="image/png"
          sizes="32x32"
        />
        <title>Iniciar Sesión - Vako Club</title>
        <meta name="description" content="Inicia sesión en tu cuenta de Vako Club para acceder a tus beneficios." />
      </Helmet>
      <div className="min-h-screen wine-pattern flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <LogIn className="h-12 w-12 mx-auto wine-text-gradient mb-4" />
              <h1 className="font-playfair text-4xl font-bold wine-text-gradient">
                Iniciar Sesión
              </h1>
              <p className="mt-2 text-amber-100/80">Bienvenido de nuevo a Vako Club.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-amber-200 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50" />
                  <Input id="email" type="email" placeholder="tu@email.com" className="pl-10" value={formData.email} onChange={handleChange} disabled={loading} />
                </div>
                <ErrorMessage message={errors.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-amber-200 font-medium">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Tu contraseña" className="pl-10 pr-10" value={formData.password} onChange={handleChange} disabled={loading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50 cursor-pointer">
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <ErrorMessage message={errors.password} />
              </div>
              <Button type="submit" className="w-full text-lg py-6" variant="default" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar al Club'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-amber-100/60">
              ¿No tienes cuenta?{' '}
              <Link to="/suscripcion" className="font-medium text-amber-200 hover:text-amber-300">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;