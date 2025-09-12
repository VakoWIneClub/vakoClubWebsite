
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, User, Lock, Star, Gem, Crown, CheckCircle, Briefcase, Eye, EyeOff, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const SubscriptionCard = ({
  icon,
  title,
  price,
  features,
  available,
  onSelect
}) => {
  const Icon = icon;
  const isClickable = available && onSelect;
  return (
    <div className="relative h-full">
      <motion.div
        whileHover={isClickable ? { y: -10, scale: 1.05 } : {}}
        className={`wine-card rounded-2xl p-8 text-center h-full flex flex-col justify-between ${!available ? 'opacity-40' : ''} ${isClickable ? 'cursor-pointer' : ''}`}
        onClick={isClickable ? onSelect : null}
      >
        <div className={`flex-grow ${!available ? 'filter blur-sm' : ''}`}>
          <div className="inline-flex p-4 rounded-full bg-amber-200/10 mb-4">
            <Icon className="h-8 w-8 text-amber-200" />
          </div>
          <h3 className="font-playfair text-2xl font-semibold text-amber-200 mb-2">{title}</h3>
          <p className="text-4xl font-bold wine-text-gradient mb-6">{price}</p>
          <ul className="space-y-3 text-left">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-amber-100/80">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        {available && (
          <Button variant="outline" className={`mt-8 w-full ${!available ? 'filter blur-sm' : ''}`}>
            Seleccionar Plan
          </Button>
        )}
      </motion.div>
      {!available && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="bg-stone-900/80 text-amber-100 font-bold py-2 px-4 rounded-lg z-10">
            Próximamente
          </span>
        </div>
      )}
    </div>
  );
};

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <p className="text-red-400 text-sm mt-1">{message}</p>;
};

const Suscripcion = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/perfil');
    }
  }, [user, navigate]);

  const subscriptionPlans = [
    { icon: Star, title: "Plan Aficionado", price: "Gratis", features: ["Guía de bodegas", "Acceso al foro", "Perfil de miembro"], available: true },
    { icon: Gem, title: "Plan Sommelier", price: "$9/mes", features: ["Todo en Aficionado", "Catas virtuales", "Contenido exclusivo"], available: false },
    { icon: Crown, title: "Plan Reserva", price: "$19/mes", features: ["Todo en Sommelier", "Envío de vinos trimestral", "Acceso prioritario a eventos"], available: false },
  ];

  const handleSelectPlan = () => {
    setShowRegistration(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido.';
    }
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria.';
    if (formData.password && formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    if (!formData.profile) newErrors.profile = 'Debes seleccionar un perfil.';
    if (!termsAccepted) newErrors.terms = 'Debes aceptar los términos y condiciones.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleProfileChange = value => {
    setFormData(prev => ({ ...prev, profile: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, completa todos los campos correctamente.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);

    try {
      const { data: emailExists, error: rpcError } = await supabase.rpc('email_exists', {
        email_to_check: formData.email
      });

      if (rpcError) {
        throw rpcError;
      }

      if (emailExists) {
        toast({
          title: "Correo ya registrado",
          description: "Ya existe una cuenta con este correo. Por favor, inicia sesión.",
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const { error } = await signUp(formData.email, formData.password, {
        data: {
          name: formData.name,
          profile: formData.profile
        }
      });

      if (error) {
        toast({
          title: "Error al registrarse",
          description: error.message || "Ocurrió un error inesperado.",
          variant: 'destructive',
        });
        return;
      }
      
      setShowVerificationPopup(true);

    } catch (error) {
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error. Por favor, inténtalo de nuevo.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseVerificationPopup = () => {
    setShowVerificationPopup(false);
    navigate('/login');
  };

  if (user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Suscripción - Vako Club</title>
        <meta name="description" content="Únete a Vako Club y accede a un mundo de beneficios exclusivos, catas, y contenido premium sobre vinos." />
      </Helmet>

      <div className="min-h-screen wine-pattern py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="font-playfair text-5xl font-bold wine-text-gradient mb-4">Elige tu Aventura</h1>
            <p className="text-xl text-amber-100/80 max-w-3xl mx-auto">
              Únete a nuestra comunidad y eleva tu pasión por el vino. Tenemos un plan para cada tipo de aficionado.
            </p>
          </motion.div>

          {!showRegistration ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subscriptionPlans.map((plan, index) => (
                <SubscriptionCard key={index} {...plan} onSelect={plan.available ? handleSelectPlan : null} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md mx-auto"
            >
              <div className="wine-glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
                <div className="text-center mb-8">
                  <UserPlus className="h-12 w-12 mx-auto wine-text-gradient mb-4" />
                  <h1 className="font-playfair text-4xl font-bold wine-text-gradient">
                    Crea tu Cuenta Gratis
                  </h1>
                  <p className="mt-2 text-amber-100/80">Y empieza a disfrutar de Vako Club.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-amber-200 font-medium">Nombre Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50" />
                      <Input id="name" type="text" placeholder="Tu nombre y apellido" className="pl-10" value={formData.name} onChange={handleChange} disabled={loading} />
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
                      <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" className="pl-10 pr-10" value={formData.password} onChange={handleChange} disabled={loading} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50 cursor-pointer">
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                     <ErrorMessage message={errors.password} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="profile" className="text-amber-200 font-medium">¿Cuál es tu perfil?</Label>
                     <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-100/50" />
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
                     <ErrorMessage message={errors.profile} />
                  </div>

                  <div className="items-top flex space-x-2 pt-2">
                    <Checkbox id="terms" checked={termsAccepted} onCheckedChange={setTermsAccepted} />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor="terms" className="text-sm font-medium leading-none text-amber-100/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Acepto los{' '}
                        <Link to="/terminos" target="_blank" className="underline text-amber-200 hover:text-amber-300">Términos y Condiciones</Link>
                        {' y la '}<Link to="/politica-privacidad" target="_blank" className="underline text-amber-200 hover:text-amber-300">Política de Privacidad</Link>.
                      </label>
                    </div>
                  </div>
                  <ErrorMessage message={errors.terms} />

                  <Button type="submit" className="w-full text-lg py-6 mt-6" variant="default" disabled={loading || !termsAccepted}>
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AlertDialog open={showVerificationPopup} onOpenChange={setShowVerificationPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-5, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <MailCheck className="h-16 w-16 text-amber-400" />
              </motion.div>
            </div>
            <AlertDialogTitle className="text-center font-playfair text-2xl">
              ¡Último paso! Verifica tu correo
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
                Hemos enviado un enlace de verificación a <strong>{formData.email}</strong>. Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para activar tu cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button className="w-full" onClick={handleCloseVerificationPopup}>
              Entendido
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Suscripcion;
