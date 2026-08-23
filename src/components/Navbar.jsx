import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LogOut, User as UserIcon, Gem } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { isAdminUser } from '@/lib/utils';

const NAV_ITEMS = [
  { name: 'Inicio', path: '/' },
  { name: 'Guía', path: '/guia' },
  { name: 'Noticias', path: '/noticias' },
  { name: 'Tienda', path: '/tienda' },
  { name: 'Eventos', path: '/eventos' },
  { name: 'Comunidad', path: '/comunidad' },
  { name: 'Contacto', path: '/contacto' },
];

// Not launched yet — only shown to admins previewing it, via useNavItems below.
const ADMIN_ONLY_NAV_ITEMS = [
  { name: 'Academia', path: '/educacion' },
];

const useNavItems = (user) => (isAdminUser(user) ? [...NAV_ITEMS, ...ADMIN_ONLY_NAV_ITEMS] : NAV_ITEMS);

const isItemActive = (pathname, itemPath) =>
  pathname.startsWith(itemPath) && (itemPath !== '/' || pathname === '/');

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const navItems = useNavItems(user);

  const getInitials = (name) => {
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

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-copa-gold">
            <AvatarImage src={user.user_metadata?.profilePicture || user.user_metadata?.avatar_url || ''} alt={user.user_metadata?.name} />
            <AvatarFallback className="bg-copa-burgundy text-copa-cream">{getInitials(user.user_metadata?.name)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border-copa-gold bg-copa-cream text-copa-ink" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-copa-ink">{user.user_metadata?.name || user.email}</p>
            <p className="text-xs leading-none text-copa-ink/60">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-copa-gold/30" />
        <DropdownMenuItem className="focus:bg-copa-gold/20 focus:text-copa-ink" onSelect={() => navigate('/perfil')}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-copa-gold/20 focus:text-copa-ink" onSelect={() => navigate('/perfil/suscripcion')}>
          <Gem className="mr-2 h-4 w-4" />
          <span>Suscripción</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-copa-gold/30" />
        <DropdownMenuItem className="focus:bg-copa-gold/20 focus:text-copa-ink" onSelect={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="copa-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/VakoLogo.png" alt="Vako Club" className="h-10 w-10 rounded-full" />
            <span className="font-jost text-[11px] tracking-[0.22em] uppercase text-copa-ink">Vako Club</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 font-jost text-[11px] tracking-[0.16em] uppercase">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={isItemActive(location.pathname, item.path) ? 'text-copa-burgundy' : 'copa-link-nav'}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link to="/login" className="copa-link-nav font-jost text-[11px] tracking-[0.16em] uppercase">
                  Iniciar sesión
                </Link>
                <Link to="/suscripcion" className="copa-btn-nav">
                  Suscripción
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            {user && <UserMenu />}
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              className="text-copa-ink p-1"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-copa-gold overflow-hidden"
            >
              <div className="py-6 flex flex-col gap-5 font-jost text-xs tracking-[0.14em] uppercase">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={isItemActive(location.pathname, item.path) ? 'text-copa-burgundy' : 'text-copa-ink/70'}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              {!user && (
                <div className="pb-6 pt-2 border-t border-copa-gold/40 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="copa-btn-secondary text-center">
                    Iniciar sesión
                  </Link>
                  <Link to="/suscripcion" onClick={() => setIsOpen(false)} className="copa-btn-nav text-center">
                    Suscripción
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
