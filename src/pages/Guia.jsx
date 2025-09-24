
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Compass, Loader2, PlusCircle, ChevronsDown, Search, X } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useSearchParams } from 'react-router-dom';
import WineryList from '@/components/guia/WineryList';

const WINERIES_PER_PAGE = 9;

const Guia = () => {
  const { user } = useAuth();
  const [wineries, setWineries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [countries, setCountries] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const nameFilter = useMemo(() => searchParams.get('name') || '', [searchParams]);
  const countryFilter = useMemo(() => searchParams.get('country') || '', [searchParams]);
  const cityFilter = useMemo(() => searchParams.get('city') || '', [searchParams]);

  const [nameInput, setNameInput] = useState(nameFilter);
  const [cityInput, setCityInput] = useState(cityFilter);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase.from('wineries').select('country');
      if (error) {
        console.error('Error fetching countries:', error);
      } else {
        const uniqueCountries = [...new Set(data.map(w => w.country).filter(Boolean))].sort();
        setCountries(uniqueCountries);
      }
    };
    fetchCountries();
  }, []);

  const fetchWineries = useCallback(async (currentPage, name, country, city, isLoadMore = false, abortSignal) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    let query = supabase
      .from('wineries')
      .select('*', { count: 'exact' })
      .order('score', { ascending: false, nulls: 'last' })
      .order('created_at', { ascending: false });

    if (name) query = query.ilike('title', `%${name}%`);
    if (country) query = query.eq('country', country);
    if (city) query = query.ilike('city', `%${city}%`);

    const from = currentPage * WINERIES_PER_PAGE;
    const to = from + WINERIES_PER_PAGE - 1;
    query = query.range(from, to);

    if (abortSignal) {
      query.abortSignal(abortSignal);
    }

    const { data, error, count } = await query;

    if (error && error.name !== 'AbortError') {
      console.error('Error fetching wineries:', error);
    } else if (data) {
      setWineries(prev => {
        const newWineries = isLoadMore ? [...prev, ...data] : data;
        setHasMore(newWineries.length < (count ?? 0));
        return newWineries;
      });
    }

    if (isLoadMore) {
      setLoadingMore(false);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setPage(0);
    fetchWineries(0, nameFilter, countryFilter, cityFilter, false, controller.signal);
    return () => {
      controller.abort();
    };
  }, [nameFilter, countryFilter, cityFilter, fetchWineries]);

  const handleSearch = e => {
    e.preventDefault();
    setPage(0);
    setWineries([]);
    setSearchParams({ name: nameInput, country: countryFilter, city: cityInput });
  };

  const handleCountryChange = (value) => {
    setPage(0);
    setWineries([]);
    setSearchParams({ name: nameInput, country: value === 'all' ? '' : value, city: cityInput });
  };

  const clearFilters = () => {
    setNameInput('');
    setCityInput('');
    setPage(0);
    setWineries([]);
    setSearchParams({});
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWineries(nextPage, nameFilter, countryFilter, cityFilter, true);
  };

  const handleWineryDeleted = (deletedWineryId) => {
    setWineries(wineries.filter(winery => winery.id !== deletedWineryId));
  };

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  return (
    <>
      <Helmet>
        <title>Guía de Bodegas - Vako Club</title>
        <meta name="description" content="Explora nuestra guía exclusiva de bodegas. Descubre lugares únicos, vinos excepcionales y experiencias inolvidables con la curaduría de Vako Club." />
      </Helmet>

      <div className="min-h-screen wine-pattern pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Compass className="h-16 w-16 mx-auto wine-text-gradient mb-4" />
            <h1 className="font-playfair text-5xl md:text-6xl font-bold wine-text-gradient">
              Guía de Bodegas
            </h1>
            <p className="mt-4 text-xl text-amber-100/80 max-w-3xl mx-auto">Encuentra tu bodega favorita en nuestra guía, evaluadas con puntajes primpios de Vako Club</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="wine-card rounded-2xl p-6 mb-12"
          >
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="name-filter" className="block text-sm font-medium text-amber-200 mb-1">Nombre</label>
                  <Input id="name-filter" placeholder="Ej: Catena Zapata" value={nameInput} onChange={e => setNameInput(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="country-filter" className="block text-sm font-medium text-amber-200 mb-1">País</label>
                  <Select onValueChange={handleCountryChange} value={countryFilter || 'all'}>
                    <SelectTrigger id="country-filter">
                      <SelectValue placeholder="Seleccionar país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los países</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="city-filter" className="block text-sm font-medium text-amber-200 mb-1">Ciudad</label>
                  <Input id="city-filter" placeholder="Ej: Mendoza" value={cityInput} onChange={e => setCityInput(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="w-full">
                  <Search className="mr-2 h-4 w-4" /> Buscar
                </Button>
                {(nameFilter || countryFilter || cityFilter) && (
                  <Button type="button" variant="ghost" onClick={clearFilters} className="w-full">
                    <X className="mr-2 h-4 w-4" /> Limpiar
                  </Button>
                )}
              </div>
              {isAdmin && (
                <div className="text-center md:text-right">
                  <Button asChild size="lg" className="w-full">
                    <Link to="/guia/crear">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Añadir Bodega
                    </Link>
                  </Button>
                </div>
              )}
            </form>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 text-amber-300 animate-spin" />
             </div>
          ) : (
            <>
              <WineryList wineries={wineries} isAdmin={isAdmin} onWineryDeleted={handleWineryDeleted} />
              {wineries.length > 0 && hasMore && (
                <div className="mt-12 text-center">
                  <Button onClick={handleLoadMore} disabled={loadingMore} size="lg">
                    {loadingMore ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ChevronsDown className="mr-2 h-5 w-5" />}
                    Cargar más bodegas
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Guia;
