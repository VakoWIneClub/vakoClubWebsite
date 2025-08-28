import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingBag, Users, Calendar, Home, Phone, Compass, UserPlus, LogIn, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();
  const logoUrl = 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1376a1dc-c051-4229-8281-e847b8e98dae/679ab33053f5b8d0d4f73e2d796f0a32.png';
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navItems = [{
    name: 'Inicio',
    path: '/',
    icon: Home
  }, {
    name: 'Guía',
    path: '/guia',
    icon: Compass
  }, {
    name: 'Tienda',
    path: '/tienda',
    icon: ShoppingBag
  }, {
    name: 'Eventos',
    path: '/eventos',
    icon: Calendar
  }, {
    name: 'Comunidad',
    path: '/comunidad',
    icon: Users
  }, {
    name: 'Contacto',
    path: '/contacto',
    icon: Phone
  }];
  const getInitials = name => {
    if (!name) return 'V';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const UserMenu = () => <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-amber-300/50">
            <AvatarImage src={user.user_metadata?.profilePicture || user.user_metadata?.avatar_url || ''} alt={user.user_metadata?.name} />
            <AvatarFallback className="bg-amber-800 text-amber-200">{getInitials(user.user_metadata?.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-amber-50">{user.user_metadata?.name || user.email}</p>
            <p className="text-xs leading-none text-amber-100/70">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('/perfil')}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>;
  return <motion.nav initial={{
    y: -100
  }} animate={{
    y: 0
  }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'wine-glass-effect wine-shadow' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div whileHover={{
            scale: 1.05
          }} className="flex items-center">
              <img src={logoUrl} alt="Vako Club Logo" className="h-16 w-auto" />
            </motion.div>
            <span className="hidden sm:block text-sm font-light text-amber-100/70 tracking-wider">Exclusiva Guía de Vinos</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return <Link key={item.path} to={item.path} className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group ${isActive ? 'text-white' : 'text-amber-100 hover:text-white hover:bg-white/10'}`}>
                  <Icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && <motion.div layoutId="active-nav-link" className="absolute inset-0 bg-white/10 rounded-lg -z-10" transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30
              }} />}
                </Link>;
          })}
             <div className="flex items-center space-x-2 ml-4">
              {user ? <UserMenu /> : <>
                  <Link to="/login">
                    <Button variant="ghost">
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/suscripcion">
                    <Button variant="default">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Suscripción
                    </Button>
                  </Link>
                </>}
            </div>
          </div>

          <div className="md:hidden flex items-center">
             {user ? <UserMenu /> : <>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-amber-100 hover:text-white hover:bg-white/10">
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </>}
               {!user && <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-amber-100 hover:text-white hover:bg-white/10">
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>}
          </div>
        </div>

        {isOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} className="md:hidden wine-glass-effect rounded-lg mt-2 mb-4 overflow-hidden">
            <div className="px-4 py-6 space-y-4">
              {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/10 text-white' : 'text-amber-100 hover:text-white hover:bg-white/10'}`}>
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>;
          })}
              {!user && <div className="pt-4 border-t border-amber-200/20 flex flex-col space-y-2">
                   <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <LogIn className="mr-2 h-4 w-4" />
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/suscripcion" onClick={() => setIsOpen(false)}>
                      <Button variant="default" className="w-full">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Suscripción
                      </Button>
                    </Link>
                </div>}
            </div>
          </motion.div>}
      </div>
    </motion.nav>;
};
export default Navbar;