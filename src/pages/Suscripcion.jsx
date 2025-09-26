import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Gem, Star, CheckCircle, UserPlus, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <p className="text-red-400 text-sm mt-1">{message}</p>;
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
      navigate('/email-verification');
    }
    setLoading(false);
  };

  if (user) return null;

  return (
    <>
      <Helmet>
        <title>Suscripción - Vako Club</title>
        <meta name="description" content="Únete a Vako Club y accede a un mundo de beneficios exclusivos para amantes del vino." />
      </Helmet>
      <div className="min-h-screen wine-pattern py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="font-playfair text-5xl font-bold wine-text-gradient mb-4">Únete a la Comunidad Vako</h1>
            <p className="text-xl text-amber-100/80">Regístrate gratis y descorcha un mundo de beneficios.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <UserPlus className="h-12 w-12 mx-auto wine-text-gradient mb-4" />
                <h2 className="font-playfair text-3xl font-bold wine-text-gradient">Crea tu Cuenta Gratis</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-amber-200 font-medium">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50" />
                    <Input id="name" placeholder="Tu nombre" className="pl-10" value={formData.name} onChange={handleChange} disabled={loading} />
                  </div>
                  <ErrorMessage message={errors.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-200 font-medium">Correo Electrónico</Label>
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
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" value={formData.password} onChange={handleChange} disabled={loading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50 cursor-pointer">
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  <ErrorMessage message={errors.password} />
                </div>
                <Button type="submit" className="w-full text-lg py-6" variant="default" disabled={loading}>
                  {loading ? 'Creando cuenta...' : 'Registrarse Gratis'}
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-amber-100/60">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-medium text-amber-200 hover:text-amber-300">
                  Inicia sesión
                </Link>
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-amber-400/10 p-3 rounded-full">
                  <Gem className="h-6 w-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-amber-200">Acceso a la Guía Exclusiva</h3>
                  <p className="text-amber-100/70">Explora nuestra selección curada de bodegas y vinos.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-amber-400/10 p-3 rounded-full">
                  <Star className="h-6 w-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-amber-200">Guarda tus Favoritos</h3>
                  <p className="text-amber-100/70">Crea listas personalizadas de tus vinos y bodegas preferidas.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-amber-400/10 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-amber-200">Participa en la Comunidad</h3>
                  <p className="text-amber-100/70">Conecta con otros amantes del vino en nuestros foros.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Suscripcion;