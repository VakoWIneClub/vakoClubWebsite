import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Loader2, PlusCircle, ChevronsDown } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import ArticleList from '@/components/noticias/ArticleList';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Reveal from '@/components/copa/Reveal';
import { isAdminUser } from '@/lib/utils';

const TAGS = ["Bodegas", "Vinos", "Maridajes", "Regiones", "Experiencias", "Noticias"];
const ARTICLES_PER_PAGE = 6;

const Noticias = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [activeTag, setActiveTag] = useState(queryParams.get('tag') || 'Todos');
  const isInitialLoad = useRef(true);
  // Any in-flight fetch (tag switch or load-more) is aborted before starting a new one — without
  // this, a slow "load more" request could resolve after a tag switch's fetch and merge stale
  // results into the newly-filtered list, and a fast tag switch could let an older response
  // overwrite a newer one.
  const activeControllerRef = useRef(null);

  const fetchArticles = useCallback(async (currentPage, currentTag) => {
    if (currentPage === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    activeControllerRef.current?.abort();
    const controller = new AbortController();
    activeControllerRef.current = controller;

    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (currentTag && currentTag !== 'Todos') {
      query = query.or(`tag1.eq.${currentTag},tag2.eq.${currentTag}`);
    }

    const from = currentPage * ARTICLES_PER_PAGE;
    const to = from + ARTICLES_PER_PAGE - 1;
    query = query.range(from, to).abortSignal(controller.signal);

    const { data, error, count } = await query;

    if (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching articles:', error);
      }
      if (currentPage === 0) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
      return;
    }

    setArticles(prev => {
      if (currentPage === 0) return data;
      // Defensive id-based dedupe in case the same page ever gets fetched twice (e.g. a rapid
      // double-click on "Cargar más" before the button's disabled state commits).
      const existingIds = new Set(prev.map(a => a.id));
      return [...prev, ...data.filter(a => !existingIds.has(a.id))];
    });
    setHasMore(from + data.length < count);

    if (currentPage === 0) {
      setLoading(false);
    } else {
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      fetchArticles(0, activeTag);
    }
  }, [activeTag, fetchArticles]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage, activeTag);
  };

  const handleTagClick = (tag) => {
    setArticles([]);
    setPage(0);
    setHasMore(true);
    setActiveTag(tag);
    isInitialLoad.current = true;
    if (tag === 'Todos') {
      navigate('/noticias');
    } else {
      navigate(`/noticias?tag=${tag}`);
    }
  };

  const handleArticleDeleted = (deletedArticleId) => {
    setArticles(articles.filter(article => article.id !== deletedArticleId));
  };

  const isAdmin = isAdminUser(user);

  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>Noticias del Vino - Vako Club</title>
        <meta name="description" content="Mantente al día con las últimas noticias, artículos y tendencias del mundo del vino. Descubre bodegas, maridajes y más en Vako Club." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20">
        <Reveal className="text-center mb-12">
          <div className="copa-eyebrow">Vako Club</div>
          <h1 className="font-cormorant font-light leading-[1.05] mt-4" style={{ fontSize: 'clamp(36px,5.5vw,56px)' }}>
            Noticias del Vino
          </h1>
          <p className="mt-5 text-copa-ink/75 max-w-3xl mx-auto" style={{ fontSize: 18, lineHeight: 1.6 }}>
            Tu fuente de información sobre bodegas, maridajes, regiones y todo lo relacionado con el fascinante universo del vino.
          </p>
        </Reveal>

        {isAdmin && (
          <Reveal delay={0.05} className="mb-8 text-center">
            <Link to="/noticias/crear" className="copa-btn-primary inline-flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear Artículo
            </Link>
          </Reveal>
        )}

        <Reveal delay={0.1} className="mb-12 flex flex-wrap justify-center items-center gap-3 font-jost text-[11px] tracking-[0.14em] uppercase">
          <button
            type="button"
            onClick={() => handleTagClick('Todos')}
            className={activeTag === 'Todos' ? 'copa-btn-nav' : 'border border-copa-gold text-copa-ink/70 hover:border-copa-burgundy hover:text-copa-burgundy transition-colors px-[18px] py-[11px]'}
          >
            Todos
          </button>
          {TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className={activeTag === tag ? 'copa-btn-nav' : 'border border-copa-gold text-copa-ink/70 hover:border-copa-burgundy hover:text-copa-burgundy transition-colors px-[18px] py-[11px]'}
            >
              {tag}
            </button>
          ))}
        </Reveal>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 text-copa-burgundy animate-spin" />
          </div>
        ) : (
          <>
            <ArticleList
              articles={articles}
              isAdmin={isAdmin}
              onArticleDeleted={handleArticleDeleted}
              onTagClick={handleTagClick}
            />
            {hasMore && (
              <div className="mt-12 text-center">
                <button type="button" onClick={handleLoadMore} disabled={loadingMore} className="copa-btn-primary inline-flex items-center">
                  {loadingMore ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronsDown className="mr-2 h-4 w-4" />
                  )}
                  Cargar más artículos
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Noticias;
