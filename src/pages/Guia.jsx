import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Loader2, PlusCircle, ChevronsDown, Search, X, List, Map } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useSearchParams } from 'react-router-dom';
import WineryList from '@/components/guia/WineryList';
import GuideMap from '@/components/guia/GuideMap';
import Reveal from '@/components/copa/Reveal';
import { isAdminUser } from '@/lib/utils';

const WINERIES_PER_PAGE = 9;

const copaInput = 'h-10 w-full rounded-none border border-copa-gold bg-copa-cream px-3 py-2 text-sm text-copa-ink placeholder:text-copa-ink/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-copa-burgundy';
const copaLabel = 'block font-jost text-[10px] tracking-[0.14em] uppercase text-copa-ink/70 mb-1.5';

const Guia = () => {
  const {
    user
  } = useAuth();
  const { toast } = useToast();
  const [wineries, setWineries] = useState([]);
  const [allWineriesForMap, setAllWineriesForMap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [countries, setCountries] = useState([]);
  const [totalWineries, setTotalWineries] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const nameFilter = useMemo(() => searchParams.get('name') || '', [searchParams]);
  const countryFilter = useMemo(() => searchParams.get('country') || '', [searchParams]);
  const cityFilter = useMemo(() => searchParams.get('city') || '', [searchParams]);
  const [nameInput, setNameInput] = useState(nameFilter);
  const [cityInput, setCityInput] = useState(cityFilter);
  const loadMoreControllerRef = useRef(null);
  useEffect(() => {
    const fetchInitialData = async () => {
      // Neither of these drives the page's main loading state, but a thrown (rather than
      // resolved-with-error) network failure would otherwise be an unhandled rejection — wrap so
      // one failing request doesn't silently take the other down with it.
      try {
        const {
          data: countriesData,
          error: countriesError
        } = await supabase.from('wineries').select('country');
        if (countriesError) throw countriesError;
        const uniqueCountries = [...new Set(countriesData.map(w => w.country).filter(Boolean))].sort();
        setCountries(uniqueCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }

      try {
        const {
          data: mapData,
          error: mapError
        } = await supabase.from('wineries').select('id, title, slug, latitude, longitude, city, country').filter('latitude', 'not.is', null).filter('longitude', 'not.is', null);
        if (mapError) throw mapError;
        setAllWineriesForMap(mapData);
      } catch (error) {
        console.error('Error fetching wineries for map:', error);
      }

      try {
        const {
          count: totalCount,
          error: totalError
        } = await supabase.from('wineries').select('id', { count: 'exact', head: true });
        if (totalError) throw totalError;
        setTotalWineries(totalCount ?? 0);
      } catch (error) {
        console.error('Error fetching total wineries count:', error);
      }
    };
    fetchInitialData();
  }, []);
  const fetchWineries = useCallback(async (currentPage, name, country, city, isLoadMore = false, abortSignal) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    // try/finally: a transient network failure can make the query *throw* instead of resolving
    // to {error} — without this, that exception used to skip past setLoading(false) entirely,
    // leaving the spinner stuck until a full page reload.
    try {
      let query = supabase.from('wineries').select('*', {
        count: 'exact'
      }).order('created_at', {
        ascending: false
      });
      if (name) query = query.ilike('title', `%${name}%`);
      if (country) query = query.eq('country', country);
      if (city) query = query.ilike('city', `%${city}%`);
      const from = currentPage * WINERIES_PER_PAGE;
      const to = from + WINERIES_PER_PAGE - 1;
      query = query.range(from, to);
      if (abortSignal) {
        query.abortSignal(abortSignal);
      }
      const {
        data,
        error,
        count
      } = await query;
      if (error) throw error;

      setWineries(prev => {
        const newWineries = isLoadMore ? [...prev, ...data] : data;
        setHasMore(newWineries.length < (count ?? 0));
        return newWineries;
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching wineries:', error);
        toast({
          variant: 'destructive',
          title: 'No se pudieron cargar las bodegas',
          description: 'Hubo un problema de conexión. Probá de nuevo en unos segundos.',
        });
      }
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [toast]);
  useEffect(() => {
    const controller = new AbortController();
    // A "load more" in flight when the filters change must not be allowed to resolve later and
    // merge its old-filter results onto the newly-filtered list — handleLoadMore below never
    // cancelled its own request, unlike this effect.
    loadMoreControllerRef.current?.abort();
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
    setSearchParams({
      name: nameInput,
      country: countryFilter,
      city: cityInput
    });
  };
  const handleCountryChange = value => {
    setPage(0);
    setWineries([]);
    setSearchParams({
      name: nameInput,
      country: value === 'all' ? '' : value,
      city: cityInput
    });
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
    const controller = new AbortController();
    loadMoreControllerRef.current = controller;
    fetchWineries(nextPage, nameFilter, countryFilter, cityFilter, true, controller.signal);
  };
  const handleWineryDeleted = deletedWineryId => {
    setWineries(wineries.filter(winery => winery.id !== deletedWineryId));
    setAllWineriesForMap(allWineriesForMap.filter(winery => winery.id !== deletedWineryId));
  };
  const isAdmin = isAdminUser(user);
  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>Explorador de Bodegas - Vako Club</title>
        <meta name="description" content="Descubre nuestro Explorador exclusivo de bodegas. Lugares únicos, vinos excepcionales y experiencias inolvidables con la curaduría de Vako Club." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20">
        <Reveal className="text-center mb-12">
          <div className="copa-eyebrow">Vako Club</div>
          <h1 className="font-cormorant font-light leading-[1.05] mt-4" style={{ fontSize: 'clamp(36px,5.5vw,56px)' }}>
            Explora el mundo de bodegas
          </h1>
          <p className="mt-5 text-copa-ink/75 max-w-3xl mx-auto" style={{ fontSize: 18, lineHeight: 1.6 }}>
            Descubrí bodegas de todos los rincones del mundo, curadas por Vako Club. Filtrá en la lista o explorá el mapa.
          </p>
          {totalWineries !== null && totalWineries > 0 && (
            <p className="mt-4 font-jost text-[11px] tracking-[0.14em] uppercase text-copa-burgundy">
              +{totalWineries} bodegas registradas
            </p>
          )}
        </Reveal>

        <Reveal delay={0.05} className="border border-copa-gold bg-copa-creamDeep p-6 mb-12">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name-filter" className={copaLabel}>Nombre</label>
                <Input id="name-filter" placeholder="Ej: Catena Zapata" value={nameInput} onChange={e => setNameInput(e.target.value)} className={copaInput} />
              </div>
              <div>
                <label htmlFor="country-filter" className={copaLabel}>País</label>
                <Select onValueChange={handleCountryChange} value={countryFilter || 'all'}>
                  <SelectTrigger id="country-filter" className={copaInput}>
                    <SelectValue placeholder="Seleccionar país" />
                  </SelectTrigger>
                  <SelectContent className="border-copa-gold bg-copa-cream text-copa-ink rounded-none">
                    <SelectItem value="all" className="focus:bg-copa-gold/20 focus:text-copa-ink">Todos los países</SelectItem>
                    {countries.map(country => <SelectItem key={country} value={country} className="focus:bg-copa-gold/20 focus:text-copa-ink">{country}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="city-filter" className={copaLabel}>Ciudad</label>
                <Input id="city-filter" placeholder="Ej: Mendoza" value={cityInput} onChange={e => setCityInput(e.target.value)} className={copaInput} />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="copa-btn-nav flex-1 inline-flex items-center justify-center">
                <Search className="mr-2 h-4 w-4" /> Buscar
              </button>
              {(nameFilter || countryFilter || cityFilter) && (
                <button type="button" onClick={clearFilters} className="copa-btn-secondary flex-1 inline-flex items-center justify-center">
                  <X className="mr-2 h-4 w-4" /> Limpiar
                </button>
              )}
            </div>
            {isAdmin && (
              <div className="text-center md:text-right">
                <Link to="/guia/crear" className="copa-btn-nav inline-flex items-center justify-center w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir Bodega
                </Link>
              </div>
            )}
          </form>
        </Reveal>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-96 mx-auto mb-8 h-11 rounded-none border border-copa-gold bg-copa-cream p-1">
            <TabsTrigger
              value="list"
              className="rounded-none font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 data-[state=active]:bg-copa-burgundy data-[state=active]:text-copa-cream data-[state=active]:shadow-none"
            >
              <List className="mr-2 h-4 w-4" />Lista
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="rounded-none font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 data-[state=active]:bg-copa-burgundy data-[state=active]:text-copa-cream data-[state=active]:shadow-none"
            >
              <Map className="mr-2 h-4 w-4" />Mapa
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 text-copa-burgundy animate-spin" />
              </div>
            ) : (
              <>
                <WineryList wineries={wineries} isAdmin={isAdmin} onWineryDeleted={handleWineryDeleted} />
                {wineries.length > 0 && hasMore && (
                  <div className="mt-12 text-center">
                    <button type="button" onClick={handleLoadMore} disabled={loadingMore} className="copa-btn-primary inline-flex items-center">
                      {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronsDown className="mr-2 h-4 w-4" />}
                      Cargar más bodegas
                    </button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          <TabsContent value="map">
            <GuideMap wineries={allWineriesForMap} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default Guia;
